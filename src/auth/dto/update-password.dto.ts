import { IsString } from "class-validator"

export class UpdatePasswordDto {
  @IsString()
  email: string

  @IsString()
  currentPassword: string

  @IsString()
  password: string
}
