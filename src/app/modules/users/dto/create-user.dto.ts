import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  lastname: string;

  @IsEmail()
  @IsNotEmpty()
  @Field()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  password: string;
}
