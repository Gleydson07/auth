import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ResponseAddressDto {
  @Field(() => Int)
  id: Number;

  @Field(() => Int)
  userId: Number;

  @Field()
  neighborhood: String;

  @Field({ nullable: true })
  street?: String;

  @Field({ nullable: true })
  number?: String;

  @Field()
  city: String;

  @Field()
  country: String;

  @Field()
  zipCode: String;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
