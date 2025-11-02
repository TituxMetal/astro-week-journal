import { beforeEach, describe, expect, it } from 'bun:test'

import { AuthorizationService } from '~/authorization/application/services/authorization.service'
import { IAbility } from '~/authorization/domain/ports/ability.interface'
import { Action } from '~/authorization/domain/value-objects/action.vo'

import { GetUserAbilitiesUseCase } from './getUserAbilities.uc'

describe('GetUserAbilitiesUseCase', () => {
  let useCase: GetUserAbilitiesUseCase
  let mockAuthorizationService: Partial<AuthorizationService>
  let getUserAbilitiesCalls: string[]
  const mockAbility: IAbility = {
    can: () => true,
    cannot: () => false
  }

  beforeEach(() => {
    getUserAbilitiesCalls = []
    mockAuthorizationService = {
      getUserAbilities: async (userId: string) => {
        getUserAbilitiesCalls.push(userId)
        return mockAbility
      }
    }

    useCase = new GetUserAbilitiesUseCase(mockAuthorizationService as AuthorizationService)
  })

  it('should be defined', () => {
    expect(useCase).toBeDefined()
  })

  it('should delegate to AuthorizationService.getUserAbilities', async () => {
    const userId = 'user-1'

    await useCase.execute(userId)

    expect(getUserAbilitiesCalls.length).toBe(1)
    expect(getUserAbilitiesCalls[0]).toBe(userId)
  })

  it('should return the ability from AuthorizationService', async () => {
    const customAbility: IAbility = {
      can: (action: Action, subject: string) => action === Action.Read && subject === 'Post',
      cannot: (action: Action, subject: string) => !(action === Action.Read && subject === 'Post')
    }
    mockAuthorizationService.getUserAbilities = async () => customAbility

    const result = await useCase.execute('user-1')

    expect(result).toBe(customAbility)
    expect(result.can(Action.Read, 'Post')).toBe(true)
    expect(result.can(Action.Delete, 'Post')).toBe(false)
  })

  it('should propagate errors from AuthorizationService', async () => {
    const error = new Error('User not found')
    mockAuthorizationService.getUserAbilities = async () => {
      throw error
    }

    await expect(useCase.execute('non-existent')).rejects.toThrow('User not found')
  })
})
