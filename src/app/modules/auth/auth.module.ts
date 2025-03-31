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
import { ProvisionalPasswordModule } from '../provisional-password/provisional-password.module';
import { AuthGuard } from './guards/auth.guard';
import { GraphQLThrottlerGuard } from './guards/graphql-throttler.guard';
import { OnlyAdminGuard } from './guards/only-admin.guard';

@Module({
  imports: [
    BlackListModule,
    UsersModule,
    ProvisionalPasswordModule,
    // RabbitmqModule,
  ],
  providers: [
    RecoveryPasswordUseCase,
    RefreshTokenUseCase,
    RevokeTokenUseCase,
    SendMailToRecoveryPasswordUseCase,
    SignInUseCase,
    UpdatePasswordUseCase,
    AuthGuard,
    GraphQLThrottlerGuard,
    OnlyAdminGuard,
  ],
  controllers: [AuthController],
  exports: [AuthGuard, GraphQLThrottlerGuard, OnlyAdminGuard],
})
export class AuthModule {}
