import { Injectable } from '@nestjs/common';
import { UserFromToken } from '@/app/modules/auth/dto/token-payload.dto';
import { ResponseUserDto } from '../modules/users/dto/response-user.dto';
import { CreateUserDto } from '../modules/users/dto/create-user.dto';
import { FindByEmailDto } from '../modules/users/dto/find-by-email-user.dto';
import { ResponseUserCredentialsDto } from '../modules/users/dto/response-user-credentials.dto';
import { UpdateUserDto } from '../modules/users/dto/update-user.dto';

export const SALT = 12;

@Injectable()
export abstract class UserRepository {
  abstract create(data: CreateUserDto): Promise<ResponseUserDto>;

  abstract findAll(active?: boolean): Promise<ResponseUserDto[]>;

  abstract findOneById(id: number, active?: boolean): Promise<ResponseUserDto>;

  abstract findOneByEmail({
    email,
    active,
  }: FindByEmailDto): Promise<ResponseUserDto & { password: string }>;

  abstract remove(id: number): Promise<void>;

  abstract generateProvisionalPassword(
    userId: number,
    password: string,
  ): Promise<void>;

  abstract findExpiredProvisionalPassword(
    isActive?: boolean,
  ): Promise<{ id: number }[]>;

  abstract disableProvisionalPasswordByUserId(userId: number): Promise<void>;

  abstract findPasswordAndProvisionalPasswordByEmail(
    email: string,
  ): Promise<ResponseUserCredentialsDto>;

  abstract disableProvisionalPasswordByIds(ids: number[]): Promise<void>;

  abstract deleteProvisionalPasswordByIds(ids: number[]): Promise<void>;

  abstract updatePassword(email: string, password: string): Promise<void>;

  abstract update(id: number, updateUserDto: UpdateUserDto): Promise<void>;

  abstract checkIsUserAdminOrSameId(props: {
    userId: number;
    userIdFromToken: number;
    messageError: string;
  }): Promise<void>;
}
