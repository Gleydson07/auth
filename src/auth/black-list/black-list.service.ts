import { Injectable } from '@nestjs/common';
import { CreateBlackListDto } from './dto/create-black-list.dto';
import { PrismaService } from "@/database/Prisma/prisma.service";

@Injectable()
export class BlackListService {
  constructor(private readonly prismaService: PrismaService) { }
  create(createBlackList: CreateBlackListDto) {
    return this.prismaService.blackListTokens.create({
      data: {
        token: createBlackList.token,
        args: createBlackList.args,
        revokedByUserId: createBlackList.revokedByUserId,
      }
    })
  }

  exists(token: string) {
    return this.prismaService.blackListTokens.count({
      where: {
        token: token,
      }
    })
  }

  remove(token: string) {
    return this.prismaService.blackListTokens.deleteMany({
      where: {
        token: token
      }
    });
  }
}
