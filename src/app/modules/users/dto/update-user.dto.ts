import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { UserRole } from './create-role.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  role?: UserRole;
  active?: boolean;
}
