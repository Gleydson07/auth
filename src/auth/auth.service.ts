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

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private blackListService: BlackListService,
    private mailerService: MailerService,
    private configService: ConfigService
  ) { }

  async signIn({ login, password: pass }: SignInAuthDto): Promise<any> {
    try {
      const user = await this.usersService.findOneByEmail(login);

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
      console.error(error);
      throw new HttpException("Falha ao efetuar login!", HttpStatus.BAD_REQUEST);
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
      return this.blackListService.create({ token, args, revokedByUserId: user.sub })
    } catch (error) {
      throw new HttpException("Falha revogar token!", HttpStatus.BAD_REQUEST);
    }
  }

  async signOut(token: string, args: string, user: UserFromToken): Promise<any> {
    return await this.revokeToken(token, args, user);
  }

  async sendEmailToRecoveryPassword(email: string) {
    try {
      const user = await this.usersService.findOneByEmail(email);

      if (!user || user && !user?.active) {
        throw new Error("Usuário não existe.");
      }

      const userSender = this.configService.get<string>("MAIL_DEFAULT_SENDER");

      const mailReplacements = {
        user: `${user.name} ${user.lastname}`,
        hashProvisional: Math.random().toString(36).substring(0, 6),
        recoveryPasswordLink: this.configService.get<string>("MAIL_REDIRECT"),
        companyName: this.configService.get<string>("MAIL_APP_NAME")
      };

      const mailProps: SendMailDto = {
        from: userSender,
        recipients: user.email,
        subject: "Recuperação de senha",
        text: "Olá!/n Siga as orientações abaixo para recuperar sua senha:",
        html: mailReplacements ? templateFormatter(templateRecoveryPassword, mailReplacements) : templateRecoveryPassword
      }

      await this.usersService.updatePassword(user.id, mailReplacements.hashProvisional);
      await this.mailerService.sendMail(mailProps);
    } catch (error) {
      console.error(error);
      throw new HttpException(error?.message || "Falha ao solicitar email de recuperação de senha!", HttpStatus.BAD_REQUEST);
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

  private async jwtDecode(token: string) {
    return await this.jwtService.decode(token);
  }
}
