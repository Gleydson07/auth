import { IsString } from "class-validator"

export class RecoveryPasswordDto {
  @IsString()
  login: string

  @IsString()
  password: string

  @IsString()
  provisionalPassword: string
}
