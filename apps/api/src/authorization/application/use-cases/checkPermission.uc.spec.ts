import { beforeEach, describe, expect, it } from 'bun:test'

import { AuthorizationService } from '~/authorization/application/services/authorization.service'
import { Action } from '~/authorization/domain/value-objects/action.vo'

import { CheckPermissionUseCase } from './checkPermission.uc'

interface CheckPermissionCall {
  userId: string
  action: Action
  subject: string
}

describe('CheckPermissionUseCase', () => {
  let useCase: CheckPermissionUseCase
  let mockAuthorizationService: Partial<AuthorizationService>
  let checkPermissionCalls: CheckPermissionCall[]

  beforeEach(() => {
    checkPermissionCalls = []
    mockAuthorizationService = {
      checkPermission: async (userId: string, action: Action, subject: string) => {
        checkPermissionCalls.push({ userId, action, subject })
        return true
      }
    }

    useCase = new CheckPermissionUseCase(mockAuthorizationService as AuthorizationService)
  })

  it('should be defined', () => {
    expect(useCase).toBeDefined()
  })

  it('should delegate to AuthorizationService.checkPermission', async () => {
    const userId = 'user-1'
    const action = Action.Read
    const subject = 'Post'

    await useCase.execute(userId, action, subject)

    expect(checkPermissionCalls.length).toBe(1)
    expect(checkPermissionCalls[0]).toEqual({ userId, action, subject })
  })

  it('should return the result from AuthorizationService', async () => {
    const mockResult = true
    mockAuthorizationService.checkPermission = async () => mockResult

    const result = await useCase.execute('user-1', Action.Read, 'Post')

    expect(result).toBe(mockResult)
  })

  it('should handle false result from AuthorizationService', async () => {
    mockAuthorizationService.checkPermission = async () => false

    const result = await useCase.execute('user-1', Action.Delete, 'Post')

    expect(result).toBe(false)
  })

  it('should propagate errors from AuthorizationService', async () => {
    const error = new Error('User not found')
    mockAuthorizationService.checkPermission = async () => {
      throw error
    }

    await expect(useCase.execute('non-existent', Action.Read, 'Post')).rejects.toThrow(
      'User not found'
    )
  })
})
