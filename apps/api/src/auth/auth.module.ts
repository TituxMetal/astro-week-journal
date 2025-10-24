import { Module } from '@nestjs/common'
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth'

import { DatabaseModule } from '~/database/database.module'
import { PrismaService } from '~/database/prisma.service'

import { createBetterAuthConfig } from './infrastructure/config/betterAuth.config'

@Module({
  imports: [
    DatabaseModule,
    BetterAuthModule.forRootAsync({
      imports: [DatabaseModule],
      inject: [PrismaService],
      useFactory: (prismaService: PrismaService) => ({
        auth: createBetterAuthConfig(prismaService)
      })
    })
  ]
})
export class AuthModule {}
