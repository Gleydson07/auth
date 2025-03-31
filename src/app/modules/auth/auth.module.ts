import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { BlackListModule } from '../black-list/black-list.module';
import { RecoveryPasswordUseCase } from './usecases/recovery-password.usecase';
import { RefreshTokenUseCase } from './usecases/refresh-token.usecase';
import { RevokeTokenUseCase } from './usecases/revoke-token.usecase';
import { SendMailToRecoveryPasswordUseCase } from './usecases/send-mail-to-recovery-password.usecase';
import { SignInUseCase } from './usecases/sign-in.usecase';
import { UpdatePasswordUseCase } from './usecases/update-password.usecase';
import { RabbitmqModule } from '@/infra/services/rabbitmq/rabbitmq.module';
import { ProvisionalPasswordModule } from '../provisional-password/provisional-password.module';

@Module({
  imports: [
    BlackListModule,
    UsersModule,
    RabbitmqModule,
    ProvisionalPasswordModule,
  ],
  providers: [
    RecoveryPasswordUseCase,
    RefreshTokenUseCase,
    RevokeTokenUseCase,
    SendMailToRecoveryPasswordUseCase,
    SignInUseCase,
    UpdatePasswordUseCase,
  ],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
