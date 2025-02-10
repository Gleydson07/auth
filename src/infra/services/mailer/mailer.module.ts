import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [],
  providers: [MailerService, JwtService, ConfigService],
})
export class MailerModule {}
