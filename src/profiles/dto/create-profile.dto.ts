import { IsDate, IsNumber, IsOptional } from "class-validator"
import { Profile } from "../entities/profile.entity"

export enum GenderEnum {
  Masc = "M",
  Fem = "F",
  Other = "Other"
}

export class CreateProfileDto extends Profile {
  @IsNumber()
  userId: number

  @IsOptional()
  @IsDate()
  birthDay?: Date

  @IsOptional()
  gender?: GenderEnum

  @IsOptional()
  mainRegistration?: string
}
