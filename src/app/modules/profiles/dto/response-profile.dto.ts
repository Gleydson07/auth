import { Field, Int, ObjectType } from '@nestjs/graphql';
import { DocumentTypeEnum } from './create-profile.dto';

@ObjectType()
export class ResponseProfileDto {
  @Field(() => Int)
  id: Number;

  @Field(() => Int)
  userId: Number;

  @Field({ nullable: true })
  birthDay?: Date;

  @Field({ nullable: true })
  gender?: String;

  @Field()
  document: String;

  @Field()
  documentType: DocumentTypeEnum;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
