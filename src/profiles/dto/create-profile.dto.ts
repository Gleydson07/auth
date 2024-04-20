import { IsOptional, IsString } from "class-validator"

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
  phone?: string

  @IsOptional()
  document?: string

  @IsOptional()
  documentType?: string
}
