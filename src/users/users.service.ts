import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from "@/database/Prisma/prisma.service";

const SALT = 12;

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(data: CreateUserDto) {
    try {
      const userAlreadyExists = await this.findOneByEmailOrNickname(data.email, data?.nickname);

      if (userAlreadyExists) {
        throw new Error("Usuário já existe.");
      }

      const hash = await bcrypt.hash(data.password, SALT);

      const result = await this.prismaService.user.create({
        data: {
          name: data.name,
          lastname: data.lastname,
          nickname: data?.nickname,
          email: data.email,
          password: hash,
        },
      });

      const { password, active, nickname, ...response } = result;

      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  findOneById(id: number) {
    return this.prismaService.user.findUnique({
      where: { id: id }
    });
  }

  findOneByEmailOrNickname(emailOrNickname: string, nickname?: string) {
    try {
      return this.prismaService.user.findFirst({
        where: {
          OR: [
            { email: { equals: emailOrNickname } },
            { nickname: { equals: nickname ?? emailOrNickname } }
          ],
          AND: {
            active: true
          }
        }
      });
    } catch (error) {
      throw new Error('Falha ao buscar usuário.')
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prismaService.user.update({
      where: {
        id
      },
      data: {
        name: updateUserDto.name,
        lastname: updateUserDto.lastname
      }
    });
  }

  remove(id: number) {
    return this.prismaService.user.update({
      where: {
        id
      },
      data: {
        active: false
      }
    });
  }
}
