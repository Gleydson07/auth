import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { MailerService } from '@/infra/services/mailer/mailer.service';
import { RabbitmqModule } from '@/infra/services/rabbitmq/rabbitmq.module';
import { BlackListModule } from './black-list/black-list.module';
import { RecoveryPasswordUseCase } from './usecases/recovery-password.usecase';
import { RefreshTokenUseCase } from './usecases/refresh-token.usecase';
import { RevokeTokenUseCase } from './usecases/revoke-token.usecase';
import { SendMailToRecoveryPasswordUseCase } from './usecases/send-mail-to-recovery-password.usecase';
import { SignInUseCase } from './usecases/sign-in.usecase';
import { UpdatePasswordUseCase } from './usecases/update-password.usecase';

@Module({
  imports: [BlackListModule, UsersModule, ConfigModule, RabbitmqModule],
  providers: [
    RecoveryPasswordUseCase,
    RefreshTokenUseCase,
    RevokeTokenUseCase,
    SendMailToRecoveryPasswordUseCase,
    SignInUseCase,
    UpdatePasswordUseCase,
    JwtService,
    MailerService,
  ],
  controllers: [AuthController],
  exports: [JwtService],
})
export class AuthModule {}
