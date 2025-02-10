import { Module } from '@nestjs/common';
import { BlackListRepository } from '@/app/repositories/black-list.repository';
import { PrismaBlackListRepository } from '@/infra/database/Prisma/repositories/prisma-black-list.repository';

@Module({
  providers: [
    {
      provide: BlackListRepository,
      useClass: PrismaBlackListRepository,
    },
  ],
  exports: [BlackListRepository],
})
export class BlackListModule {}
