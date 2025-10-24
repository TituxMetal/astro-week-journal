import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'

import { AppModule } from './app.module'

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false // Required for Better Auth
  })
  const logger = new Logger('Bootstrap')

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4321',
    credentials: true
  })

  // Enable cookie parser
  app.use(cookieParser())

  // Enable validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )

  const port = process.env.PORT || 3000
  await app.listen(port)
  logger.log(`🚀 Backend API running on http://localhost:${port}`)
}

bootstrap()
