import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/Prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserEntity } from './user.entity';
import { UserRepository } from '@/app/repositories/user.repository';

export const SALT = 12;

@Injectable()
export class UserGraphqlService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userRepository: UserRepository,
  ) {}

  async create(data: CreateUserDto) {
    try {
      const userAlreadyExists = await this.userRepository.findOneByEmail({
        email: data.email,
      });

      if (userAlreadyExists) {
        throw new Error('Usuário já existe.');
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

      const { password, ...response } = result;

      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(name?: string): Promise<UserEntity[]> {
    return this.prismaService.user.findMany({
      where: {
        name: {
          contains: name,
        },
        active: true,
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
        name: 'asc',
      },
    });
  }
}
