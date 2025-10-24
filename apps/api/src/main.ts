import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4321',
    credentials: true
  })

  const port = process.env.PORT || 3000
  await app.listen(port)
  console.log(`🚀 Backend API running on http://localhost:${port}`)
}

bootstrap()
