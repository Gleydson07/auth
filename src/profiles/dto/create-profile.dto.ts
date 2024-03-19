export enum GenderEnum {
  Masc = "M",
  Fem = "F",
  Other = "Other"
}

export class CreateProfileDto {
  userId: number
  birthDay?: Date
  gender?: GenderEnum
  mainRegistration?: string
}
