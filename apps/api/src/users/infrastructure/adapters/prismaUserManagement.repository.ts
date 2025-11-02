import { Injectable } from '@nestjs/common'

import { UserEntity } from '~/authorization/domain/entities/user.entity'
import { Role } from '~/authorization/domain/value-objects/role.vo'
import { PrismaService } from '~/database/prisma.service'
import { UserManagementRepositoryPort } from '~/users/domain/ports/userManagementRepository.port'

@Injectable()
export class PrismaUserManagementRepository implements UserManagementRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(userId: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true }
    })

    if (!user) {
      return null
    }

    return new UserEntity(user.id, user.email, user.name, user.role as Role)
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, role: true }
    })

    if (!user) {
      return null
    }

    return new UserEntity(user.id, user.email, user.name, user.role as Role)
  }

  async updateUserRole(userId: string, newRole: Role): Promise<UserEntity> {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: { id: true, email: true, name: true, role: true }
    })

    return new UserEntity(
      updatedUser.id,
      updatedUser.email,
      updatedUser.name,
      updatedUser.role as Role
    )
  }

  async countAdmins(): Promise<number> {
    return this.prisma.user.count({
      where: { role: Role.ADMIN }
    })
  }
}
