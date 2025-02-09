import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { MailerService } from '@/infra/services/mailer/mailer.service';
import { RabbitmqModule } from '@/infra/services/rabbitmq/rabbitmq.module';
import { BlackListModule } from './black-list/black-list.module';

@Module({
  imports: [BlackListModule, UsersModule, ConfigModule, RabbitmqModule],
  providers: [AuthService, JwtService, MailerService],
  controllers: [AuthController],
  exports: [JwtService, AuthService],
})
export class AuthModule {}
