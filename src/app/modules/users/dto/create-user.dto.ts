import { Field, InputType } from "@nestjs/graphql"
import { IsEmail, IsString } from "class-validator"

@InputType()
export class CreateUserDto {
  @Field()
  @IsString()
  name: string

  @Field()
  @IsString()
  lastname: string

  @Field()
  @IsEmail()
  email: string

  @Field()
  @IsString()
  password: string
}
