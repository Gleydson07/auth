import { IsEmail, IsOptional, IsString } from "class-validator"

export class CreateUserDto {
  @IsString()
  name: string

  @IsString()
  lastname: string

  @IsOptional()
  @IsString()
  nickname?: string

  @IsEmail()
  email: string

  @IsString()
  password: string
}
