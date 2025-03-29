import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { SignInAuthDto } from '../dto/sign-in.dto';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '@/app/repositories/user.repository';

@Injectable()
export class SignInUseCase {
  constructor(
    private userRepository: UserRepository,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async execute({ email, password: pass }: SignInAuthDto) {
    try {
      const user = await this.userRepository.findOneByEmail({
        email,
        active: true,
      });

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
        email: user.email,
      };

      const refreshTokenSecret = this.configService.get<string>(
        'JWT_PRIVATE_SECRET_REFRESH',
      );
      const refreshTokenExpiresIn = this.configService.get<string>(
        'JWT_REFRESH_TOKEN_EXPIRES_IN',
      );

      const accessToken = await this.jwtService.signAsync(payload, {
        privateKey: this.configService.get<string>('JWT_PRIVATE_SECRET'),
        expiresIn: this.configService.get<string>('JWT_TOKEN_EXPIRES_IN'),
        algorithm: 'RS256',
      });
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: refreshTokenSecret,
        expiresIn: refreshTokenExpiresIn,
        algorithm: 'HS256',
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new HttpException(
        error?.message ?? 'Falha ao efetuar login!',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
