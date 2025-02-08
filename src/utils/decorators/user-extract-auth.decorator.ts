import { UserFromToken } from '@/app/modules/auth/dto/token-payload.dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserFromToken => {
    const request = ctx.switchToHttp().getRequest();
    return {
      sub: request.user?.sub,
      username: request.user?.username,
      email: request.user?.email,
    };
  },
);
