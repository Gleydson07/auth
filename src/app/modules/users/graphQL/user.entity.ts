import { Address } from '@/app/modules/addresses/entities/address.entity';
import { Profile } from '@/app/modules/profiles/graphQL/profile.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserEntity {
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

  @Field(() => [Address], { nullable: true })
  address?: Address[];

  @Field(() => Profile, { nullable: true })
  profile?: Profile;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
