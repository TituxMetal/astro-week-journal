import { UserEntity } from '~/authorization/domain/entities/user.entity'

export interface UserRepositoryPort {
  findById(userId: string): Promise<UserEntity | null>
  findByEmail(email: string): Promise<UserEntity | null>
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY')
