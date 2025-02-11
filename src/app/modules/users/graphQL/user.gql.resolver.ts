import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateUserDto } from '../dto/create-user.dto';
import { ResponseUserWithAggregatesDto } from '../dto/response-user-with-aggregates.dto';
import { CreateUserUseCase } from '../usecases/create-user.usecase';
import { FindAllWithAggregatesUsersUseCase } from '../usecases/find-all-with-aggregates-users.usecase';

@Resolver(() => ResponseUserWithAggregatesDto)
export class UserGraphqlResolver {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findAllWithAggregatesUsersUseCase: FindAllWithAggregatesUsersUseCase,
  ) {}

  @Mutation(() => ResponseUserWithAggregatesDto, { name: 'createUser' })
  createUser(@Args('createUser') createUserGraphqlInput: CreateUserDto) {
    return this.createUserUseCase.execute(createUserGraphqlInput);
  }

  @Query(() => [ResponseUserWithAggregatesDto], { name: 'findAllUsers' })
  findAll(@Args('name', { nullable: true }) name?: string) {
    return this.findAllWithAggregatesUsersUseCase.execute(name);
  }
}
