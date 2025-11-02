import { beforeEach, describe, expect, it } from 'bun:test'

import { UserEntity } from '~/authorization/domain/entities/user.entity'
import { Action } from '~/authorization/domain/value-objects/action.vo'
import { Role } from '~/authorization/domain/value-objects/role.vo'

import { CaslAbilityFactory } from './caslAbility.factory'

describe('CaslAbilityFactory', () => {
  let factory: CaslAbilityFactory

  beforeEach(() => {
    factory = new CaslAbilityFactory()
  })

  describe('USER role permissions', () => {
    it('should allow USER to read Post', () => {
      const user = new UserEntity('user-1', 'user@example.com', 'User', Role.USER)
      const ability = factory.createForUser(user)

      expect(ability.can(Action.Read, 'Post')).toBe(true)
    })

    it('should allow USER to read User', () => {
      const user = new UserEntity('user-1', 'user@example.com', 'User', Role.USER)
      const ability = factory.createForUser(user)

      expect(ability.can(Action.Read, 'User')).toBe(true)
    })

    it('should NOT allow USER to create Post', () => {
      const user = new UserEntity('user-1', 'user@example.com', 'User', Role.USER)
      const ability = factory.createForUser(user)

      expect(ability.can(Action.Create, 'Post')).toBe(false)
    })

    it('should NOT allow USER to update Post', () => {
      const user = new UserEntity('user-1', 'user@example.com', 'User', Role.USER)
      const ability = factory.createForUser(user)

      expect(ability.can(Action.Update, 'Post')).toBe(false)
    })

    it('should NOT allow USER to delete Post', () => {
      const user = new UserEntity('user-1', 'user@example.com', 'User', Role.USER)
      const ability = factory.createForUser(user)

      expect(ability.can(Action.Delete, 'Post')).toBe(false)
    })

    it('should NOT allow USER to manage all', () => {
      const user = new UserEntity('user-1', 'user@example.com', 'User', Role.USER)
      const ability = factory.createForUser(user)

      expect(ability.can(Action.Manage, 'all')).toBe(false)
    })
  })

  describe('EDITOR role permissions', () => {
    it('should allow EDITOR to read all resources', () => {
      const user = new UserEntity('editor-1', 'editor@example.com', 'Editor', Role.EDITOR)
      const ability = factory.createForUser(user)

      expect(ability.can(Action.Read, 'Post')).toBe(true)
      expect(ability.can(Action.Read, 'User')).toBe(true)
      expect(ability.can(Action.Read, 'Settings')).toBe(true)
    })

    it('should allow EDITOR to create Post', () => {
      const user = new UserEntity('editor-1', 'editor@example.com', 'Editor', Role.EDITOR)
      const ability = factory.createForUser(user)

      expect(ability.can(Action.Create, 'Post')).toBe(true)
    })

    it('should allow EDITOR to update Post', () => {
      const user = new UserEntity('editor-1', 'editor@example.com', 'Editor', Role.EDITOR)
      const ability = factory.createForUser(user)

      expect(ability.can(Action.Update, 'Post')).toBe(true)
    })

    it('should NOT allow EDITOR to delete Post', () => {
      const user = new UserEntity('editor-1', 'editor@example.com', 'Editor', Role.EDITOR)
      const ability = factory.createForUser(user)

      expect(ability.can(Action.Delete, 'Post')).toBe(false)
    })

    it('should NOT allow EDITOR to create User', () => {
      const user = new UserEntity('editor-1', 'editor@example.com', 'Editor', Role.EDITOR)
      const ability = factory.createForUser(user)

      expect(ability.can(Action.Create, 'User')).toBe(false)
    })

    it('should NOT allow EDITOR to manage all', () => {
      const user = new UserEntity('editor-1', 'editor@example.com', 'Editor', Role.EDITOR)
      const ability = factory.createForUser(user)

      expect(ability.can(Action.Manage, 'all')).toBe(false)
    })
  })

  describe('ADMIN role permissions', () => {
    it('should allow ADMIN to manage all resources', () => {
      const user = new UserEntity('admin-1', 'admin@example.com', 'Admin', Role.ADMIN)
      const ability = factory.createForUser(user)

      expect(ability.can(Action.Manage, 'all')).toBe(true)
    })

    it('should allow ADMIN to perform all actions on Post', () => {
      const user = new UserEntity('admin-1', 'admin@example.com', 'Admin', Role.ADMIN)
      const ability = factory.createForUser(user)

      expect(ability.can(Action.Create, 'Post')).toBe(true)
      expect(ability.can(Action.Read, 'Post')).toBe(true)
      expect(ability.can(Action.Update, 'Post')).toBe(true)
      expect(ability.can(Action.Delete, 'Post')).toBe(true)
    })

    it('should allow ADMIN to perform all actions on User', () => {
      const user = new UserEntity('admin-1', 'admin@example.com', 'Admin', Role.ADMIN)
      const ability = factory.createForUser(user)

      expect(ability.can(Action.Create, 'User')).toBe(true)
      expect(ability.can(Action.Read, 'User')).toBe(true)
      expect(ability.can(Action.Update, 'User')).toBe(true)
      expect(ability.can(Action.Delete, 'User')).toBe(true)
    })

    it('should allow ADMIN to perform all actions on Settings', () => {
      const user = new UserEntity('admin-1', 'admin@example.com', 'Admin', Role.ADMIN)
      const ability = factory.createForUser(user)

      expect(ability.can(Action.Create, 'Settings')).toBe(true)
      expect(ability.can(Action.Read, 'Settings')).toBe(true)
      expect(ability.can(Action.Update, 'Settings')).toBe(true)
      expect(ability.can(Action.Delete, 'Settings')).toBe(true)
    })
  })

  describe('cannot() method', () => {
    it('should correctly report denied permissions for USER', () => {
      const user = new UserEntity('user-1', 'user@example.com', 'User', Role.USER)
      const ability = factory.createForUser(user)

      expect(ability.cannot(Action.Create, 'Post')).toBe(true)
      expect(ability.cannot(Action.Delete, 'Post')).toBe(true)
    })

    it('should correctly report denied permissions for EDITOR', () => {
      const user = new UserEntity('editor-1', 'editor@example.com', 'Editor', Role.EDITOR)
      const ability = factory.createForUser(user)

      expect(ability.cannot(Action.Delete, 'Post')).toBe(true)
      expect(ability.cannot(Action.Manage, 'all')).toBe(true)
    })

    it('should correctly report allowed permissions as not denied', () => {
      const user = new UserEntity('admin-1', 'admin@example.com', 'Admin', Role.ADMIN)
      const ability = factory.createForUser(user)

      expect(ability.cannot(Action.Manage, 'all')).toBe(false)
      expect(ability.cannot(Action.Delete, 'Post')).toBe(false)
    })
  })
})
