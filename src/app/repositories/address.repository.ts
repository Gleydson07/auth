import { Injectable } from '@nestjs/common';
import { ResponseAddressDto } from '../modules/addresses/dto/response-address.dto';
import { CreateAddressDto } from '../modules/addresses/dto/create-address.dto';
import { UpdateAddressDto } from '../modules/addresses/dto/update-address.dto';

@Injectable()
export abstract class AddressRepository {
  abstract create(
    userId: number,
    createAddress: CreateAddressDto,
  ): Promise<ResponseAddressDto>;

  abstract findAll(userId: number): Promise<ResponseAddressDto[]>;

  abstract findOne(
    userId: number,
    addressId: number,
  ): Promise<ResponseAddressDto>;

  abstract update(
    userId: number,
    addressId: number,
    updateAddress: UpdateAddressDto,
  ): Promise<ResponseAddressDto>;

  abstract remove(userId: number, addressId: number): Promise<void>;
}
