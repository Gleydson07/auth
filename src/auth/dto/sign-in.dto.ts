import { IsString } from "class-validator"
import { Auth } from "../entities/auth.entity"

export class SignInAuthDto extends Auth{
  @IsString()
  email: string

  @IsString()
  password: string
}
