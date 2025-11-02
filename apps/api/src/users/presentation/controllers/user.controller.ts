import { Body, Controller, Get, HttpCode, HttpStatus, Param, Put, UseGuards } from '@nestjs/common'
import { Session, UserSession } from '@thallesp/nestjs-better-auth'

import { Action } from '~/authorization/domain/value-objects/action.vo'
import { Role } from '~/authorization/domain/value-objects/role.vo'
import { CaslAuthorizationGuard } from '~/authorization/infrastructure/guards/caslAuthorization.guard'
import { CheckPolicies } from '~/authorization/presentation/decorators/checkPolicies.decorator'
import { GetUserUseCase } from '~/users/application/use-cases/getUser.uc'
import { UpdateUserRoleUseCase } from '~/users/application/use-cases/updateUserRole.uc'
import { UpdateUserRoleDto } from '~/users/presentation/dtos/updateUserRole.dto'

/**
 * User Controller - Manages user operations including role management
 *
 * All endpoints require authentication via Better Auth
 * Role management endpoints require ADMIN role
 */
@Controller('users')
export class UserController {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserRoleUseCase: UpdateUserRoleUseCase
  ) {}

  /**
   * Get user by ID
   * Requires: Authentication + Read User permission
   */
  @Get(':id')
  @UseGuards(CaslAuthorizationGuard)
  @CheckPolicies((ability: { can: (action: Action, subject: string) => boolean }) =>
    ability.can(Action.Read, 'User')
  )
  @HttpCode(HttpStatus.OK)
  async getUser(@Param('id') userId: string) {
    return this.getUserUseCase.execute(userId)
  }

  /**
   * Update user role
   * Requires: Authentication + ADMIN role (enforced by use case)
   *
   * Business Rules:
   * - Only ADMIN can update roles
   * - Cannot remove the last ADMIN
   * - Cannot change own role
   */
  @Put(':id/role')
  @UseGuards(CaslAuthorizationGuard)
  @CheckPolicies((ability: { can: (action: Action, subject: string) => boolean }) =>
    ability.can(Action.Manage, 'User')
  )
  @HttpCode(HttpStatus.OK)
  async updateUserRole(
    @Session() session: UserSession,
    @Param('id') targetUserId: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto
  ) {
    return this.updateUserRoleUseCase.execute(
      session.user.id,
      session.user.role as Role,
      targetUserId,
      updateUserRoleDto.role
    )
  }
}
