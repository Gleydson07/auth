import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { BlackListService } from '@/app/modules/auth/black-list/black-list.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [AddressesController],
  providers: [AddressesService, JwtService, BlackListService, UsersService],
})
export class AddressesModule {}
