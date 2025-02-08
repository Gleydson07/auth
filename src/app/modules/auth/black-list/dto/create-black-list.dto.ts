import { IsNumber, IsString } from "class-validator"
import { BlackList } from "../entities/black-list.entity"

export class CreateBlackListDto extends BlackList {
  @IsString()
  token: string

  @IsString()
  args: string

  @IsNumber()
  revokedByUserId: number
}
