# 📔 Astro Week Journal - Monorepo

A modern, scalable monorepo architecture for the Astro Week Journal application featuring a **NestJS
backend** with **Hexagonal Architecture** and an **Astro frontend** with React.

---

## 🎯 Project Overview

**Astro Week Journal** is a fullstack web application built with a monorepo structure using **pnpm
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

- **pnpm** 10.18.0 - Fast, disk space efficient package manager
- **Turborepo** 2.3.0 - High-performance build system
- **ESLint** 9.38.0 - Code quality with flat config format
- **Prettier** 3.4.0 - Code formatter
- **Node.js** 22.21.0 - JavaScript runtime

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
├── pnpm-workspace.yaml        # pnpm workspaces configuration
├── turbo.json                 # Turborepo configuration
└── package.json               # Root package.json with scripts
```

### App-Specific Documentation

- **Frontend**: See [apps/web/README.md](apps/web/README.md) for Astro frontend documentation
- **Backend**: See [apps/api/README.md](apps/api/README.md) for NestJS backend documentation

---

## 📋 Prerequisites

- **Node.js**: v22.21.0 or higher
- **pnpm**: v10.18.0 or higher

Check your versions:

```bash
node --version
pnpm --version
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
pnpm install
```

### 3. Set up environment variables

Each app has its own environment variables. See the app-specific READMEs for details:

- **Backend**: See [apps/api/README.md](apps/api/README.md#set-up-environment-variables)
- **Frontend**: See [apps/web/README.md](apps/web/README.md#environment-variables)

### 4. Generate Prisma Client

```bash
pnpm --filter api exec prisma generate
```

### 5. Run database migrations

```bash
pnpm --filter api exec prisma migrate dev
```

### 6. (Optional) Seed the database

```bash
pnpm --filter api exec prisma db seed
```

---

## 💻 Development

### Run both apps in development mode

```bash
pnpm dev
```

This starts:

- **Frontend**: [http://localhost:4321](http://localhost:4321) (Astro dev server)
- **Backend**: [http://localhost:3000](http://localhost:3000) (NestJS dev server)

### Run individual apps

```bash
# Frontend only
pnpm --filter web dev

# Backend only
pnpm --filter api dev
```

---

## 📦 Available Scripts

All commands run from the **root directory**:

### All Apps (Monorepo-Level)

```bash
# Development
pnpm dev                  # Start all apps in dev mode

# Building
pnpm build               # Build all apps for production

# Code Quality
pnpm lint                # Lint and fix all code
pnpm lint:check          # Check linting without fixing
pnpm typecheck           # Type check all apps
pnpm format              # Format all files with Prettier
pnpm format:check        # Check formatting without fixing

# Cleanup
pnpm clean               # Remove all build artifacts and node_modules
```

### Specific Apps (Using --filter)

```bash
# Frontend (web app)
pnpm --filter web dev           # Start frontend dev server
pnpm --filter web build         # Build frontend for production
pnpm --filter web lint          # Lint frontend code
pnpm --filter web typecheck     # Type check frontend
pnpm --filter web preview       # Preview production build

# Backend (api app)
pnpm --filter api dev           # Start backend dev server
pnpm --filter api build         # Build backend for production
pnpm --filter api lint          # Lint backend code
pnpm --filter api typecheck     # Type check backend
pnpm --filter api start:debug   # Start backend with debugger
pnpm --filter api test          # Run backend tests
pnpm --filter api test:watch    # Run backend tests in watch mode
pnpm --filter api test:cov      # Run backend tests with coverage
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

- **Monorepo Management** - Using pnpm workspaces and Turborepo
- **Hexagonal Architecture** - Building maintainable backend systems
- **TypeScript Best Practices** - Strict type safety across the stack
- **Modern Frontend** - Astro with React and Tailwind CSS v4
- **Authentication** - Implementing secure auth with Better Auth
- **CI/CD** - Automated testing and deployment with GitHub Actions

---

## 🤝 Contributing

This is a solo learning project. For improvements or bug fixes:

1. Create a feature branch from `develop`
2. Make your changes
3. Ensure all checks pass: `pnpm format && pnpm lint && pnpm typecheck && pnpm build`
4. Create a pull request with a clear description

---

## 📝 License

This project is private and for learning purposes.

---

**Happy coding! 🚀**
