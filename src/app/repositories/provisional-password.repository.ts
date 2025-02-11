import { Injectable } from '@nestjs/common';
import { ResponseUserCredentialsDto } from '../modules/users/dto/response-user-credentials.dto';
import { UpdateProvisionalPasswordDto } from '../modules/provisional-password/dto/update-provisional-password.dto';

@Injectable()
export abstract class ProvisionalPasswordRepository {
  abstract findPasswordAndProvisionalPasswordByEmail(
    email: string,
  ): Promise<ResponseUserCredentialsDto>;

  abstract updateManyProvisionalPasswordByUserId(
    userId: number,
    data: UpdateProvisionalPasswordDto,
  ): Promise<void>;

  abstract generateProvisionalPassword(
    userId: number,
    password: string,
  ): Promise<void>;

  abstract findExpiredProvisionalPassword(
    isActive?: boolean,
  ): Promise<{ id: number }[]>;

  abstract disableProvisionalPasswordByIds(ids: number[]): Promise<void>;

  abstract deleteProvisionalPasswordByIds(ids: number[]): Promise<void>;
}
