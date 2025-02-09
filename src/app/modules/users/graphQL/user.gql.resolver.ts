import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserEntity } from './user.entity';
import { UserGraphqlService } from './user.gql.service';

@Resolver(() => UserEntity)
export class UserGraphqlResolver {
  constructor(private readonly userGraphqlService: UserGraphqlService) {}

  @Mutation(() => UserEntity, { name: 'createUser' })
  createUser(@Args('createUser') createUserGraphqlInput: CreateUserDto) {
    return this.userGraphqlService.create(createUserGraphqlInput);
  }

  @Query(() => [UserEntity], { name: 'findAllUsers' })
  findAll(@Args('name', { nullable: true }) name?: string) {
    return this.userGraphqlService.findAll(name);
  }
}
