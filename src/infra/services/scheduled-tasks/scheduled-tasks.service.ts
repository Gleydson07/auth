import { ProvisionalPasswordRepository } from '@/app/repositories/provisional-password.repository';
import { UserRepository } from '@/app/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ScheduledTasksService {
  constructor(
    private readonly provisionalPasswordRepository: ProvisionalPasswordRepository,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleDisableProvisionalPassword() {
    const expiredTasks =
      await this.provisionalPasswordRepository.findExpiredProvisionalPassword(
        true,
      );
    await this.provisionalPasswordRepository.disableProvisionalPasswordByIds(
      expiredTasks.map((data) => data.id),
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleDeleteProvisionalPassword() {
    const disabledTasks =
      await this.provisionalPasswordRepository.findExpiredProvisionalPassword(
        false,
      );
    await this.provisionalPasswordRepository.deleteProvisionalPasswordByIds(
      disabledTasks.map((data) => data.id),
    );
  }
}
