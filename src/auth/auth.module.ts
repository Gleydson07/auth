import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UsersModule } from "@/users/users.module";
import { BlackListService } from "@/black-list/black-list.service";

@Module({
  imports: [UsersModule, ConfigModule],
  providers: [AuthService, JwtService, BlackListService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }
