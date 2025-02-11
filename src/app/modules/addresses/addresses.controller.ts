import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { User } from '@/utils/decorators/user-extract-auth.decorator';
import { UserFromToken } from '@/app/modules/auth/dto/token-payload.dto';
import { CreateAddressUseCase } from './usecases/create-address.usecase';
import { FindAllAddressesUseCase } from './usecases/find-all-address.usecase';
import { FindByIdAddressUseCase } from './usecases/find-by-id-address.usecase';
import { RemoveAddressUseCase } from './usecases/remove-address.usecase';
import { UpdateAddressUseCase } from './usecases/update-address.usecase';

@Controller()
export class AddressesController {
  constructor(
    private readonly createAddressUseCase: CreateAddressUseCase,
    private readonly findAllAddressesUseCase: FindAllAddressesUseCase,
    private readonly findByIdAddressUseCase: FindByIdAddressUseCase,
    private readonly updateAddressUseCase: UpdateAddressUseCase,
    private readonly removeAddressUseCase: RemoveAddressUseCase,
  ) {}

  @Post()
  create(
    @Param('id') userId: number,
    @Body() createAddress: CreateAddressDto,
    @User() user: UserFromToken,
  ) {
    return this.createAddressUseCase.execute(+userId, user, createAddress);
  }

  @Get()
  findAll(@Param('id') userId: number, @User() user: UserFromToken) {
    return this.findAllAddressesUseCase.execute(+userId, user);
  }

  @Get(':addressId')
  findOne(
    @Param('id') userId: string,
    @Param('addressId') addressId: string,
    @User() user: UserFromToken,
  ) {
    return this.findByIdAddressUseCase.execute(+userId, +addressId, user);
  }

  @Put(':addressId')
  update(
    @Param('id') userId: number,
    @Param('addressId') addressId: number,
    @Body() updateAddressDto: UpdateAddressDto,
    @User() user: UserFromToken,
  ) {
    return this.updateAddressUseCase.execute(
      user,
      +userId,
      +addressId,
      updateAddressDto,
    );
  }

  @HttpCode(204)
  @Delete(':addressId')
  remove(
    @Param('id') userId: string,
    @Param('addressId') addressId: number,
    @User() user: UserFromToken,
  ) {
    return this.removeAddressUseCase.execute(user, +userId, +addressId);
  }
}
