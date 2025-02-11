import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ResponseAddressDto } from '../../addresses/dto/response-address.dto';
import { ResponseProfileDto } from '../../profiles/dto/response-profile.dto';

@ObjectType()
export class ResponseUserWithAggregatesDto {
  @Field(() => Int)
  id: Number;

  @Field()
  name: String;

  @Field()
  lastname: String;

  @Field()
  email: String;

  password?: String;

  @Field({ nullable: true })
  active?: Boolean;

  @Field({ nullable: true })
  role?: string;

  @Field(() => [ResponseAddressDto], { nullable: true })
  address?: ResponseAddressDto[];

  @Field(() => ResponseProfileDto, { nullable: true })
  profile?: ResponseProfileDto;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
