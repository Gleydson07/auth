import { Controller, Get, UseGuards } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { OnlyAdminGuard } from '@/infra/auth/guards/only-admin.guard';

@UseGuards(OnlyAdminGuard)
@Controller()
export class RabbitmqController {
  constructor(private readonly rabbitmqService: RabbitmqService) {}

  @Get('/restart')
  async restart() {
    return this.rabbitmqService.connectWithRetry();
  }
}
