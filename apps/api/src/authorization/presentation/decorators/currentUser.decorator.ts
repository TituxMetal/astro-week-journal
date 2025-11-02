import { createParamDecorator, ExecutionContext } from '@nestjs/common'

/**
 * Decorator to extract the current user from the request
 *
 * @example
 * ```ts
 * async getProfile(@CurrentUser() user: UserEntity) {
 *   return user;
 * }
 * ```
 */
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  return request.user
})
