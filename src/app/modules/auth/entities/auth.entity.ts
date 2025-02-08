import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class Auth {
  @Field()
  login: String

  @Field()
  password: String
}
