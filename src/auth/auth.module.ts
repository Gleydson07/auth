import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UsersModule } from "@/users/users.module";
import { BlackListService } from "@/auth/black-list/black-list.service";
import { MailerService } from "@/mailer/mailer.service";
import { RabbitmqModule } from "@/rabbitmq/rabbitmq.module";

@Module({
  imports: [UsersModule, ConfigModule, RabbitmqModule],
  providers: [AuthService, JwtService, BlackListService, MailerService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }
