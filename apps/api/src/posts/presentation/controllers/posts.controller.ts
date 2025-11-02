import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards
} from '@nestjs/common'
import { AllowAnonymous, Session, UserSession } from '@thallesp/nestjs-better-auth'

import { Action } from '~/authorization/domain/value-objects/action.vo'
import { CaslAuthorizationGuard } from '~/authorization/infrastructure/guards/caslAuthorization.guard'
import { CheckPolicies } from '~/authorization/presentation/decorators/checkPolicies.decorator'

/**
 * Posts Controller - Demonstrates authorization with different permission levels
 *
 * This controller showcases how to protect endpoints using CASL authorization:
 * - Public endpoints (no guard)
 * - Protected endpoints with role-based permissions
 * - USER role: can read posts
 * - EDITOR role: can read, create, and update posts
 * - ADMIN role: can manage all posts (including delete)
 */
@Controller('posts')
export class PostsController {
  /**
   * Public endpoint - No authentication or authorization required
   * Anyone can access this endpoint
   */
  @Get('public')
  @AllowAnonymous() // Allow anonymous access - bypasses Better Auth global guard
  @HttpCode(HttpStatus.OK)
  getPublicPosts() {
    return {
      message: 'Public posts - accessible to everyone',
      posts: [
        { id: '1', title: 'Public Post 1', published: true },
        { id: '2', title: 'Public Post 2', published: true }
      ]
    }
  }

  /**
   * Protected endpoint - Requires authentication and 'read' permission on 'Post'
   * Accessible by: USER, EDITOR, ADMIN
   */
  @Get()
  @UseGuards(CaslAuthorizationGuard)
  @CheckPolicies(ability => ability.can(Action.Read, 'Post'))
  @HttpCode(HttpStatus.OK)
  getAllPosts(@Session() session: UserSession) {
    return {
      message: 'All posts - accessible to authenticated users with read permission',
      user: {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role
      },
      posts: [
        { id: '1', title: 'Post 1', published: true },
        { id: '2', title: 'Post 2', published: false },
        { id: '3', title: 'Post 3', published: true }
      ]
    }
  }

  /**
   * Protected endpoint - Requires 'read' permission on 'Post'
   * Accessible by: USER, EDITOR, ADMIN
   */
  @Get(':id')
  @UseGuards(CaslAuthorizationGuard)
  @CheckPolicies(ability => ability.can(Action.Read, 'Post'))
  @HttpCode(HttpStatus.OK)
  getPostById(@Param('id') id: string, @Session() session: UserSession) {
    return {
      message: `Post ${id} - accessible to users with read permission`,
      user: {
        id: session.user.id,
        role: session.user.role
      },
      post: { id, title: `Post ${id}`, content: 'Post content...', published: true }
    }
  }

  /**
   * Protected endpoint - Requires 'create' permission on 'Post'
   * Accessible by: EDITOR, ADMIN
   */
  @Post()
  @UseGuards(CaslAuthorizationGuard)
  @CheckPolicies(ability => ability.can(Action.Create, 'Post'))
  @HttpCode(HttpStatus.CREATED)
  createPost(@Body() body: { title: string; content: string }, @Session() session: UserSession) {
    return {
      message: 'Post created - accessible to users with create permission',
      user: {
        id: session.user.id,
        role: session.user.role
      },
      post: {
        id: 'new-post-id',
        title: body.title,
        content: body.content,
        authorId: session.user.id,
        published: false
      }
    }
  }

  /**
   * Protected endpoint - Requires 'update' permission on 'Post'
   * Accessible by: EDITOR, ADMIN
   */
  @Put(':id')
  @UseGuards(CaslAuthorizationGuard)
  @CheckPolicies(ability => ability.can(Action.Update, 'Post'))
  @HttpCode(HttpStatus.OK)
  updatePost(
    @Param('id') id: string,
    @Body() body: { title?: string; content?: string },
    @Session() session: UserSession
  ) {
    return {
      message: `Post ${id} updated - accessible to users with update permission`,
      user: {
        id: session.user.id,
        role: session.user.role
      },
      post: {
        id,
        title: body.title || `Updated Post ${id}`,
        content: body.content || 'Updated content...',
        updatedBy: session.user.id
      }
    }
  }

  /**
   * Protected endpoint - Requires 'delete' permission on 'Post'
   * Accessible by: ADMIN only
   */
  @Delete(':id')
  @UseGuards(CaslAuthorizationGuard)
  @CheckPolicies(ability => ability.can(Action.Delete, 'Post'))
  @HttpCode(HttpStatus.OK)
  deletePost(@Param('id') id: string, @Session() session: UserSession) {
    return {
      message: `Post ${id} deleted - accessible to users with delete permission (ADMIN only)`,
      user: {
        id: session.user.id,
        role: session.user.role
      },
      deletedPostId: id
    }
  }

  /**
   * Protected endpoint - Requires 'manage' permission on 'all' resources
   * Accessible by: ADMIN only
   */
  @Post('admin/bulk-delete')
  @UseGuards(CaslAuthorizationGuard)
  @CheckPolicies(ability => ability.can(Action.Manage, 'all'))
  @HttpCode(HttpStatus.OK)
  bulkDeletePosts(@Body() body: { postIds: string[] }, @Session() session: UserSession) {
    return {
      message: 'Bulk delete - accessible to ADMIN only (manage all)',
      user: {
        id: session.user.id,
        role: session.user.role
      },
      deletedCount: body.postIds.length,
      deletedPostIds: body.postIds
    }
  }
}
