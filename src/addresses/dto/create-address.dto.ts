import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";
import { Address } from "../entities/address.entity";

export class CreateAddressDto extends Address {
  @IsNumber()
  userId: Number

  @IsString()
  neighborhood: String

  @IsOptional()
  @IsString()
  street?: String

  @IsOptional()
  @IsString()
  number?: String

  @IsString()
  city: String

  @IsString()
  country: String

  @IsDate()
  createdAt: Date

  @IsDate()
  updatedAt: Date
}
