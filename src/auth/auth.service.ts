import * as bcrypt from "bcrypt";
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInAuthDto } from "./dto/sign-in.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "@/users/users.service";
import { UserFromToken } from "./dto/token-payload.dto";
import { BlackListService } from "@/auth/black-list/black-list.service";
import { MailerService } from "@/mailer/mailer.service";
import { SendMailDto } from "@/mailer/dto/send-mail.dto";
import { templateFormatter } from "@/mailer/utils/replacer";
import { templateRecoveryPassword } from "@/mailer/templates/recovery-password";
import { RecoveryPasswordDto } from "./dto/recovery-password.dto copy";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { generateProvisionalPasswordHash } from "@/utils/functions/generateProvisionalPasswordHash";
import { RabbitmqService } from "@/rabbitmq/rabbitmq.service";


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private blackListService: BlackListService,
    private mailerService: MailerService,
    private rabbitmqService: RabbitmqService,
    private configService: ConfigService
  ) { }

  async signIn({ email, password: pass }: SignInAuthDto): Promise<any> {
    try {
      const user = await this.usersService.findOneByEmail({email, active: true });

      if (!user?.id) {
        throw new UnauthorizedException('Usuário não autorizado.');
      }

      const isMatch = await bcrypt.compare(pass, user.password);

      if (!isMatch) {
        throw new UnauthorizedException('Usuário ou senha incorretos.');
      }

      const payload = {
        sub: user.id,
        username: `${user.name} ${user.lastname}`,
        email: user.email
      }

      const tokenSecret = this.configService.get<string>("JWT_SECRET");
      const refreshTokenSecret = this.configService.get<string>("JWT_SECRET_REFRESH");
      const tokenExpiresIn = this.configService.get<string>("JWT_TOKEN_EXPIRES_IN");
      const refreshTokenExpiresIn = this.configService.get<string>("JWT_REFRESH_TOKEN_EXPIRES_IN");

      return {
        accessToken: await this.generateToken(
          payload,
          tokenSecret,
          tokenExpiresIn
        ),
        refreshToken: await this.generateToken(
          payload,
          refreshTokenSecret,
          refreshTokenExpiresIn
        )
      };
    } catch (error) {
      throw new HttpException(
        error?.message ?? "Falha ao efetuar login!",
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  async refresh(refreshToken: string): Promise<any> {
    try {
      if (!refreshToken) {
        throw new UnauthorizedException('Token não encontrado.');
      }

      const tokenSecret = this.configService.get<string>("JWT_SECRET");
      const refreshTokenSecret = this.configService.get<string>("JWT_SECRET_REFRESH");
      const tokenExpiresIn = this.configService.get<string>("JWT_TOKEN_EXPIRES_IN");
      const refreshTokenExpiresIn = this.configService.get<string>("JWT_REFRESH_TOKEN_EXPIRES_IN");

      const oldPayload = await this.verifyJwtToken(refreshToken, refreshTokenSecret);
      const newPayload = {
        sub: oldPayload.sub,
        username: oldPayload.username,
        email: oldPayload.email
      }

      await this.revokeToken(refreshToken, "refresh-token", oldPayload);

      return {
        accessToken: await this.generateToken(
          newPayload,
          tokenSecret,
          tokenExpiresIn
        ),
        refreshToken: await this.generateToken(
          newPayload,
          refreshTokenSecret,
          refreshTokenExpiresIn
        )
      };
    } catch (error) {
      throw new HttpException("Falha ao gerar token!", HttpStatus.BAD_REQUEST);
    }
  }

  async revokeToken(token: string, args: string, user: UserFromToken): Promise<any> {
    try {
      const tokenAlreadyExists = await this.blackListService.exists(token);

      if (tokenAlreadyExists) {
        throw new HttpException("O token informado já está revogado!", HttpStatus.BAD_REQUEST);
      }

      return this.blackListService.create({ token, args, revokedByUserId: user.sub })
    } catch (error) {
      throw new HttpException(error?.message ?? "Falha revogar token!", HttpStatus.BAD_REQUEST);
    }
  }

  async signOut(token: string, user: UserFromToken): Promise<any> {
    const args = "sign-out";
    return await this.revokeToken(token, args, user);
  }

  async updatePassword(data: UpdatePasswordDto, email: string) {
    try {
      const { currentPassword, password } = data;
      const user = await this.usersService.findOneByEmail({ email, active: true});

      if (!user) {
        throw new HttpException("Náo foi possível identificar o usuário.", HttpStatus.BAD_REQUEST);
      }

      const isMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isMatch) {
        throw new HttpException("Dados incompatíveis.", HttpStatus.BAD_REQUEST);
      }

      await this.usersService.updatePassword(email, password);
    } catch (error) {
      throw new HttpException(error.message || "Falha ao atualizar password.", HttpStatus.BAD_REQUEST);
    }
  }

  async sendEmailToRecoveryPassword(email: string) {
    try {
      const user = await this.usersService.findOneByEmail({email, active: true });

      if (!user) {
        throw new HttpException("Usuário não localizado.", HttpStatus.BAD_REQUEST);
      }

      if (!user?.active) {
        throw new HttpException("Não é possível recuperar a senha de usuários inativos.", HttpStatus.BAD_REQUEST);
      }

      const userSender = this.configService.get<string>("MAIL_DEFAULT_SENDER");

      const mailReplacements = {
        user: `${user.name} ${user.lastname.split(" ")[0]}`,
        hashProvisional: generateProvisionalPasswordHash(12),
        recoveryPasswordLink: this.configService.get<string>("MAIL_REDIRECT"),
        companyName: this.configService.get<string>("MAIL_APP_NAME"),
        headerImage: this.configService.get<string>("MAIL_HEADER_IMAGE"),
      };

      const mailProps: SendMailDto = {
        from: `"${mailReplacements.companyName}" <${userSender}>`,
        recipients: user.email,
        subject: "Recuperação de senha",
        text: "/nOlá!/n Siga as orientações abaixo para recuperar sua senha:",
        html: mailReplacements ? templateFormatter(templateRecoveryPassword, mailReplacements) : templateRecoveryPassword
      }

      await this.usersService.generateProvisionalPassword(user.id, mailReplacements.hashProvisional);
      // this.mailerService.sendMail(mailProps);

      this.rabbitmqService.publishMessage({
        routingKey: "email",
        message: mailReplacements
      })
    } catch (error) {
      throw new HttpException(error?.message || "Falha ao solicitar email de recuperação de senha!", HttpStatus.BAD_REQUEST);
    }
  }

  async recoveryPassword(data: RecoveryPasswordDto) {
    try {
      const { email, password, provisionalPassword } = data;

      const provPassword = await this.usersService.findPasswordAndProvisionalPasswordByEmail(email);

      if (!provPassword) {
        throw new Error("Solicite uma nova senha provisória para concluir a recuperação de senha.");
      }

      const isMatch = await bcrypt.compare(
        provisionalPassword,
        provPassword?.provisionalPassword
      );

      if (!isMatch) {
        throw new Error("A senha provisória é incompatível.");
      }

      await this.usersService.updatePassword(provPassword.user.email, password);
      this.usersService.disableProvisionalPasswordByUserId(provPassword.user.id);
    } catch (error) {
      throw new HttpException(error?.message || "Falha ao gerar nova senha!", HttpStatus.BAD_REQUEST);
    }
  }

  private async generateToken(payload: any, secret: string, expiresIn: string) {
    return await this.jwtService.signAsync(payload, {
      secret,
      expiresIn
    })
  }

  private async verifyJwtToken(token: string, secret: string) {
    try {
      return this.jwtService.verify(token, {
        secret,
      });
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Assinatura Inválida');
      }

      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token Expirado');
      }

      throw new UnauthorizedException(error);
    }
  }
}
