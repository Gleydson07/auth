import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/app/modules/users/users.service';

@Module({
  controllers: [],
  providers: [MailerService, UsersService, JwtService, ConfigService],
})
export class MailerModule {}
