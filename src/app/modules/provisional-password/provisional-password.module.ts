import { ProvisionalPasswordRepository } from '@/app/repositories/provisional-password.repository';
import { PrismaProvisionalPasswordRepository } from '@/infra/database/Prisma/repositories/prisma-provisional-password.repository';
import { EventBusService } from '@/infra/events/event-bus.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    EventBusService,
    {
      provide: ProvisionalPasswordRepository,
      useClass: PrismaProvisionalPasswordRepository,
    },
  ],
  exports: [ProvisionalPasswordRepository, EventBusService],
})
export class ProvisionalPasswordModule {}
