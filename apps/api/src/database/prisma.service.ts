import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Create Prisma adapter for local SQLite database
    const adapter = new PrismaLibSQL({
      url: 'file:./prisma/replica.db'
    })

    // Determine log levels based on environment
    const logLevels: Array<'query' | 'info' | 'warn' | 'error'> =
      process.env.NODE_ENV === 'production' ? ['warn', 'error'] : ['query', 'info', 'warn', 'error']

    // Initialize PrismaClient with adapter
    super({
      adapter,
      log: logLevels
    })
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
