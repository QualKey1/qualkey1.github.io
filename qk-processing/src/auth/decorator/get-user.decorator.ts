import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * This class helps to get User object from Request
 */
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);