import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [AddressesController],
  providers: [AddressesService, JwtService, UsersService],
})
export class AddressesModule {}
