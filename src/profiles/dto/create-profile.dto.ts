import { IsDate, IsOptional, IsString } from "class-validator"

export enum GenderEnum {
  Masc = "M",
  Fem = "F",
  Other = "Other"
}

export class CreateProfileDto {
  @IsOptional()
  @IsString()
  birthDay?: Date

  @IsOptional()
  gender?: GenderEnum

  @IsOptional()
  mainRegistration?: string
}
