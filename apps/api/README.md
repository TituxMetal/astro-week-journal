# 🚀 Astro Week Journal - NestJS Backend API

The backend API for Astro Week Journal built with **NestJS 11**, **Prisma 6**, and **Better Auth**.

This backend provides a REST API that the frontend communicates with exclusively. It handles
authentication, database operations, and business logic with a modular NestJS structure.

> **Note**: This is part of a monorepo. For monorepo-level information and setup, see
> [../../README.md](../../README.md).

---

## 📋 Overview

This backend application provides:

- ✅ REST API with NestJS framework
- ✅ Modular architecture with NestJS modules
- ✅ Database management with Prisma ORM
- ✅ Authentication with Better Auth (email/password)
- ✅ Session management with secure cookies
- ✅ Type-safe TypeScript implementation
- ✅ Request validation and error handling
- ✅ Environment-based configuration

---

## 🛠️ Tech Stack

- **NestJS** 11.1.7 - Progressive Node.js framework
- **Prisma** 6.18.0 - ORM with SQLite adapter
- **Better Auth** 1.3.29 - Authentication library
- **SQLite** with libSQL adapter - Lightweight database
- **TypeScript** 5.9.3 - Type-safe backend code
- **ESLint** 9.38.0 - Code quality with flat config format
- **Bun** 1.3.1 - JavaScript runtime and test runner
- **Prettier** 3.4.0 - Code formatter

---

## 📁 Project Structure

```text
apps/api/
├── src/
│   ├── app.controller.ts        # Root controller (GET /, GET /health)
│   ├── app.module.ts            # Root module with imports
│   ├── app.service.ts           # Root service
│   ├── main.ts                  # Bootstrap file with middleware setup
│   ├── auth/                    # Authentication module (Better Auth)
│   │   ├── auth.module.ts       # Auth module configuration
│   │   └── infrastructure/
│   │       └── config/
│   │           └── betterAuth.config.ts  # Better Auth configuration
│   └── database/                # Database module
│       ├── database.module.ts   # Database module (global)
│       └── prisma.service.ts    # Prisma service with libSQL adapter
├── prisma/
│   ├── schema.prisma            # Database schema (User, Session, Account, Verification)
│   ├── migrations/              # Database migrations
│   └── seed.ts                  # Database seeding script
├── nest-cli.json                # NestJS CLI configuration
├── tsconfig.json                # TypeScript configuration
├── eslint.config.mjs            # ESLint configuration
└── package.json                 # Dependencies and scripts
```

---

## 📋 Prerequisites

- **Bun**: v1.3.1 or higher

Check your version:

```bash
bun --version
```

---

## 🚀 Installation

### 1. Install dependencies

From the **root directory** of the monorepo:

```bash
bun install
```

### 2. Set up environment variables

Create `apps/api/.env.local`:

```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:4321
BETTER_AUTH_URL=http://localhost:3000
```

**Environment Variables Explained:**

- `NODE_ENV` - Set to `development` for local development
- `PORT` - Backend API port (default: 3000)
- `FRONTEND_URL` - URL where the frontend is running (for CORS)
- `BETTER_AUTH_URL` - URL for Better Auth callbacks (same as backend URL)

### 3. Generate Prisma Client

```bash
bun --filter @repo/api prisma generate
```

### 4. Run database migrations

```bash
bun --filter @repo/api prisma migrate dev
```

### 5. (Optional) Seed the database

```bash
bun --filter @repo/api prisma db seed
```

---

## 💻 Development

### Run the backend in development mode

From the **root directory**:

```bash
bun dev
```

Or run only the backend from the root directory:

```bash
bun --filter @repo/api dev
```

The backend API will be available at [http://localhost:3000](http://localhost:3000)

---

## 📦 Available Scripts

For monorepo-level commands (dev, build, lint, format, typecheck, clean), see
[../../README.md](../../README.md#-available-scripts).

Run backend-specific commands from the **root directory** using `--filter`:

```bash
bun --filter @repo/api dev           # Start dev server with hot reload
bun --filter @repo/api build         # Build for production
bun --filter @repo/api start:debug   # Start with debugger
bun --filter @repo/api test          # Run tests with Bun test runner
bun --filter @repo/api test:watch    # Run tests in watch mode
bun --filter @repo/api test:cov      # Run tests with coverage
```

### Database Commands (Prisma)

Run from the **monorepo root**:

```bash
bun --filter @repo/api prisma migrate dev      # Create and run migrations
bun --filter @repo/api prisma migrate reset    # Reset database to initial state
bun --filter @repo/api prisma db seed          # Seed database with initial data
bun --filter @repo/api prisma studio           # Open Prisma Studio (visual DB browser)
bun --filter @repo/api prisma generate         # Generate Prisma Client types
```

---

## 🏗️ Architecture: NestJS Modular Structure

This backend uses a **modular NestJS architecture** with clear separation of concerns:

### **Core Modules**

**DatabaseModule** - Global module providing Prisma service:

- Exports `PrismaService` for use across the application
- Handles database connection with libSQL adapter
- Manages connection lifecycle (onModuleInit, onModuleDestroy)

**AuthModule** - Authentication module using Better Auth:

- Imports DatabaseModule for Prisma access
- Configures Better Auth with email/password authentication
- Provides auth endpoints via `@thallesp/nestjs-better-auth`
- Handles session management with secure cookies

**AppModule** - Root module:

- Imports ConfigModule for environment variables
- Imports DatabaseModule and AuthModule
- Provides AppController and AppService

### **Middleware & Configuration**

**main.ts** - Bootstrap file with:

- CORS configuration for frontend communication
- Cookie parser middleware for session handling
- Global validation pipes for request validation
- Environment-based configuration

### **Future Enhancement: Hexagonal Architecture**

This structure can be extended with Hexagonal Architecture patterns:

- **Domain Layer** - Business logic and entities
- **Application Layer** - Use cases and services
- **Infrastructure Layer** - Database, auth, external services
- **Presentation Layer** - Controllers and DTOs

Currently, the focus is on a clean, modular NestJS structure that can evolve as the application
grows.

---

## 🗄️ Database

### Prisma ORM

Uses **Prisma** with **SQLite** adapter (libSQL) for:

- Type-safe database access
- Automatic migrations
- Schema management
- Seed scripts

### Database Schema

**User Model**

```typescript
model User {
  id            String    @id
  name          String
  email         String    @unique
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]
}
```

**Session Model** - Manages user sessions with secure tokens

**Account Model** - Stores authentication provider information

**Verification Model** - Handles email verification tokens

---

## 🔐 Authentication

### Better Auth Integration

Uses **Better Auth** library with `@thallesp/nestjs-better-auth` module for:

- Email/password authentication
- Session management with secure cookies
- User registration and login
- Session validation and retrieval

The Better Auth library automatically provides REST endpoints for authentication operations.

### Auth Endpoints (Provided by Better Auth)

**POST** `/api/auth/sign-up/email`

Register a new user:

```bash
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "User Name"
  }'
```

**POST** `/api/auth/sign-in/email`

Sign in existing user:

```bash
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**GET** `/api/auth/get-session`

Get current session:

```bash
curl http://localhost:3000/api/auth/get-session \
  -H "Cookie: better-auth.session_token=..."
```

**POST** `/api/auth/sign-out`

Sign out user:

```bash
curl -X POST http://localhost:3000/api/auth/sign-out \
  -H "Cookie: better-auth.session_token=..."
```

---

## 🧪 Testing

This backend uses **Bun's native test runner** for all tests.

Run tests from the **root directory**:

```bash
# Run all tests
bun --filter @repo/api test

# Run tests in watch mode
bun --filter @repo/api test:watch

# Run tests with coverage
bun --filter @repo/api test:cov
```

### Test Structure

- **Unit Tests**: Service layer tests (e.g., `app.service.spec.ts`)
- **E2E Tests**: Controller endpoint tests (e.g., `app.controller.spec.ts`)
- **Test Runner**: Bun test runner with Jest-compatible API

All tests use `import { describe, it, expect } from 'bun:test'` for test definitions.

---

## 📚 Learning Resources

This backend demonstrates:

- **NestJS Framework** - Building modular Node.js applications
- **Modular Architecture** - Organizing code with NestJS modules
- **Prisma ORM** - Type-safe database access with migrations
- **Better Auth** - Modern authentication library integration
- **TypeScript** - Type-safe backend code
- **Dependency Injection** - NestJS DI system
- **Environment Configuration** - Managing different environments
- **Middleware & Validation** - Request handling and validation
- **Database Adapters** - Using Prisma with libSQL/SQLite

---

## 🔗 Related Documentation

- **Root README**: See [../../README.md](../../README.md) for monorepo overview
- **Frontend README**: See [../web/README.md](../web/README.md) for frontend documentation
- **NestJS Docs**: [https://docs.nestjs.com](https://docs.nestjs.com)
- **Prisma Docs**: [https://www.prisma.io/docs](https://www.prisma.io/docs)
- **Better Auth Docs**: [https://www.better-auth.com](https://www.better-auth.com)
- **TypeScript Docs**: [https://www.typescriptlang.org](https://www.typescriptlang.org)

---

**Happy coding! 🚀**
