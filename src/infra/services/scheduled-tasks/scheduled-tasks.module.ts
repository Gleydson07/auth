import { Module } from '@nestjs/common';
import { ScheduledTasksService } from './scheduled-tasks.service';
import { UsersModule } from '@/app/modules/users/users.module';
import { ProvisionalPasswordModule } from '@/app/modules/provisional-password/provisional-password.module';

@Module({
  imports: [UsersModule, ProvisionalPasswordModule],
  controllers: [],
  providers: [ScheduledTasksService],
})
export class ScheduledTasksModule {}
