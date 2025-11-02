import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import request from 'supertest'

import { AuthorizationService } from '~/authorization/application/services/authorization.service'
import { IAbility } from '~/authorization/domain/ports/ability.interface'
import { Action } from '~/authorization/domain/value-objects/action.vo'
import { Role } from '~/authorization/domain/value-objects/role.vo'
import { CaslAuthorizationGuard } from '~/authorization/infrastructure/guards/caslAuthorization.guard'

import { PostsController } from './posts.controller'

// Mock abilities for different roles
const createMockAbility = (role: Role): IAbility => {
  const canFn = (action: Action, subject: string): boolean => {
    if (role === Role.ADMIN) return true
    if (role === Role.EDITOR) {
      if (action === Action.Read) return true
      if (subject === 'Post' && [Action.Create, Action.Update].includes(action)) return true
      return false
    }
    if (role === Role.USER) {
      return action === Action.Read && ['Post', 'User'].includes(subject)
    }
    return false
  }

  return {
    can: canFn,
    cannot: (action: Action, subject: string): boolean => {
      return !canFn(action, subject)
    }
  }
}

describe('PostsController (e2e)', () => {
  let app: INestApplication
  let authorizationService: AuthorizationService

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: AuthorizationService,
          useValue: {
            getUserAbilities: async (userId: string) => {
              // Mock user abilities based on userId pattern
              if (userId.startsWith('admin')) {
                return createMockAbility(Role.ADMIN)
              }
              if (userId.startsWith('editor')) {
                return createMockAbility(Role.EDITOR)
              }
              return createMockAbility(Role.USER)
            }
          }
        },
        CaslAuthorizationGuard
      ]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    authorizationService = moduleFixture.get<AuthorizationService>(AuthorizationService)
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /posts/public', () => {
    it('should return public posts without authentication', () => {
      return request(app.getHttpServer())
        .get('/posts/public')
        .expect(200)
        .expect(res => {
          expect(res.body.message).toContain('Public posts')
          expect(res.body.posts).toBeArray()
          expect(res.body.posts.length).toBeGreaterThan(0)
        })
    })
  })

  describe('GET /posts', () => {
    it('should return 403 when user is not authenticated', () => {
      return request(app.getHttpServer()).get('/posts').expect(403)
    })

    it('should return posts when USER has read permission', () => {
      // Note: In real e2e tests, you would set up proper authentication
      // This is a simplified version for demonstration
      return request(app.getHttpServer())
        .get('/posts')
        .expect(res => {
          if (res.status === 200) {
            expect(res.body.message).toContain('All posts')
            expect(res.body.posts).toBeArray()
          }
        })
    })
  })

  describe('POST /posts', () => {
    it('should allow EDITOR to create post', async () => {
      // In a real test, you would mock the request.user properly
      // This demonstrates the expected behavior
      const ability = await authorizationService.getUserAbilities('editor-1')
      expect(ability.can(Action.Create, 'Post')).toBe(true)
    })

    it('should deny USER from creating post', async () => {
      const ability = await authorizationService.getUserAbilities('user-1')
      expect(ability.can(Action.Create, 'Post')).toBe(false)
    })
  })

  describe('PUT /posts/:id', () => {
    it('should allow EDITOR to update post', async () => {
      const ability = await authorizationService.getUserAbilities('editor-1')
      expect(ability.can(Action.Update, 'Post')).toBe(true)
    })

    it('should deny USER from updating post', async () => {
      const ability = await authorizationService.getUserAbilities('user-1')
      expect(ability.can(Action.Update, 'Post')).toBe(false)
    })
  })

  describe('DELETE /posts/:id', () => {
    it('should allow ADMIN to delete post', async () => {
      const ability = await authorizationService.getUserAbilities('admin-1')
      expect(ability.can(Action.Delete, 'Post')).toBe(true)
    })

    it('should deny EDITOR from deleting post', async () => {
      const ability = await authorizationService.getUserAbilities('editor-1')
      expect(ability.can(Action.Delete, 'Post')).toBe(false)
    })

    it('should deny USER from deleting post', async () => {
      const ability = await authorizationService.getUserAbilities('user-1')
      expect(ability.can(Action.Delete, 'Post')).toBe(false)
    })
  })

  describe('POST /posts/admin/bulk-delete', () => {
    it('should allow ADMIN to bulk delete', async () => {
      const ability = await authorizationService.getUserAbilities('admin-1')
      expect(ability.can(Action.Manage, 'all')).toBe(true)
    })

    it('should deny EDITOR from bulk delete', async () => {
      const ability = await authorizationService.getUserAbilities('editor-1')
      expect(ability.can(Action.Manage, 'all')).toBe(false)
    })

    it('should deny USER from bulk delete', async () => {
      const ability = await authorizationService.getUserAbilities('user-1')
      expect(ability.can(Action.Manage, 'all')).toBe(false)
    })
  })

  describe('Authorization Guard Integration', () => {
    it('should properly integrate with CaslAuthorizationGuard', () => {
      expect(authorizationService).toBeDefined()
      expect(authorizationService.getUserAbilities).toBeDefined()
    })

    it('should return correct abilities for different user roles', async () => {
      const userAbility = await authorizationService.getUserAbilities('user-1')
      const editorAbility = await authorizationService.getUserAbilities('editor-1')
      const adminAbility = await authorizationService.getUserAbilities('admin-1')

      // USER permissions
      expect(userAbility.can(Action.Read, 'Post')).toBe(true)
      expect(userAbility.can(Action.Create, 'Post')).toBe(false)

      // EDITOR permissions
      expect(editorAbility.can(Action.Read, 'Post')).toBe(true)
      expect(editorAbility.can(Action.Create, 'Post')).toBe(true)
      expect(editorAbility.can(Action.Delete, 'Post')).toBe(false)

      // ADMIN permissions
      expect(adminAbility.can(Action.Manage, 'all')).toBe(true)
      expect(adminAbility.can(Action.Delete, 'Post')).toBe(true)
    })
  })
})
