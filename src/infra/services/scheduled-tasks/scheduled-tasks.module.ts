import { Module } from '@nestjs/common';
import { ScheduledTasksService } from './scheduled-tasks.service';
import { UsersService } from '@/app/modules/users/users.service';

@Module({
  controllers: [],
  providers: [ScheduledTasksService, UsersService],
})
export class ScheduledTasksModule {}
