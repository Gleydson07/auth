import { IsNumber, IsString } from "class-validator"

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN"
}

export class CreateRoleDto {
  @IsString()
  role: Role

  @IsNumber()
  userId: number
}
