import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { JwtService } from "@nestjs/jwt";
import { BlackListService } from "@/auth/black-list/black-list.service";

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService, JwtService, BlackListService],
})
export class ProfilesModule { }
