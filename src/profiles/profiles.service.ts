import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from "@/database/Prisma/prisma.service";
import { UsersService } from "@/users/users.service";
import { RoleEnum } from "@prisma/client";

@Injectable()
export class ProfilesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
  ) { }

  async create(userId: number, createProfile: CreateProfileDto) {
    try {
      return await this.prismaService.profile.create({
        data: {
          userId: userId,
          birthDay: new Date(createProfile.birthDay),
          gender: createProfile.gender,
          mainRegistration: createProfile.mainRegistration,
        }
      });
    } catch (error) {
      console.error(error.message);
      throw new HttpException("Falha ao cadastrar perfil!", HttpStatus.BAD_REQUEST);
    }
  }

  findOne(userId: number, userIdFromToken: number) {
    try {
      if (Number(userId) !== Number(userIdFromToken)) {
        throw new Error("Falha ao consultar usuário.");
      }

      return this.prismaService.profile.findUnique({
        where: { userId: userIdFromToken }
      });
    } catch (error) {
      throw new HttpException(error.message || "Falha ao consultar perfil!", HttpStatus.BAD_REQUEST);
    }
  }

  async update(userId: number, userIdFromToken: number, updateProfile: UpdateProfileDto) {
    try {
      const userFound = await this.userService.findOneById(userIdFromToken);

      if (Number(userIdFromToken) !== Number(userId) && userFound.role !== RoleEnum.ADMIN) {
        throw new Error("Não é permitido alterar o cadastro de terceiros.");
      }

      const birthDay = updateProfile?.birthDay ? new Date(updateProfile?.birthDay) : undefined;

      return this.prismaService.profile.update({
        where: {
          userId: userId
        },
        data: {
          birthDay,
          gender: updateProfile?.gender,
          mainRegistration: updateProfile?.mainRegistration,
        }
      });
    } catch (error) {
      throw new HttpException("Falha ao alterar perfil!", HttpStatus.BAD_REQUEST);
    }
  }
}
