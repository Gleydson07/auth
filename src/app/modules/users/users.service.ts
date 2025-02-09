import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@/infra/database/Prisma/prisma.service';
import { UserFromToken } from '@/app/modules/auth/dto/token-payload.dto';
import { RoleEnum } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { FindByEmailDto } from './dto/find-by-email-user.dto';
import { generateProvisionalPasswordHash } from '@/utils/functions/generateProvisionalPasswordHash';

export const SALT = 12;

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  async create(data: CreateUserDto) {
    try {
      const userAlreadyExists = await this.findOneByEmail({
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

      const { password, active, ...response } = result;

      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async changeRole(user: UserFromToken, role: RoleEnum, userId: number) {
    try {
      const roleSanitized = role.trim().toUpperCase() as RoleEnum;
      const isValidRole = Object.values(RoleEnum).includes(roleSanitized);
      if (!isValidRole) {
        throw new Error('Role inválida.');
      }

      const userToUpdateRole = await this.findOneById(userId);

      if (!userToUpdateRole) {
        throw new Error('Usuário não encontrado.');
      }

      if (Number(user.sub) === Number(userId)) {
        throw new Error('Você não pode alterar seu nível de acesso.');
      }

      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          role: roleSanitized,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async changeActive(user: UserFromToken, active: boolean, userId: number) {
    try {
      const userToUpdateRole = await this.findOneById(userId);

      if (!userToUpdateRole) {
        throw new Error('Usuário não encontrado.');
      }

      if (Number(user.sub) === Number(userId)) {
        throw new Error('Você não pode alterar seu status.');
      }

      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          active: active,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(active?: boolean) {
    return await this.prismaService.user.findMany({
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
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOneById(id: number, active?: boolean) {
    return await this.prismaService.user.findUnique({
      where: { id: id, active: active },
      select: {
        id: true,
        name: true,
        lastname: true,
        email: true,
        active: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findOneByEmail({ email, active }: FindByEmailDto) {
    const data = await this.prismaService.user.findUnique({
      where: {
        email: email.trim().toLowerCase(),
        active: active,
      },
    });

    if (!data?.id) return null;

    return data;
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

  async update(user: UserFromToken, id: number, updateUserDto: UpdateUserDto) {
    try {
      await this.checkIsUserAdminOrSameId({
        userId: id,
        userIdFromToken: user.sub,
        messageError: 'Não é permitido alterar o cadastro de terceiros.',
      });

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
    } catch (error) {
      throw new HttpException(
        error.message || 'Falha ao atualizar dados do usuário.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
    try {
      const userToUpdateRole = await this.findOneById(+id);

      if (!userToUpdateRole) {
        throw new Error('Usuário não encontrado.');
      }

      return this.prismaService.user.update({
        where: {
          id: +id,
        },
        data: {
          active: false,
          password: generateProvisionalPasswordHash(12),
        },
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Falha ao remover usuário.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateUserAdmin(active: boolean) {
    return await this.prismaService.user.update({
      where: {
        email: 'admin@admin.com',
      },
      data: {
        active,
      },
    });
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
