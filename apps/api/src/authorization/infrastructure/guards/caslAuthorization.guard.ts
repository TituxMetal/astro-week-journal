import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { AuthorizationService } from '~/authorization/application/services/authorization.service'
import { IAbility } from '~/authorization/domain/ports/ability.interface'
import { CHECK_POLICIES_KEY } from '~/authorization/presentation/decorators/checkPolicies.decorator'

/**
 * Policy handler function type
 */
type PolicyHandler = (ability: IAbility) => boolean

@Injectable()
export class CaslAuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authorizationService: AuthorizationService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers = this.reflector.get<PolicyHandler[]>(
      CHECK_POLICIES_KEY,
      context.getHandler()
    )

    if (!policyHandlers) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    // Better Auth sets request.session with the user session
    const session = request.session
    const user = session?.user

    if (!user) {
      throw new ForbiddenException('User not authenticated')
    }

    const ability = await this.authorizationService.getUserAbilities(user.id)

    const allowed = policyHandlers.every(handler => handler(ability))

    if (!allowed) {
      throw new ForbiddenException('Insufficient permissions')
    }

    return true
  }
}
