import { ProvisionalPasswordRepository } from '@/app/repositories/provisional-password.repository';
import { PrismaProvisionalPasswordRepository } from '@/infra/database/Prisma/repositories/prisma-provisional-password.repository';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: ProvisionalPasswordRepository,
      useClass: PrismaProvisionalPasswordRepository,
    },
  ],
  exports: [ProvisionalPasswordRepository],
})
export class ProvisionalPasswordModule {}
