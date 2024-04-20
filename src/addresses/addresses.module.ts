import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { UsersService } from "@/users/users.service";
import { BlackListService } from "@/auth/black-list/black-list.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  controllers: [AddressesController],
  providers: [AddressesService, JwtService, BlackListService, UsersService],
})
export class AddressesModule {}
