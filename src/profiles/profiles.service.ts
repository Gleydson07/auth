import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from "@/database/Prisma/prisma.service";
import { UsersService } from "@/users/users.service";

@Injectable()
export class ProfilesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
  ) { }

  async create(userId: number, userIdFromToken: number, createProfile: CreateProfileDto) {
    try {
      await this.userService.checkIsUserAdminOrSameId({
        userId: userId,
        userIdFromToken: userIdFromToken,
        messageError: "Usuário sem autorização para cadastrar perfil."
      });

      const profileFound = await this.findOne(userId);

      if (profileFound) {
        throw new Error("Usuário já possui um perfil vinculado.");
      }

      return await this.prismaService.profile.create({
        data: {
          userId: userId,
          birthDay: createProfile.birthDay ? new Date(createProfile?.birthDay) : undefined,
          gender: createProfile?.gender,
          phone: createProfile?.phone,
          document: createProfile.document,
          documentType: createProfile.documentType,
        }
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(error?.message || "Falha ao cadastrar perfil!", HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(userId: number) {
    return await this.prismaService.profile.findUnique({
      where: { userId }
    });
  }

  async update(userId: number, userIdFromToken: number, updateProfile: UpdateProfileDto) {
    try {
      await this.userService.checkIsUserAdminOrSameId({
        userId: userId,
        userIdFromToken: userIdFromToken,
        messageError: "Não é permitido alterar o perfil de terceiros."
      })

      const profileFound = await this.findOne(userId);

      if (!profileFound) {
        throw new Error("Perfil não encontrado.");
      }

      const birthDay = updateProfile?.birthDay ? new Date(updateProfile?.birthDay) : undefined;

      return this.prismaService.profile.update({
        where: {
          userId: userId
        },
        data: {
          birthDay,
          gender: updateProfile?.gender,
          phone: updateProfile?.phone,
          document: updateProfile?.document,
          documentType: updateProfile?.documentType,
        }
      });
    } catch (error) {
      throw new HttpException("Falha ao alterar perfil!", HttpStatus.BAD_REQUEST);
    }
  }

  async remove(userId: number, userIdFromToken: number) {
    try {
      await this.userService.checkIsUserAdminOrSameId({
        userId: userId,
        userIdFromToken: userIdFromToken,
        messageError: "Não é permitido remover o perfil de terceiros."
      })

      const profileFound = await this.findOne(userId);

      if (!profileFound) {
        throw new Error("Perfil não encontrado.");
      }

      await this.prismaService.profile.delete({
        where: {
          userId: userId
        },
      });
    } catch (error) {
      throw new HttpException(error.message || "Falha ao remover perfil!", HttpStatus.BAD_REQUEST);
    }
  }
}
