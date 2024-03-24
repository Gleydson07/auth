import * as bcrypt from "bcrypt";
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInAuthDto } from "./dto/sign-in.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "@/users/users.service";
import { UserFromToken } from "./dto/token-payload.dto";
import { BlackListService } from "@/auth/black-list/black-list.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private blackListService: BlackListService,
    private configService: ConfigService
  ) { }

  async signIn({ login, password: pass }: SignInAuthDto): Promise<any> {
    const user = await this.usersService.findOneByEmailOrNickname(login);

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

      this.revokeToken(refreshToken, oldPayload);

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
      throw error;
    }
  }

  async revokeToken(token: string, user: UserFromToken): Promise<any> {
    return this.blackListService.create({ token, revokedByUserId: user.sub })
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
