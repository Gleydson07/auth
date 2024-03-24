import { Module } from '@nestjs/common';
import { BlackListService } from './black-list.service';

@Module({
  providers: [BlackListService],
})
export class BlackListModule { }
