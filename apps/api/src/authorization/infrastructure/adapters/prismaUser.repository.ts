import { Injectable } from '@nestjs/common'

import { UserEntity } from '~/authorization/domain/entities/user.entity'
import { UserRepositoryPort } from '~/authorization/domain/ports/userRepository.port'
import { Role } from '~/authorization/domain/value-objects/role.vo'
import { PrismaService } from '~/database/prisma.service'

@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
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
}
