import { Module } from '@nestjs/common';
import { ScheduledTasksService } from './scheduled-tasks.service';
import { BlackListService } from '@/app/modules/auth/black-list/black-list.service';
import { UsersService } from '@/app/modules/users/users.service';

@Module({
  controllers: [],
  providers: [ScheduledTasksService, BlackListService, UsersService],
})
export class ScheduledTasksModule {}
