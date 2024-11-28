import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from "@/database/Prisma/prisma.service";
import { UserFromToken } from "@/auth/dto/token-payload.dto";
import { UsersService } from "@/users/users.service";

@Injectable()
export class AddressesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
  ) {}

  async create(userId: number, user: UserFromToken, createAddress: CreateAddressDto) {
    try {
      await this.userService.checkIsUserAdminOrSameId({
        userId: +userId,
        userIdFromToken: user.sub,
        messageError: "Usuário sem autorização para cadastrar endereço."
      })

      return await this.prismaService.address.create({
        data: {
          userId: +userId,
          neighborhood: createAddress.neighborhood,
          street: createAddress?.street,
          number: createAddress?.number,
          city: createAddress.city,
          country: createAddress.country
        }
      });
    } catch (error) {
      throw new HttpException(error?.message || "Falha ao cadastrar endereço!", HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(userId: number, user: UserFromToken) {
    try {
      await this.userService.checkIsUserAdminOrSameId({
        userId: +userId,
        userIdFromToken: user.sub,
        messageError: "Usuário sem autorização para consultar endereços."
      });

      return await this.prismaService.address.findMany({
        where: {userId},
        include: {
          user: {
            select: {
              id: true,
              name: true,
              lastname: true
            }
          }
        }
      });
    } catch (error) {
      throw new HttpException(error?.message || "Falha ao consultar endereços!", HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(userId: number, addressId: number, user: UserFromToken) {
    try {
      await this.userService.checkIsUserAdminOrSameId({
        userId: +userId,
        userIdFromToken: user.sub,
        messageError: "Usuário sem autorização para consultar endereço."
      });

      return await this.prismaService.address.findUnique({
        where: {
          id: addressId,
          userId
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              lastname: true
            }
          }
        }
      });
    } catch (error) {
      throw new HttpException(error?.message || "Falha ao consultar endereço!", HttpStatus.BAD_REQUEST);
    }
  }

  async update(user: UserFromToken, userId: number, addressId: number, updateAddress: UpdateAddressDto) {
    try {
      await this.userService.checkIsUserAdminOrSameId({
        userId: +userId,
        userIdFromToken: user.sub,
        messageError: "Usuário sem autorização para atualizar endereço."
      });

      const addressFound = await this.prismaService.address.findUnique({
        where: {
          id: addressId,
          userId: userId
        },
      })

      if (!addressFound) {
        throw new Error("Endereço não encontrado.");
      }

      return await this.prismaService.address.update({
        where: {
          id: addressId,
          userId: userId
        },
        data: {
          neighborhood: updateAddress?.neighborhood,
          street: updateAddress?.street,
          number: updateAddress?.number,
          city: updateAddress?.city,
          country: updateAddress?.country
        }
      });
    } catch (error) {
      throw new HttpException(error?.message || "Falha ao atualizar endereço!", HttpStatus.BAD_REQUEST);
    }
  }

  async remove(user: UserFromToken, userId: number, addressId: number) {
    try {
      await this.userService.checkIsUserAdminOrSameId({
        userId: +userId,
        userIdFromToken: user.sub,
        messageError: "Usuário sem autorização para remover endereço."
      });

      const addressFound = await this.prismaService.address.findUnique({
        where: {
          id: addressId,
          userId: userId
        },
      })

      if (!addressFound) {
        throw new Error("Endereço não encontrado.");
      }

      await this.prismaService.address.delete({
        where: {
          id: addressId,
          userId: userId
        }
      });
    } catch (error) {
      throw new HttpException(error?.message || "Falha ao remover endereço!", HttpStatus.BAD_REQUEST);
    }
  }
}
