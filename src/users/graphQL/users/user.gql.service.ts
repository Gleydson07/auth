import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from "@/database/Prisma/prisma.service";
import { CreateUserDto } from "@/users/dto/create-user.dto";
import { UsersService } from "@/users/users.service";
import { User } from "@/users/entities/user.entity";

export const SALT = 12;

@Injectable()
export class UserGraphqlService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
  ) { }

  async create(data: CreateUserDto) {
    try {
      const userAlreadyExists = await this.userService.findOneByEmail({ email: data.email });

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

  async findAll(name?: string): Promise<User[]> {
    return this.prismaService.user.findMany({
      where: {
        name: {
          contains: name
        }
      },
      select: {
        id: true,
        name: true,
        lastname: true,
        email: true,
        active: true,
        role: true,
        address: true,
        profile: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: "asc"
      }
    });
  }
}
