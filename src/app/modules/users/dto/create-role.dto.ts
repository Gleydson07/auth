import { IsNumber, IsString } from 'class-validator';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class CreateRoleDto {
  @IsString()
  role: UserRole;

  @IsNumber()
  userId: number;
}
