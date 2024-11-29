import { UsersService } from "@/users/users.service";
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class ScheduledTasksService {
  constructor (private readonly userService: UsersService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleDisableProvisionalPassword() {
    const expiredTasks = await this.userService.findExpiredProvisionalPassword(true);
    await this.userService.disableProvisionalPasswordByIds(expiredTasks.map(data => data.id));
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleDeleteProvisionalPassword() {
    const disabledTasks = await this.userService.findExpiredProvisionalPassword(false);
    await this.userService.deleteProvisionalPasswordByIds(disabledTasks.map(data => data.id));
  }
}
