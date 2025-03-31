import { IsNumber, IsString } from 'class-validator';
class BlackList {
  token: string;
  revokedByUserId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CreateBlackListDto extends BlackList {
  @IsString()
  token: string;

  @IsString()
  args: string;

  @IsNumber()
  revokedByUserId: number;
}
