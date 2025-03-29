import { BlackListRepository } from '@/app/repositories/black-list.repository';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RevokeTokenUseCase } from './revoke-token.usecase';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly revokeTokenUseCase: RevokeTokenUseCase,
  ) {}

  async execute(refreshToken: string) {
    try {
      if (!refreshToken) {
        throw new UnauthorizedException('Token não encontrado.');
      }

      const tokenSecret = this.configService.get<string>('JWT_PRIVATE_SECRET');
      const refreshTokenSecret = this.configService.get<string>(
        'JWT_PRIVATE_SECRET_REFRESH',
      );
      const tokenExpiresIn = this.configService.get<string>(
        'JWT_TOKEN_EXPIRES_IN',
      );
      const refreshTokenExpiresIn = this.configService.get<string>(
        'JWT_REFRESH_TOKEN_EXPIRES_IN',
      );

      const oldPayload = await this.verifyJwtToken(
        refreshToken,
        refreshTokenSecret,
      );
      const newPayload = {
        sub: oldPayload.sub,
        username: oldPayload.username,
        email: oldPayload.email,
      };

      await this.revokeTokenUseCase.execute(
        refreshToken,
        'refresh-token',
        oldPayload,
      );

      return {
        accessToken: await this.jwtService.signAsync(newPayload, {
          secret: tokenSecret,
          expiresIn: tokenExpiresIn,
        }),
        refreshToken: await this.jwtService.signAsync(newPayload, {
          secret: refreshTokenSecret,
          expiresIn: refreshTokenExpiresIn,
        }),
      };
    } catch (error) {
      throw new HttpException('Falha ao gerar token!', HttpStatus.BAD_REQUEST);
    }
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
