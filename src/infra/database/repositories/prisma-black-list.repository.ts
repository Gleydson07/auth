import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/Prisma/prisma.service';
import { CreateBlackListDto } from '@/app/modules/auth/black-list/dto/create-black-list.dto';

@Injectable()
export class PrismaBlackListService {
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

  remove(token: string) {
    return this.prismaService.blackListTokens.deleteMany({
      where: {
        token: token,
      },
    });
  }
}
