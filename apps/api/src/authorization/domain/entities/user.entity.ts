import { Role } from '~/authorization/domain/value-objects/role.vo'

export class UserEntity {
  constructor(
    private readonly id: string,
    private readonly email: string,
    private readonly name: string,
    private readonly role: Role
  ) {}

  getId(): string {
    return this.id
  }

  getEmail(): string {
    return this.email
  }

  getName(): string {
    return this.name
  }

  getRole(): Role {
    return this.role
  }

  hasRole(role: Role): boolean {
    return this.role === role
  }
}
