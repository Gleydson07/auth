import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { UsersService } from "@/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { BlackListService } from "@/auth/black-list/black-list.service";
import { ConfigService } from "@nestjs/config";

@Module({
  controllers: [],
  providers: [MailerService, UsersService, JwtService, BlackListService, ConfigService],
})
export class MailerModule {}
