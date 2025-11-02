import { Module } from '@nestjs/common'

import { AuthorizationModule } from '~/authorization/authorization.module'
import { DatabaseModule } from '~/database/database.module'
import { GetUserUseCase } from '~/users/application/use-cases/getUser.uc'
import { UpdateUserRoleUseCase } from '~/users/application/use-cases/updateUserRole.uc'
import { USER_MANAGEMENT_REPOSITORY } from '~/users/domain/ports/userManagementRepository.port'
import { PrismaUserManagementRepository } from '~/users/infrastructure/adapters/prismaUserManagement.repository'
import { UserController } from '~/users/presentation/controllers/user.controller'

@Module({
  imports: [DatabaseModule, AuthorizationModule],
  controllers: [UserController],
  providers: [
    // Use Cases
    GetUserUseCase,
    UpdateUserRoleUseCase,
    // Repositories
    {
      provide: USER_MANAGEMENT_REPOSITORY,
      useClass: PrismaUserManagementRepository
    }
  ],
  exports: [GetUserUseCase, UpdateUserRoleUseCase]
})
export class UsersModule {}
