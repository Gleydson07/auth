import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from "@/database/Prisma/prisma.service";
import { UserFromToken } from "@/auth/dto/token-payload.dto";

@Injectable()
export class AddressesService {
  constructor( private readonly prismaService: PrismaService) {}

  create(user: UserFromToken, createAddress: CreateAddressDto) {
    return this.prismaService.address.create({
      data: {
        userId: user.sub,
        neighborhood: createAddress.neighborhood,
        street: createAddress.street,
        number: createAddress.number,
        city: createAddress.city,
        country: createAddress.country
      }
    });
  }

  findAll() {
    return this.prismaService.address.findMany();
  }

  findOne(id: number) {
    return this.prismaService.address.findUnique({
      where: {
        id
      }
    });
  }

  update(user: UserFromToken, id: number, updateAddress: UpdateAddressDto) {
    return this.prismaService.address.update({
      where: {
        id,
        userId: user.sub
      },
      data: {
        neighborhood: updateAddress.neighborhood,
        street: updateAddress.street,
        number: updateAddress.number,
        city: updateAddress.city,
        country: updateAddress.country
      }
    });
  }

  remove(user: UserFromToken, id: number) {
    return this.prismaService.address.delete({
      where: {
        id,
        userId: user.sub
      }
    });
  }
}
