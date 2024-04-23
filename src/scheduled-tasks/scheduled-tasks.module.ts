import { Module } from '@nestjs/common';
import { ScheduledTasksService } from './scheduled-tasks.service';
import { UsersService } from "@/users/users.service";
import { BlackListService } from "@/auth/black-list/black-list.service";

@Module({
  controllers: [],
  providers: [ScheduledTasksService, BlackListService, UsersService],
})
export class ScheduledTasksModule {}
