import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class GraphQLThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext): { req: any; res: any } {
    if (context.getType() === 'http') {
      return super.getRequestResponse(context);
    }

    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();

    const req = ctx.req || {};

    const res =
      ctx.res && typeof ctx.res.header === 'function'
        ? ctx.res
        : {
            header: () => {},
          };

    return { req, res };
  }

  protected async getTracker(
    req: Record<string, any> | undefined,
  ): Promise<string> {
    if (!req) {
      return 'unknown';
    }
    return req.ip || req.connection?.remoteAddress || 'unknown';
  }
}
