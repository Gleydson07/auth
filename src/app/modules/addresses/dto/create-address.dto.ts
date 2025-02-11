import { IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  neighborhood: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  number?: string;

  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsString()
  zipCode: string;
}
