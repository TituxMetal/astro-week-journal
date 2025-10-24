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

    // Initialize PrismaClient with adapter
    super({
      adapter,
      log: ['query', 'info', 'warn', 'error']
    })
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
