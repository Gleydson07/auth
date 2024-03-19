import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConfigModule } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { BlackListService } from "@/black-list/black-list.service";

@Module({
  imports: [ConfigModule],
  controllers: [UsersController],
  providers: [UsersService, JwtService, BlackListService],
  exports: [UsersService]
})
export class UsersModule { }
