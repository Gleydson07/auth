import { IsOptional, IsString } from "class-validator";
import { Address } from "../entities/address.entity";

export class CreateAddressDto extends Address {
  @IsString()
  neighborhood: string

  @IsOptional()
  @IsString()
  street?: string

  @IsOptional()
  @IsString()
  number?: string

  @IsString()
  city: string

  @IsString()
  country: string

  @IsString()
  zipCode: string
}
