import { Injectable } from '@nestjs/common';
import { CreateBlackListDto } from '@/app/modules/auth/black-list/dto/create-black-list.dto';
import { ResponseBlackListDto } from '../modules/auth/black-list/dto/response-black-list.dto';

@Injectable()
export abstract class BlackListRepository {
  abstract create(
    createBlackList: CreateBlackListDto,
  ): Promise<ResponseBlackListDto>;

  abstract exists(token: string): Promise<number>;

  abstract remove(token: string): Promise<void>;
}
