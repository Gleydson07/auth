import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from "@/users/entities/user.entity";
import { UserGraphqlService } from "./user.gql.service";
import { CreateUserDto } from "@/users/dto/create-user.dto";
import { AuthGuard } from "@/auth/guards/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard)
@Resolver(() => User)
export class UserGraphqlResolver {
  constructor(private readonly userGraphqlService: UserGraphqlService) {}

  @Mutation(() => User, { name: "create" })
  createUser(@Args('createUser') createUserGraphqlInput: CreateUserDto) {
    return this.userGraphqlService.create(createUserGraphqlInput);
  }

  @Query(() => [User], { name: 'findAll' })
  findAll(@Args('name', { nullable: true }) name?: string) {
    return this.userGraphqlService.findAll(name);
  }
}
