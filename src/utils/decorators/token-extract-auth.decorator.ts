import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): void => {
    const request = ctx.switchToHttp().getRequest();
    const { authorization }: any = request.headers;

    return authorization.split("Bearer ")[1] || "";

  },
);
