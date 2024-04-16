import { IsNumber } from "class-validator"

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN"
}

export class CreateRoleDto {
  @IsNumber()
  userId: number
}
