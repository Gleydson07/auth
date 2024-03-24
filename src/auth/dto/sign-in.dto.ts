import { IsString } from "class-validator"
import { Auth } from "../entities/auth.entity"

export class SignInAuthDto extends Auth{
  @IsString()
  login: string

  @IsString()
  password: string
}
