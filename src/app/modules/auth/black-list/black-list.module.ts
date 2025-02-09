import { Module } from '@nestjs/common';
import { BlackListRepository } from '@/app/repositories/black-list.repository';
import { PrismaBlackListService } from '@/infra/database/repositories/prisma-black-list.repository';

@Module({
  providers: [
    {
      provide: BlackListRepository,
      useClass: PrismaBlackListService,
    },
  ],
  exports: [BlackListRepository],
})
export class BlackListModule {}
