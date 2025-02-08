import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserGraphqlService } from './user.gql.service';
import { AuthGuard } from '@/app/modules/auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../../dto/create-user.dto';
import { User } from '../../entities/user.entity';

@UseGuards(AuthGuard)
@Resolver(() => User)
export class UserGraphqlResolver {
  constructor(private readonly userGraphqlService: UserGraphqlService) {}

  @Mutation(() => User, { name: 'createUser' })
  createUser(@Args('createUser') createUserGraphqlInput: CreateUserDto) {
    return this.userGraphqlService.create(createUserGraphqlInput);
  }

  @Query(() => [User], { name: 'findAllUsers' })
  findAll(@Args('name', { nullable: true }) name?: string) {
    return this.userGraphqlService.findAll(name);
  }
}
