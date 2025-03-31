import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '@/infra/database/Prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { SALT } from '@/app/repositories/user.repository';
import { ProvisionalPasswordRepository } from '@/app/repositories/provisional-password.repository';
import { EventBusService } from '@/infra/events/event-bus.service';

@Injectable()
export class PrismaProvisionalPasswordRepository
  implements ProvisionalPasswordRepository, OnModuleInit
{
  constructor(
    private readonly prismaService: PrismaService,
    private configService: ConfigService,
    private readonly eventBus: EventBusService,
  ) {}

  onModuleInit() {
    this.eventBus.subscribe(
      'provisionalPassword.generate',
      this.handleGenerateProvesionalPassword.bind(this),
    );
  }

  private async handleGenerateProvesionalPassword(data: {
    userId: number;
    hash: string;
  }) {
    await this.generateProvisionalPassword(data.userId, data.hash);
  }

  async findPasswordAndProvisionalPasswordByEmail(email: string) {
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
  }

  async updateManyProvisionalPasswordByUserId(userId: number) {
    await this.prismaService.provisionalPassword.updateMany({
      where: {
        userId: userId,
      },
      data: {
        active: false,
      },
    });
  }

  async generateProvisionalPassword(userId: number, password: string) {
    try {
      const hash = await bcrypt.hash(password, SALT);
      const currentDate = new Date();

      await this.updateManyProvisionalPasswordByUserId(userId);
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
}
