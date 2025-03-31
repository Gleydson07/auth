import { Module } from '@nestjs/common';
import { ScheduledTasksService } from './scheduled-tasks.service';
import { ProvisionalPasswordModule } from '@/app/modules/provisional-password/provisional-password.module';

@Module({
  imports: [ProvisionalPasswordModule],
  providers: [ScheduledTasksService],
  controllers: [],
  exports: [ScheduledTasksService],
})
export class ScheduledTasksModule {}
