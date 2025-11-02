import { Injectable } from '@nestjs/common'

import { AuthorizationService } from '~/authorization/application/services/authorization.service'
import { IAbility } from '~/authorization/domain/ports/ability.interface'

@Injectable()
export class GetUserAbilitiesUseCase {
  constructor(private readonly authorizationService: AuthorizationService) {}

  async execute(userId: string): Promise<IAbility> {
    return this.authorizationService.getUserAbilities(userId)
  }
}
