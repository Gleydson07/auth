import { IsString } from "class-validator"

export class UpdatePasswordDto {
  @IsString()
  login: string

  @IsString()
  currentPassword: string

  @IsString()
  password: string
}
