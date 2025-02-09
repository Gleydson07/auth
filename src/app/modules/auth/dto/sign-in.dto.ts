import { IsString } from 'class-validator';

export class SignInAuthDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
