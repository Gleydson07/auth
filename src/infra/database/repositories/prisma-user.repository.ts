import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '@/infra/database/Prisma/prisma.service';
import { UserFromToken } from '@/app/modules/auth/dto/token-payload.dto';
import { RoleEnum } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { generateProvisionalPasswordHash } from '@/utils/functions/generateProvisionalPasswordHash';
import { CreateUserDto } from '@/app/modules/users/dto/create-user.dto';
import { FindByEmailDto } from '@/app/modules/users/dto/find-by-email-user.dto';
import { UpdateUserDto } from '@/app/modules/users/dto/update-user.dto';
import { SALT, UserRepository } from '@/app/repositories/user.repository';
import { UserRole } from '@/app/modules/users/dto/create-role.dto';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  async create(data: CreateUserDto) {
    const user = await this.prismaService.user.create({
      data: data,
    });

    return {
      ...user,
      role: user.role as UserRole,
    };
  }

  async findAll(active?: boolean) {
    const users = await this.prismaService.user.findMany({
      where: {
        active: active,
      },
      select: {
        id: true,
        name: true,
        lastname: true,
        email: true,
        active: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return users.map((user) => ({
      ...user,
      role: user.role as UserRole,
    }));
  }

  async findOneById(id: number, active?: boolean) {
    const user = await this.prismaService.user.findUnique({
      where: { id: id, active: active },
      select: {
        id: true,
        name: true,
        lastname: true,
        email: true,
        active: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ...user,
      role: user.role as UserRole,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.prismaService.user.update({
      where: {
        id: id,
        active: true,
      },
      data: {
        name: updateUserDto?.name,
        lastname: updateUserDto?.lastname,
      },
    });
  }

  async remove(id: number) {
    await this.prismaService.user.update({
      where: {
        id: +id,
      },
      data: {
        active: false,
        password: generateProvisionalPasswordHash(12),
      },
    });
  }

  async findOneByEmail({ email, active }: FindByEmailDto) {
    const data = await this.prismaService.user.findUnique({
      where: {
        email: email.trim().toLowerCase(),
        active: active,
      },
      select: {
        id: true,
        name: true,
        lastname: true,
        email: true,
        active: true,
        role: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!data?.id) return null;

    return {
      ...data,
      role: data.role as UserRole,
    };
  }

  async generateProvisionalPassword(userId: number, password: string) {
    try {
      const hash = await bcrypt.hash(password, SALT);
      const currentDate = new Date();

      await this.disableProvisionalPasswordByUserId(userId);
      await this.prismaService.provisionalPassword.create({
        data: {
          active: true,
          provisionalPassword: hash,
          userId: userId,
          expiresIn: new Date(
            currentDate.setMinutes(
              currentDate.getMinutes() +
                Number(
                  this.configService.get<string>(
                    'USER_EXPIRES_PROVISIONAL_PASSWORD_IN_MINUTES',
                  ) ?? 5,
                ),
            ),
          ),
        },
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Falha ao gerar senha provisória.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findExpiredProvisionalPassword(isActive?: boolean) {
    try {
      return await this.prismaService.provisionalPassword.findMany({
        where: {
          active: isActive,
          expiresIn: {
            lte: new Date(),
          },
        },
        select: {
          id: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        'Falha ao localizar usuários com senhas provisórias.',
      );
    }
  }

  async disableProvisionalPasswordByUserId(userId: number) {
    try {
      await this.prismaService.provisionalPassword.updateMany({
        where: {
          userId: userId,
        },
        data: {
          active: false,
        },
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Falha ao desabilitar senha provisória.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findPasswordAndProvisionalPasswordByEmail(email: string) {
    try {
      return await this.prismaService.provisionalPassword.findFirst({
        where: {
          user: {
            email: email,
          },
          active: true,
        },
        select: {
          provisionalPassword: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
            },
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(
        'Falha ao validar acesso provisório do usuário.',
      );
    }
  }

  async disableProvisionalPasswordByIds(ids: number[]) {
    try {
      await this.prismaService.provisionalPassword.updateMany({
        where: {
          id: { in: ids },
        },
        data: {
          active: false,
        },
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Falha ao desabilitar senha provisória.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteProvisionalPasswordByIds(ids: number[]) {
    try {
      await this.prismaService.provisionalPassword.deleteMany({
        where: {
          id: { in: ids },
        },
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Falha ao remover senhas provisórias.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updatePassword(email: string, password: string) {
    try {
      const hash = await bcrypt.hash(password, SALT);
      await this.prismaService.user.update({
        where: {
          email,
          active: true,
        },
        data: {
          password: hash,
        },
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Falha ao atualizar password.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async checkIsUserAdminOrSameId(props: {
    userId: number;
    userIdFromToken: number;
    messageError: string;
  }) {
    const userFound = await this.findOneById(+props.userIdFromToken);

    if (!userFound?.id) {
      throw new HttpException('Usuário inválido.', HttpStatus.BAD_REQUEST);
    }

    if (!userFound?.active) {
      throw new HttpException(
        'O usuário deve estar ativo.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      Number(props.userIdFromToken) !== Number(props.userId) &&
      userFound?.role !== RoleEnum.ADMIN
    ) {
      throw new HttpException(props.messageError, HttpStatus.BAD_REQUEST);
    }
  }
}
