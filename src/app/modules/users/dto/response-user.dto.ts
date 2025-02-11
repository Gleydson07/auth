import { UserRole } from './create-role.dto';

export class ResponseUserDto {
  id: number;
  name: string;
  lastname: string;
  email: string;
  active: boolean;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
