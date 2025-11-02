import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it } from 'bun:test'

import { ABILITY_FACTORY } from '~/authorization/domain/ports/abilityFactory.port'
import { USER_REPOSITORY } from '~/authorization/domain/ports/userRepository.port'
import { Action } from '~/authorization/domain/value-objects/action.vo'
import { MockAbilityFactory, MockUserRepository } from '~/test/mocks/authorization.mocks'

import { AuthorizationService } from './authorization.service'

describe('AuthorizationService', () => {
  let service: AuthorizationService
  let userRepository: MockUserRepository
  let abilityFactory: MockAbilityFactory

  beforeEach(async () => {
    userRepository = new MockUserRepository()
    abilityFactory = new MockAbilityFactory()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorizationService,
        {
          provide: USER_REPOSITORY,
          useValue: userRepository
        },
        {
          provide: ABILITY_FACTORY,
          useValue: abilityFactory
        }
      ]
    }).compile()

    service = module.get<AuthorizationService>(AuthorizationService)
  })

  describe('getUserAbilities', () => {
    it('should return abilities for existing user', async () => {
      const ability = await service.getUserAbilities('user-1')

      expect(ability).toBeDefined()
      expect(ability.can(Action.Read, 'Post')).toBe(true)
    })

    it('should throw error for non-existent user', async () => {
      await expect(service.getUserAbilities('non-existent')).rejects.toThrow('User not found')
    })

    it('should return correct abilities for USER role', async () => {
      const ability = await service.getUserAbilities('user-1')

      expect(ability.can(Action.Read, 'Post')).toBe(true)
      expect(ability.can(Action.Read, 'User')).toBe(true)
      expect(ability.can(Action.Create, 'Post')).toBe(false)
    })

    it('should return correct abilities for EDITOR role', async () => {
      const ability = await service.getUserAbilities('editor-1')

      expect(ability.can(Action.Read, 'Post')).toBe(true)
      expect(ability.can(Action.Create, 'Post')).toBe(true)
      expect(ability.can(Action.Update, 'Post')).toBe(true)
      expect(ability.can(Action.Delete, 'Post')).toBe(false)
    })

    it('should return correct abilities for ADMIN role', async () => {
      const ability = await service.getUserAbilities('admin-1')

      expect(ability.can(Action.Manage, 'all')).toBe(true)
      expect(ability.can(Action.Delete, 'Post')).toBe(true)
      expect(ability.can(Action.Create, 'User')).toBe(true)
    })
  })

  describe('checkPermission', () => {
    it('should return true when user has permission', async () => {
      const hasPermission = await service.checkPermission('user-1', Action.Read, 'Post')

      expect(hasPermission).toBe(true)
    })

    it('should return false when user lacks permission', async () => {
      const hasPermission = await service.checkPermission('user-1', Action.Create, 'Post')

      expect(hasPermission).toBe(false)
    })

    it('should throw error for non-existent user', async () => {
      await expect(service.checkPermission('non-existent', Action.Read, 'Post')).rejects.toThrow(
        'User not found'
      )
    })

    it('should correctly check EDITOR permissions', async () => {
      expect(await service.checkPermission('editor-1', Action.Read, 'Post')).toBe(true)
      expect(await service.checkPermission('editor-1', Action.Create, 'Post')).toBe(true)
      expect(await service.checkPermission('editor-1', Action.Update, 'Post')).toBe(true)
      expect(await service.checkPermission('editor-1', Action.Delete, 'Post')).toBe(false)
    })

    it('should correctly check ADMIN permissions', async () => {
      expect(await service.checkPermission('admin-1', Action.Manage, 'all')).toBe(true)
      expect(await service.checkPermission('admin-1', Action.Delete, 'Post')).toBe(true)
      expect(await service.checkPermission('admin-1', Action.Create, 'User')).toBe(true)
      expect(await service.checkPermission('admin-1', Action.Update, 'Settings')).toBe(true)
    })
  })
})
