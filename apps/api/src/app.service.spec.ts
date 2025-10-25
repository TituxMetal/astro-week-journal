import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it } from 'bun:test'

import { AppService } from './app.service'

describe('AppService', () => {
  let service: AppService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService]
    }).compile()

    service = module.get<AppService>(AppService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should return "Hello from NestJS Backend API!"', () => {
    expect(service.getHello()).toBe('Hello from NestJS Backend API!')
  })
})
