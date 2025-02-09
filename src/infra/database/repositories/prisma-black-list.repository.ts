import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/Prisma/prisma.service';
import { CreateBlackListDto } from '@/app/modules/auth/black-list/dto/create-black-list.dto';
import { BlackListRepository } from '@/app/repositories/black-list.repository';

@Injectable()
export class PrismaBlackListRepository implements BlackListRepository {
  constructor(private readonly prismaService: PrismaService) {}
  create(createBlackList: CreateBlackListDto) {
    return this.prismaService.blackListTokens.create({
      data: {
        token: createBlackList.token,
        args: createBlackList.args,
        revokedByUserId: createBlackList.revokedByUserId,
      },
    });
  }

  exists(token: string) {
    return this.prismaService.blackListTokens.count({
      where: {
        token: token,
      },
    });
  }

  async remove(token: string) {
    await this.prismaService.blackListTokens.deleteMany({
      where: {
        token: token,
      },
    });
  }
}
