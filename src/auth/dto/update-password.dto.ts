import { IsString } from "class-validator"

export class UpdatePasswordDto {
  @IsString()
  currentPassword: string

  @IsString()
  password: string
}
