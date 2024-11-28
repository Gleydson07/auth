import { IsString } from "class-validator"

export class RecoveryPasswordDto {
  @IsString()
  email: string

  @IsString()
  password: string

  @IsString()
  provisionalPassword: string
}
