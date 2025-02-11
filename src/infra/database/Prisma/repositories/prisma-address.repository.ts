import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/Prisma/prisma.service';
import { CreateAddressDto } from '@/app/modules/addresses/dto/create-address.dto';
import { UpdateAddressDto } from '@/app/modules/addresses/dto/update-address.dto';
import { AddressRepository } from '@/app/repositories/address.repository';

@Injectable()
export class PrismaAddressRepository implements AddressRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: number, createAddress: CreateAddressDto) {
    return await this.prismaService.address.create({
      data: {
        userId: +userId,
        neighborhood: createAddress.neighborhood,
        street: createAddress?.street,
        number: createAddress?.number,
        city: createAddress.city,
        country: createAddress.country,
        zipCode: createAddress.zipCode,
      },
    });
  }

  async findAll(userId: number) {
    return await this.prismaService.address.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            lastname: true,
          },
        },
      },
    });
  }

  async findOne(userId: number, addressId: number) {
    return await this.prismaService.address.findUnique({
      where: {
        id: addressId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            lastname: true,
          },
        },
      },
    });
  }

  async update(
    userId: number,
    addressId: number,
    updateAddress: UpdateAddressDto,
  ) {
    return await this.prismaService.address.update({
      where: {
        id: addressId,
        userId: userId,
      },
      data: {
        neighborhood: updateAddress?.neighborhood,
        street: updateAddress?.street,
        number: updateAddress?.number,
        city: updateAddress?.city,
        country: updateAddress?.country,
        zipCode: updateAddress?.zipCode,
      },
    });
  }

  async remove(userId: number, addressId: number) {
    await this.prismaService.address.delete({
      where: {
        id: addressId,
        userId: userId,
      },
    });
  }
}
