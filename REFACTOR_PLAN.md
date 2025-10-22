# Astro Week Journal - Turborepo Monorepo Refactoring Plan

## Executive Summary

This document outlines the comprehensive refactoring plan to transform the current Astro fullstack
application into a pnpm Turborepo monorepo with a NestJS backend implementing Clean Code principles
and Hexagonal Architecture (Ports & Adapters pattern).

## Current Architecture Analysis

### Existing Stack

- **Frontend**: Astro 5.13.0 with React integration, Tailwind CSS
- **Authentication**: Lucia v3.2.1 with Prisma adapter, session-based auth
- **Database**: Prisma with SQLite (local replica.db), Turso integration disabled
- **Package Manager**: pnpm v10.18.0
- **Structure**: Monolithic Astro fullstack application

### Important Note on Lucia v3

**⚠️ Lucia v3 Deprecation**: Lucia v3 will be deprecated by March 2025 and is transitioning to be a
learning resource rather than a library. For this project, we'll preserve the current session-based
authentication pattern and potentially migrate to a custom implementation based on Lucia's patterns
in the future.

### Database Schema

```sql
-- Current schema preserved
User (id: String, username: String)
Session (id: String, userId: String, expiresAt: DateTime)
UserAuth (id: String, hashedPassword: String?, userId: String)
```

### Key Components Identified

- Authentication flow with Lucia middleware
- Journal functionality with timeline-based UI
- React components (AuthForm, UI components)
- Astro pages and layouts

## Target Architecture

### Target Monorepo Structure

```text
astro-week-journal/
├── apps/
│   ├── api/                    # NestJS Backend with integrated Prisma
│   │   ├── src/               # Module-based DDD source code
│   │   ├── prisma/            # Database schema and migrations
│   │   ├── tsconfig.json      # Extends typescript-config/node.json
│   │   └── package.json       # Backend dependencies
│   └── web/                   # Astro Frontend (React components stay here)
│       ├── src/               # Astro source code
│       ├── tsconfig.json      # Extends typescript-config/web.json
│       └── package.json       # Frontend dependencies
├── packages/
│   ├── typescript-config/     # TypeScript configurations
│   │   ├── base.json          # Common TypeScript settings
│   │   ├── node.json          # Node.js-specific settings (extends base)
│   │   ├── web.json           # Web-specific settings (extends base)
│   │   └── package.json       # TypeScript config package metadata
│   └── eslint-config/         # ESLint configurations
│       ├── base.js            # Common ESLint rules
│       ├── node.js            # Node.js-specific rules (extends base)
│       ├── web.js             # Web-specific rules (extends base)
│       └── package.json       # ESLint config package metadata
├── prettier.config.js         # Shared Prettier configuration
├── turbo.json                 # Turborepo configuration
├── pnpm-workspace.yaml        # pnpm workspace configuration
└── package.json               # Root package.json with workspace config
```

**Architectural Decisions Explained:**

1. **Prisma in Backend**: Keeping Prisma schema and client within `apps/api` instead of separate
   package. This reduces complexity and keeps database concerns co-located with the API that uses
   them.

2. **No Separate UI Package**: React components remain within Astro's structure since Astro already
   handles React integration well. Creating a separate UI package would add unnecessary complexity
   without clear benefits for a single frontend.

3. **Configuration-Only Packages**: Only essential configuration packages (`typescript-config`,
   `eslint-config`) are shared. All business logic, DTOs, domain types, and API contracts remain
   within their respective modules and layers, strictly following Hexagonal Architecture principles.

4. **Environment-Specific Configurations**: Separate `eslint-config` and `typescript-config`
   packages provide three-tier configuration (base + node + web). This is necessary because NestJS
   (Node.js backend) and Astro (web frontend) require completely different compiler options and
   linting rules that cannot be shared in a single configuration file.

### Technology Stack

- **Monorepo**: Turborepo with pnpm workspaces
- **Backend**: NestJS with Module-based Hexagonal Architecture
- **Frontend**: Astro with React (adapted for API consumption)
- **Database**: Prisma (integrated within backend)
- **Authentication**: Session-based auth (Lucia pattern, future-ready for migration)
- **Testing**: Jest (backend), Vitest (frontend)

## Git Flow Strategy

### Branch Naming Convention

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/{short-description}` - Feature branches (simplified, no issue numbers required)
- `hotfix/{short-description}` - Hotfix branches

### Commit Message Format

```text
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore` Scopes: `api`, `web`

### Pull Request Workflow

1. Create feature branch from `develop`
2. Implement changes with conventional commits
3. Create PR with description (self-review for documentation)
4. **No approval required** - merge when ready
5. Rebase merge to `develop`
6. Regular releases from `develop` to `main`

**Note**: Branch protection rules are simplified. You can merge your own PRs without external
approval, but PRs are still valuable for:

- Documenting changes
- Running automated tests
- Maintaining clean git history
- Self-review process

## Phase 1: Pre-Refactoring Setup

### 1.1 Create Full Backup

- [x] Create complete backup of current codebase
- [x] Export current database with all data
- [x] Document current environment variables and configuration
- [x] Create rollback procedure documentation

NOTES: current codebase was moved to `TMP/` folder, production database files are in
`TMP/prisma/data.db` and `TMP/prisma/data.db.backup`, `data.db` is the production database,
`data.db.backup` is the backup database.

### 1.2 Git Flow Setup

- [x] Create `develop` branch from `main`
- ~~[ ] Set up branch protection rules~~
- [x] Configure GitHub issue templates
- [x] Create PR templates with checklists
- ~~[ ] Set up conventional commit linting~~

NOTES: at this stage branch protection rules are not needed, conventional commit linting is not
needed. GitHub templates created for bug reports, feature requests, learning questions, and PR
checklists with appropriate backend/frontend distinctions.

### 1.3 Development Environment

- [x] Install pnpm globally
- [x] Set up Node.js version management (.nvmrc)
- [x] Configure IDE settings for monorepo
- [x] Set up development database backup strategy

NOTES: pnpm version is 10.18.0, node version is 22.21.0, added '.nvmrc` file with node version
22.21.0

## Phase 2: Monorepo Foundation

### 2.1 Turborepo Setup

- [ ] Initialize Turborepo configuration
- [ ] Create pnpm workspace structure
- [ ] Set up root package.json with workspace dependencies
- [ ] Configure Turborepo pipeline for format, build, test, lint, dev

### 2.2 Package Structure Setup

- [ ] Create `packages/typescript-config` with base, node, and web configurations
- [ ] Create `packages/eslint-config` with base, node, and web configurations
- [ ] Move Prisma schema and client to `apps/api/prisma/`
- [ ] Keep React components within `apps/web/src/components/`
- [ ] Keep all DTOs within their respective module application layers

### 2.3 Environment-Specific Configuration Setup

- [ ] Set up `packages/typescript-config/` with base, node, and web configurations
- [ ] Set up `packages/eslint-config/` with base, node, and web rule sets
- [ ] Configure shared Prettier settings at monorepo root
- [ ] Set up TypeScript project references for workspace packages
- [ ] Configure apps to extend appropriate environment-specific configs

### 2.4 Basic Build Pipeline

- [ ] Configure Turborepo caching strategy
- [ ] Set up basic GitHub Actions for testing (no complex CI/CD)
- [ ] Configure workspace-aware build scripts

## Phase 3: NestJS Backend Development

### 3.1 Module-based Hexagonal Architecture Setup

- [ ] Set up NestJS project with module-based structure
- [ ] Create `src/auth/` module with its own layers
- [ ] Create `src/user/` module with its own layers
- [ ] Create `src/journal/` module with its own layers (future expansion)
- [ ] Set up shared infrastructure (database, config)

**Module Structure Example:**

```typescript
apps/api/src/
├── auth/                       # Authentication bounded context
│   ├── domain/                # Auth domain entities, value objects
│   ├── application/           # Auth use cases, DTOs
│   ├── infrastructure/        # Auth repositories, adapters
│   └── presentation/          # Auth controllers, guards
├── user/                      # User management bounded context
│   ├── domain/                # User domain entities
│   ├── application/           # User use cases
│   ├── infrastructure/        # User repositories
│   └── presentation/          # User controllers
├── shared/                    # Shared infrastructure
│   ├── database/              # Prisma client, base repository
│   └── config/                # App configuration
└── main.ts                    # Application entry point
```

### 3.2 Authentication Module Implementation

- [ ] Implement Auth domain entities (User, Session)
- [ ] Create authentication use cases (login, signup, logout)
- [ ] Build session-based auth infrastructure (preserve Lucia patterns)
- [ ] Set up auth controllers and guards

### 3.3 User Module Implementation

- [ ] Implement User domain entity and value objects
- [ ] Create user management use cases
- [ ] Build user repository with Prisma
- [ ] Set up user controllers

### 3.4 Shared Infrastructure

- [ ] Set up Prisma client and base repository patterns
- [ ] Configure session management (Lucia-compatible)
- [ ] Set up basic logging and validation
- [ ] Create shared DTOs and interfaces

## Phase 4: Authentication Migration

### 4.1 Session-based Authentication Setup

- [ ] Preserve current Lucia session management patterns
- [ ] Implement session-based authentication guard for NestJS
- [ ] Set up session storage with Prisma (maintain current schema)
- [ ] Create authentication service following Lucia patterns

**Note**: Given Lucia v3's upcoming deprecation, we'll implement the session management using
Lucia's established patterns but in a way that's easy to migrate to a custom implementation later.

### 4.2 Authentication Endpoints

- [ ] Implement POST /auth/login endpoint
- [ ] Implement POST /auth/signup endpoint
- [ ] Implement POST /auth/logout endpoint
- [ ] Implement GET /auth/me endpoint for user info
- [ ] Preserve session refresh mechanism

### 4.3 Basic Security Implementation

- [ ] Configure CORS for frontend-backend communication
- [ ] Set up password hashing with Argon2id (preserve current approach)
- [ ] Configure secure session cookies (maintain current settings)
- [ ] Basic input validation and sanitization

## Phase 5: Database Integration

### 5.1 Prisma Integration within Backend

- [ ] Keep Prisma schema within `apps/api/prisma/`
- [ ] Configure Prisma with NestJS dependency injection
- [ ] Implement basic repository pattern with Prisma
- [ ] Set up Prisma client as singleton service

### 5.2 Simple Data Migration Strategy

- [ ] Create backup of current database
- [ ] Test migration with backup data
- [ ] Simple rollback procedure (restore from backup)
- [ ] Document migration steps

### 5.3 Repository Implementation

- [ ] Implement UserRepository with Prisma
- [ ] Create SessionRepository for authentication
- [ ] Implement basic JournalRepository (future expansion)
- [ ] Basic transaction support for auth operations

## Phase 6: Frontend Adaptation

### 6.1 API Client Setup

- [ ] Create API client with proper typing
- [ ] Implement authentication interceptors
- [ ] Set up error handling and retry logic
- [ ] Configure API base URL and environment variables

### 6.2 Authentication Flow Adaptation

- [ ] Replace Astro actions with API calls
- [ ] Implement client-side session management
- [ ] Update AuthForm component for API integration
- [ ] Modify middleware for API-based authentication

### 6.3 Component Adaptation (Keep in Astro)

- [ ] Keep React components within Astro structure
- [ ] Update components for API data consumption
- [ ] Implement basic loading states and error handling
- [ ] Preserve existing styling and UX

## Phase 7: Basic Testing & Validation

### 7.1 Backend Testing

- [ ] Unit tests for domain entities and core services
- [ ] Basic integration tests for authentication
- [ ] Simple API endpoint tests
- [ ] Database integration tests

### 7.2 Frontend Testing

- [ ] Component testing for critical React components
- [ ] Integration tests for authentication flow
- [ ] Basic E2E tests for main user journeys
- [ ] API integration tests

### 7.3 Basic Validation

- [ ] Basic functionality testing
- [ ] Cross-browser compatibility testing (major browsers only)
- [ ] Mobile responsiveness validation

## Phase 8: Documentation & Learning Wrap-up

### 8.1 Documentation Updates

- [ ] Update README with new architecture
- [ ] Create basic API documentation
- [ ] Document the refactoring process and learnings
- [ ] Create simple setup guide

### 8.2 Learning Documentation

- [ ] Document Hexagonal Architecture implementation
- [ ] Document DDD module organization learnings
- [ ] Create notes on NestJS patterns used
- [ ] Document authentication migration approach

### 8.3 Future Considerations

- [ ] Document potential Lucia migration path
- [ ] Note areas for future enhancement
- [ ] Document scaling considerations
- [ ] Create maintenance notes

## Detailed Implementation Guidelines

### Module-based Hexagonal Architecture

The architecture now follows Domain-Driven Design principles with module-based organization:

```typescript
apps/api/src/
├── auth/                       # Authentication bounded context
│   ├── domain/                # Auth domain entities, value objects
│   ├── application/           # Auth use cases, DTOs
│   ├── infrastructure/        # Auth repositories, adapters
│   └── presentation/          # Auth controllers, guards
├── user/                      # User management bounded context
│   ├── domain/                # User domain entities
│   ├── application/           # User use cases
│   ├── infrastructure/        # User repositories
│   └── presentation/          # User controllers
├── journal/                   # Journal bounded context (future)
│   ├── domain/                # Journal domain entities
│   ├── application/           # Journal use cases
│   ├── infrastructure/        # Journal repositories
│   └── presentation/          # Journal controllers
├── shared/                    # Shared infrastructure
│   ├── database/              # Prisma client, base repository
│   ├── config/                # App configuration
│   └── common/                # Shared utilities
└── main.ts                    # Application entry point
```

This approach provides better separation of concerns and makes the codebase more maintainable.

### Authentication Flow Design

1. **Session-based Authentication**: Preserve Lucia's session management patterns
2. **Cookie Management**: Secure HTTP-only cookies for sessions (maintain current approach)
3. **CORS Configuration**: Basic cross-origin setup for frontend-backend communication
4. **Future-ready**: Easy migration path when moving away from Lucia

### Database Migration Strategy

1. **Schema Preservation**: Keep existing User, Session, UserAuth tables exactly as they are
2. **Simple Data Migration**: Copy existing database to new location
3. **Basic Rollback**: Restore from backup if needed
4. **Testing**: Test with backup data before going live

## Risk Mitigation

### Main Risk Areas

1. **Authentication Migration**: Session management changes
2. **Database Migration**: Risk of data loss during transition
3. **Frontend-Backend Integration**: API contract mismatches
4. **Learning Curve**: Understanding new architectural patterns

### Simple Mitigation Strategies

1. Work in small increments with frequent testing
2. Always work with backup data
3. Keep detailed notes of changes made
4. Test each phase thoroughly before moving to next

## Success Criteria

- [ ] All existing functionality preserved
- [ ] Authentication flow works seamlessly
- [ ] Code demonstrates Clean Code and Hexagonal Architecture principles
- [ ] Module-based DDD structure is properly implemented
- [ ] Basic test coverage for critical paths
- [ ] Documentation captures learning outcomes
- [ ] Understanding of monorepo structure and benefits

## Timeline Estimate

- **Phase 1**: 1-2 days
- **Phase 2**: 2-3 days
- **Phase 3**: 5-7 days
- **Phase 4**: 3-4 days
- **Phase 5**: 2-3 days
- **Phase 6**: 3-4 days
- **Phase 7**: 3-4 days
- **Phase 8**: 1-2 days

**Total Estimated Duration**: 20-29 days

## GitHub Issues and PR Strategy

### Issue Creation

- Create GitHub issues for major phases (optional for learning)
- Use simple issue descriptions with acceptance criteria
- Assign basic labels (enhancement, refactor, learning)
- Link related issues if helpful

### Pull Request Strategy

- One PR per sub-task or logical unit of work
- **No external review required**
- Basic automated tests (if set up)
- Include PR description with:
  - What was changed and why
  - Key learnings from the implementation
  - Any challenges encountered

### Branch Protection

- No approval requirements
- Optional: Require basic tests to pass
- Keep clean git history through rebase merging
- Use PRs primarily for documentation and self-review

## Next Steps

1. Review and approve this refactoring plan
2. Create GitHub issues for each major task
3. Set up development environment according to Phase 1
4. Begin implementation starting with Phase 1

---

**Document Version**: 2.0 **Last Updated**: 2025-10-21 **Status**: Planning Phase
