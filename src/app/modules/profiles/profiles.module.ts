import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService, JwtService, UsersService],
})
export class ProfilesModule {}
