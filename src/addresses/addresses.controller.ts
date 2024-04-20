import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, HttpCode } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { User } from "@/utils/decorators/user-extract-auth.decorator";
import { UserFromToken } from "@/auth/dto/token-payload.dto";
import { AuthGuard } from "@/auth/guards/auth.guard";

@UseGuards(AuthGuard)
@Controller()
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  create(
    @Param('id') userId: number,
    @Body() createAddress: CreateAddressDto,
    @User() user: UserFromToken
  ) {
    return this.addressesService.create(+userId, user, createAddress);
  }

  @Get()
  findAll(
    @Param('id') userId: number,
    @User() user: UserFromToken
  ) {
    return this.addressesService.findAll(+userId, user);
  }

  @Get(":addressId")
  findOne(
    @Param('id') userId: string,
    @Param('addressId') addressId: string,
    @User() user: UserFromToken
  ) {
    return this.addressesService.findOne(+userId, +addressId, user);
  }

  @Put(":addressId")
  update(
    @Param('id') userId: number,
    @Param('addressId') addressId: number,
    @Body() updateAddressDto: UpdateAddressDto,
    @User() user: UserFromToken
  ) {
    return this.addressesService.update(user, +userId, +addressId, updateAddressDto);
  }

  @HttpCode(204)
  @Delete(":addressId")
  remove(
    @Param('id') userId: string,
    @Param('addressId') addressId: number,
    @User() user: UserFromToken
  ) {
    return this.addressesService.remove(user, +userId, +addressId);
  }
}
