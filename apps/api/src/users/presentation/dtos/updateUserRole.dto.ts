import { IsEnum, IsNotEmpty } from 'class-validator'

import { Role } from '~/authorization/domain/value-objects/role.vo'

export class UpdateUserRoleDto {
  @IsNotEmpty({ message: 'Role is required' })
  @IsEnum(Role, { message: 'Role must be one of: user, editor, admin' })
  role!: Role
}
