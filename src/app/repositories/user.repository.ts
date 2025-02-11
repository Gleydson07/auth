import { Injectable } from '@nestjs/common';
import { ResponseUserDto } from '../modules/users/dto/response-user.dto';
import { CreateUserDto } from '../modules/users/dto/create-user.dto';
import { FindByEmailDto } from '../modules/users/dto/find-by-email-user.dto';
import { UpdateUserDto } from '../modules/users/dto/update-user.dto';
import { ResponseUserWithAggregatesDto } from '../modules/users/dto/response-user-with-aggregates.dto';

export const SALT = 12;

@Injectable()
export abstract class UserRepository {
  abstract create(data: CreateUserDto): Promise<ResponseUserDto>;

  abstract findAll(active?: boolean): Promise<ResponseUserDto[]>;

  abstract findAllWithAggregates(
    name?: string,
  ): Promise<ResponseUserWithAggregatesDto[]>;

  abstract findOneById(id: number, active?: boolean): Promise<ResponseUserDto>;

  abstract findOneByEmail({
    email,
    active,
  }: FindByEmailDto): Promise<
    ResponseUserDto & { password: string; active: boolean }
  >;

  abstract remove(id: number): Promise<void>;

  abstract updatePassword(email: string, password: string): Promise<void>;

  abstract update(id: number, updateUserDto: UpdateUserDto): Promise<void>;

  abstract checkIsUserAdminOrSameId(props: {
    userId: number;
    userIdFromToken: number;
    messageError: string;
  }): Promise<void>;
}
