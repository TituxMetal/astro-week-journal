# 📔 Astro Week Journal - Monorepo

A modern, scalable monorepo architecture for the Astro Week Journal application featuring a **NestJS
backend** with **Hexagonal Architecture** and an **Astro frontend** with React.

---

## 🎯 Project Overview

**Astro Week Journal** is a fullstack web application built with a monorepo structure using **Bun
workspaces** and **Turborepo**. The project demonstrates best practices for:

- **Hexagonal Architecture** (Ports & Adapters pattern) in the backend
- **Strict frontend-backend separation** (frontend has NO database dependencies)
- **Shared TypeScript and ESLint configurations** across apps
- **Automated CI/CD** with GitHub Actions
- **Modern tooling** with TypeScript, Tailwind CSS v4, and Better Auth

---

## 🛠️ Tech Stack

### Frontend

- **Astro** 5.15.1 - Static site generator with server-side rendering
- **React** 19.2.0 - UI library for interactive components
- **Tailwind CSS** v4.1.15 - Utility-first CSS framework
- **TypeScript** 5.9.3 - Type-safe JavaScript

### Backend

- **NestJS** 11.1.7 - Progressive Node.js framework
- **Prisma** 6.18.0 - ORM with SQLite adapter
- **Better Auth** - Authentication library with email/password support
- **TypeScript** 5.9.3 - Type-safe backend code

### Monorepo & DevTools

- **Bun** 1.3.1 - Fast all-in-one JavaScript runtime and package manager
- **Turborepo** 2.3.0 - High-performance build system
- **ESLint** 9.38.0 - Code quality with flat config format
- **Prettier** 3.4.0 - Code formatter

---

## 📁 Project Structure

```text
astro-week-journal/
├── apps/
│   ├── api/                    # NestJS backend (Hexagonal Architecture)
│   │   ├── src/
│   │   │   ├── auth/          # Authentication module
│   │   │   ├── database/      # Database layer (Prisma)
│   │   │   └── main.ts        # Bootstrap file
│   │   └── prisma/            # Database schema & migrations
│   └── web/                    # Astro frontend (NO database deps)
│       ├── src/
│       │   ├── components/    # React components
│       │   ├── pages/         # Astro pages
│       │   ├── layouts/       # Astro layouts
│       │   └── lib/api/       # API client for backend communication
│       └── astro.config.mjs   # Astro configuration
├── packages/
│   ├── eslint-config/         # Shared ESLint configurations
│   └── typescript-config/     # Shared TypeScript configurations
├── bun.lockb                  # Bun lockfile
├── turbo.json                 # Turborepo configuration
└── package.json               # Root package.json with scripts
```

### App-Specific Documentation

- **Frontend**: See [apps/web/README.md](apps/web/README.md) for Astro frontend documentation
- **Backend**: See [apps/api/README.md](apps/api/README.md) for NestJS backend documentation

---

## 📋 Prerequisites

- **Bun**: v1.3.1 or higher

Check your version:

```bash
bun --version
```

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone git@github.com:TituxMetal/astro-week-journal.git
cd astro-week-journal
```

### 2. Install dependencies

```bash
bun install
```

### 3. Set up environment variables

Each app has its own environment variables. See the app-specific READMEs for details:

- **Backend**: See [apps/api/README.md](apps/api/README.md#set-up-environment-variables)
- **Frontend**: See [apps/web/README.md](apps/web/README.md#environment-variables)

### 4. Generate Prisma Client

```bash
bun --filter @repo/api prisma generate
```

### 5. Run database migrations

```bash
bun --filter @repo/api prisma migrate dev
```

### 6. (Optional) Seed the database

```bash
bun --filter @repo/api prisma db seed
```

---

## 💻 Development

### Run both apps in development mode

```bash
bun dev
```

This starts:

- **Frontend**: [http://localhost:4321](http://localhost:4321) (Astro dev server)
- **Backend**: [http://localhost:3000](http://localhost:3000) (NestJS dev server)

### Run individual apps

```bash
# Frontend only
bun --filter @repo/web dev

# Backend only
bun --filter @repo/api dev
```

---

## 📦 Available Scripts

All commands run from the **root directory**:

### All Apps (Monorepo-Level)

```bash
# Development
bun dev                  # Start all apps in dev mode

# Building
bun build                # Build all apps for production

# Testing
bun test                 # Run all tests
bun test:watch           # Run tests in watch mode
bun test:cov             # Run tests with coverage

# Code Quality
bun lint                 # Lint and fix all code
bun lint:check           # Check linting without fixing
bun typecheck            # Type check all apps
bun format               # Format all files with Prettier
bun format:check         # Check formatting without fixing

# Cleanup
bun clean                # Remove all build artifacts and node_modules
```

### Specific Apps (Using --filter)

```bash
# Frontend (web app)
bun --filter @repo/web dev           # Start frontend dev server
bun --filter @repo/web build         # Build frontend for production
bun --filter @repo/web lint          # Lint frontend code
bun --filter @repo/web typecheck     # Type check frontend
bun --filter @repo/web preview       # Preview production build
bun --filter @repo/web test          # Run frontend tests

# Backend (api app)
bun --filter @repo/api dev           # Start backend dev server
bun --filter @repo/api build         # Build backend for production
bun --filter @repo/api lint          # Lint backend code
bun --filter @repo/api typecheck     # Type check backend
bun --filter @repo/api start:debug   # Start backend with debugger
bun --filter @repo/api test          # Run backend tests
bun --filter @repo/api test:watch    # Run backend tests in watch mode
bun --filter @repo/api test:cov      # Run backend tests with coverage
```

---

## 🌳 Git Flow

This project follows **Git Flow** branching strategy:

- **`main`** - Production branch (stable releases)
- **`develop`** - Development branch (integration branch for features)
- **`feature/*`** - Feature branches (created from `develop`)

### Creating a new feature

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
# Make changes...
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
# Create PR: feature/your-feature-name → develop
```

### Merging to production

1. Merge feature PR to `develop`
2. Create PR: `develop` → `main`
3. Merge to `main` for production release

---

## 🔄 CI/CD Pipeline

**GitHub Actions** automatically runs on every push and pull request:

- ✅ **Format Check** - Prettier formatting validation
- ✅ **Linting** - ESLint code quality checks
- ✅ **Type Checking** - TypeScript compilation
- ✅ **Build** - Build both apps for production
- ✅ **Test Execution** - Run all tests (12 tests: 6 backend + 6 frontend)
- ✅ **Prisma Generate** - Generate Prisma Client types

All checks must pass before merging to `main`.

---

## 🏗️ Architecture

### Backend: NestJS Modular Structure

The NestJS backend uses a **modular architecture** with clear separation of concerns:

- **DatabaseModule** - Global module providing Prisma service
- **AuthModule** - Authentication module using Better Auth
- **AppModule** - Root module with imports and configuration

For detailed backend architecture, see [apps/api/README.md](apps/api/README.md).

### Frontend: API-First Design

The Astro frontend communicates with the backend **exclusively via REST API**:

- ✅ **NO database dependencies** in frontend (no Prisma, no direct DB access)
- ✅ All data flows through the backend API
- ✅ Frontend is a pure presentation layer
- ✅ Easy to replace or scale independently

For detailed frontend architecture, see [apps/web/README.md](apps/web/README.md).

---

## 📚 Learning Resources

This project is designed as a **learning resource** for solo developers. Key concepts:

- **Monorepo Management** - Using Bun workspaces and Turborepo
- **Hexagonal Architecture** - Building maintainable backend systems
- **TypeScript Best Practices** - Strict type safety across the stack
- **Modern Frontend** - Astro with React and Tailwind CSS v4
- **Authentication** - Implementing secure auth with Better Auth
- **Bun Runtime** - Using Bun for package management, testing, and runtime
- **CI/CD** - Automated testing and deployment with GitHub Actions

---

## 🤝 Contributing

This is a solo learning project. For improvements or bug fixes:

1. Create a feature branch from `develop`
2. Make your changes
3. Ensure all checks pass: `bun format && bun lint && bun typecheck && bun build && bun test`
4. Create a pull request with a clear description

---

## 📝 License

This project is private and for learning purposes.

---

**Happy coding! 🚀**
