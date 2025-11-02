import { Injectable } from '@nestjs/common'

import { AuthorizationService } from '~/authorization/application/services/authorization.service'
import { Action } from '~/authorization/domain/value-objects/action.vo'

@Injectable()
export class CheckPermissionUseCase {
  constructor(private readonly authorizationService: AuthorizationService) {}

  async execute(userId: string, action: Action, subject: string): Promise<boolean> {
    return this.authorizationService.checkPermission(userId, action, subject)
  }
}
