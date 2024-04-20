import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { JwtService } from "@nestjs/jwt";
import { BlackListService } from "@/auth/black-list/black-list.service";
import { UsersService } from "@/users/users.service";

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService, JwtService, BlackListService, UsersService],
})
export class ProfilesModule { }
