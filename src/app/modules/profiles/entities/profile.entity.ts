import { Field, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class Profile {
  @Field(() => Int)
  id: Number

  @Field(() => Int)
  userId: Number

  @Field({ nullable: true })
  birthDay?: Date

  @Field({ nullable: true })
  gender?: String

  @Field({ nullable: true })
  mainRegistration?: String

  @Field({ nullable: true })
  createdAt?: Date

  @Field({ nullable: true })
  updatedAt?: Date
}
