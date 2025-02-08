import { IsBoolean, IsEmail, IsOptional } from "class-validator"

export class FindByEmailDto {
  @IsEmail()
  email: string

  @IsOptional()
  @IsBoolean()
  active?: boolean
}
