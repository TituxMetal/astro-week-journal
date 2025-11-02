import { Module } from '@nestjs/common'

import { DatabaseModule } from '~/database/database.module'

import { AuthorizationService } from './application/services/authorization.service'
import { CheckPermissionUseCase } from './application/use-cases/checkPermission.uc'
import { GetUserAbilitiesUseCase } from './application/use-cases/getUserAbilities.uc'
import { ABILITY_FACTORY } from './domain/ports/abilityFactory.port'
import { USER_REPOSITORY } from './domain/ports/userRepository.port'
import { CaslAbilityFactory } from './infrastructure/adapters/caslAbility.factory'
import { PrismaUserRepository } from './infrastructure/adapters/prismaUser.repository'
import { CaslAuthorizationGuard } from './infrastructure/guards/caslAuthorization.guard'

@Module({
  imports: [DatabaseModule],
  providers: [
    // Bind ports to adapters (hexagonal architecture)
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository
    },
    {
      provide: ABILITY_FACTORY,
      useClass: CaslAbilityFactory
    },
    // Application services
    AuthorizationService,
    CheckPermissionUseCase,
    GetUserAbilitiesUseCase,
    // Infrastructure
    CaslAuthorizationGuard
  ],
  exports: [AuthorizationService, CaslAuthorizationGuard]
})
export class AuthorizationModule {}
