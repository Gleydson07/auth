import { IsEmail, IsOptional, IsString, Matches } from "class-validator"

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

  @Matches()
  password: string
}
