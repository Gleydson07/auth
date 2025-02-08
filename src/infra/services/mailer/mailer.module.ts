import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { JwtService } from '@nestjs/jwt';
import { BlackListService } from '@/app/modules/auth/black-list/black-list.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/app/modules/users/users.service';

@Module({
  controllers: [],
  providers: [
    MailerService,
    UsersService,
    JwtService,
    BlackListService,
    ConfigService,
  ],
})
export class MailerModule {}
