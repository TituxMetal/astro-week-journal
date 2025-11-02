import { Module } from '@nestjs/common'

import { AuthorizationModule } from '~/authorization/authorization.module'

import { PostsController } from './presentation/controllers/posts.controller'

@Module({
  imports: [AuthorizationModule],
  controllers: [PostsController]
})
export class PostsModule {}
