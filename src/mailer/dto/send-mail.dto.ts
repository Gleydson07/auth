import { IsString } from "class-validator";

export class SendMailDto {
  from: string

  recipients: string

  @IsString()
  subject: string

  @IsString()
  html: string

  @IsString()
  text: string
}
