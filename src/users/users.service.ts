import * as bcrypt from 'bcrypt';
import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from "@/database/Prisma/prisma.service";
import { UserFromToken } from "@/auth/dto/token-payload.dto";
import { RoleEnum } from "@prisma/client";
import { BlackListService } from "@/auth/black-list/black-list.service";

const SALT = 12;

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly blackListService: BlackListService,
  ) { }

  async create(data: CreateUserDto) {
    try {
      const userAlreadyExists = await this.findOneByEmail(data.email);

      if (userAlreadyExists) {
        throw new Error("Usuário já existe.");
      }

      const hash = await bcrypt.hash(data.password, SALT);

      const result = await this.prismaService.user.create({
        data: {
          name: data.name,
          lastname: data.lastname,
          email: data.email,
          password: hash,
        },
      });

      const { password, active, ...response } = result;

      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async changeRole(user: UserFromToken, role: RoleEnum, userId: number) {
    try {
      const operator = await this.findOneById(user.sub);

      if (!operator || operator && operator.role !== RoleEnum.ADMIN) {
        throw new Error("Você não tem permissão de administrador.");
      }

      const userToUpdateRole = await this.findOneById(userId);

      if (!userToUpdateRole) {
        throw new Error("Usuário não encontrado.");
      }

      if (Number(user.sub) === Number(userId)) {
        throw new Error("Você não pode alterar seu nível de acesso.");
      }

      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          role: role
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async changeActive(user: UserFromToken, userId: number) {
    try {
      const userToUpdateRole = await this.findOneById(userId);

      if (!userToUpdateRole) {
        throw new Error("Usuário não encontrado.");
      }

      if (Number(user.sub) === Number(userId)) {
        throw new Error("Você não pode alterar seu status.");
      }

      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          active: true
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    return await this.prismaService.user.findMany({
      where: {
        active: true
      },
      select: {
        id: true,
        name: true,
        lastname: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });
  }

  async findOneById(id: number) {
    return await this.prismaService.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        lastname: true,
        email: true,
        active: true,
        role: true,
        createdAt: true,
      }
    });
  }

  async findOneByEmail(email: string) {
    try {
      const data = await this.prismaService.user.findFirst({
        where: {
          AND: {
            email: { equals: email },
            active: true
          }
        }
      });
      return data;
    } catch (error) {
      throw new Error('Falha ao buscar usuário.')
    }
  }

  async update(user: UserFromToken, id: number, updateUserDto: UpdateUserDto) {
    try {
      const userFound = await this.findOneById(user.sub);

      if (Number(user.sub) !== Number(id) && userFound.role !== RoleEnum.ADMIN) {
        throw new Error("Não é permitido alterar o cadastro de terceiros.")
      }

      await this.prismaService.user.update({
        where: {
          id
        },
        data: {
          name: updateUserDto.name,
          lastname: updateUserDto.lastname
        },
      });
    } catch (error) {
      throw new HttpException(error.message || "Falha ao atualizar dados do usuário.", HttpStatus.BAD_REQUEST);
    }
  }

  async remove(user: UserFromToken, token: string, id: number) {
    try {
      await this.prismaService.user.update({
        where: {
          id
        },
        data: {
          active: false
        }
      });

      return this.blackListService.create({token, args: "delete-account", revokedByUserId: user.sub})
    } catch (error) {
      throw new HttpException(error.message || "Falha ao remover usuário.", HttpStatus.BAD_REQUEST);
    }
  }

  async updateUserAdmin({ active, role }: {active: boolean, role: RoleEnum}) {
    return await this.prismaService.user.update({
      where: {
        email: "admin@admin.com"
      },
      data: {
        active,
        role
      }
    });
  }
}
