import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { BlackListService } from '@/app/modules/auth/black-list/black-list.service';
import { MailerService } from '@/infra/services/mailer/mailer.service';
import { RabbitmqModule } from '@/infra/services/rabbitmq/rabbitmq.module';

@Module({
  imports: [UsersModule, ConfigModule, RabbitmqModule],
  providers: [AuthService, JwtService, BlackListService, MailerService],
  controllers: [AuthController],
  exports: [JwtService, BlackListService, AuthService],
})
export class AuthModule {}
