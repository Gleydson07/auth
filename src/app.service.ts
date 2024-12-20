import { Injectable } from '@nestjs/common';
import { Query, Resolver } from "@nestjs/graphql";

@Resolver()
@Injectable()
export class AppService {

  @Query(() => String)
  getHello(): string {
    return 'Hello World!';
  }
}
