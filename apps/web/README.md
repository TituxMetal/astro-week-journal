# 🌐 Astro Week Journal - Web Frontend

The frontend application for Astro Week Journal built with **Astro 5**, **React 19**, and **Tailwind
CSS v4**.

This is a **presentation-only layer** that communicates with the backend exclusively via REST API.
It has **NO database dependencies** (no Prisma, no direct database access).

> **Note**: This is part of a monorepo. For monorepo-level information and setup, see
> [../../README.md](../../README.md).

---

## � Overview

This frontend application provides:

- ✅ Server-side rendering with Astro
- ✅ Interactive components with React
- ✅ Responsive design with Tailwind CSS v4
- ✅ Authentication flow (login/signup)
- ✅ Session management via API
- ✅ Type-safe API communication

---

## �️ Tech Stack

- **Astro** 5.15.1 - Static site generator with SSR
- **React** 19.2.0 - UI library for interactive components
- **Tailwind CSS** v4.1.15 - Utility-first CSS framework
- **TypeScript** 5.9.3 - Type-safe JavaScript
- **ESLint** 9.38.0 - Code quality with flat config format
- **Prettier** 3.4.0 - Code formatter

---

## 📁 Project Structure

```text
apps/web/
├── src/
│   ├── components/          # React components
│   │   ├── AuthForm.tsx     # Authentication form
│   │   └── Button.tsx       # Reusable button component
│   ├── layouts/             # Astro layouts
│   │   ├── AuthLayout.astro # Layout for auth pages
│   │   └── BaseLayout.astro # Base layout
│   ├── lib/
│   │   └── api/
│   │       ├── client.ts    # HTTP client for backend communication
│   │       └── auth.ts      # Authentication API methods
│   ├── pages/               # Astro pages (routes)
│   │   ├── index.astro      # Home page
│   │   ├── login.astro      # Login page
│   │   ├── signup.astro     # Signup page
│   │   ├── dashboard.astro  # Dashboard (protected)
│   │   └── logout.astro     # Logout handler
│   ├── middleware.ts        # Session validation middleware
│   ├── env.d.ts             # Environment type definitions
│   └── styles/
│       └── globals.css      # Global styles
├── public/                  # Static assets
├── astro.config.mjs         # Astro configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- Bun v1.3.1 or higher

### Installation

From the **root directory** of the monorepo:

```bash
bun install
```

### Environment Variables

Create `apps/web/.env.local`:

```env
PUBLIC_API_URL=http://localhost:3000
```

This variable tells the frontend where to find the backend API.

### Development

Start the development server from the **root directory**:

```bash
bun dev
```

Or run only the web app from the root directory:

```bash
bun --filter @repo/web dev
```

The frontend will be available at [http://localhost:4321](http://localhost:4321)

---

## 📦 Available Scripts

For monorepo-level commands (dev, build, lint, format, typecheck, clean), see
[../../README.md](../../README.md#-available-scripts).

Run frontend-specific commands from the **root directory** using `--filter`:

```bash
bun --filter @repo/web dev           # Start dev server
bun --filter @repo/web build         # Build for production
bun --filter @repo/web preview       # Preview production build
bun --filter @repo/web lint          # Lint and fix code
bun --filter @repo/web lint:check    # Check linting without fixing
bun --filter @repo/web typecheck     # Type check with Astro
bun --filter @repo/web test          # Run tests with Bun test runner
```

---

## 🏗️ Architecture

### API-First Design

The frontend communicates with the backend **exclusively via REST API**:

- ✅ All data flows through the backend API
- ✅ No direct database access
- ✅ No Prisma or database dependencies
- ✅ Easy to replace or scale independently

### API Client

The centralized API client (`src/lib/api/client.ts`) handles:

- HTTP requests to the backend
- Authentication cookie forwarding
- Error handling with detailed messages
- Type-safe request/response handling

### Session Management

Session validation happens in middleware (`src/middleware.ts`):

- Checks session on protected routes
- Redirects to login if not authenticated
- Forwards cookies to backend for validation

---

## 🔐 Authentication Flow

1. **Sign Up** - User creates account via `/signup`
2. **Sign In** - User logs in via `/login`
3. **Session** - Backend returns session cookie
4. **Protected Routes** - Middleware validates session
5. **Sign Out** - User logs out via `/logout`

---

## 🎨 Styling

This project uses **Tailwind CSS v4** with:

- Dark theme (zinc-900 background, zinc-100 text)
- Responsive design
- Custom color palette
- Utility-first approach

### Color Scheme

- **Background**: `zinc-900`
- **Text**: `zinc-100`
- **Cards/Inputs**: `zinc-800`
- **Borders**: `zinc-700`
- **Accents**: Blue for primary actions

---

## 📚 Key Files

### `src/lib/api/client.ts`

Centralized HTTP client for all backend communication:

```typescript
// Type-safe API requests
const response = await apiClient.post<LoginResponse>('/auth/sign-in', {
  email,
  password
})
```

### `src/middleware.ts`

Session validation for protected routes:

```typescript
// Redirects to login if no session
const session = await authApi.getSession(cookieHeader)
if (!session) {
  return context.redirect('/login')
}
```

### `src/components/AuthForm.tsx`

Reusable authentication form component:

```typescript
<AuthForm mode='login' client:load />
```

---

## 🧪 Testing

This frontend uses **Bun's native test runner** for all tests.

Run tests from the **root directory**:

```bash
bun --filter @repo/web test          # Run all tests
bun --filter @repo/web test:watch    # Run tests in watch mode
bun --filter @repo/web test:cov      # Run tests with coverage
```

### Quality Checks

Run quality checks from the **root directory**:

```bash
bun format:check        # Check formatting
bun lint:check          # Check linting
bun typecheck           # Type check
bun build               # Build test
```

---

## 📖 Learning Resources

This frontend demonstrates:

- **Astro SSR** - Server-side rendering with Astro
- **React Integration** - Using React components in Astro
- **Tailwind CSS v4** - Modern utility-first CSS
- **TypeScript** - Type-safe frontend code
- **API Communication** - Centralized HTTP client
- **Session Management** - Cookie-based authentication
- **Middleware** - Route protection and validation

---

## � Related Documentation

- **Root README**: See [../../README.md](../../README.md) for monorepo overview
- **Backend API**: See [../api/README.md](../api/README.md) for backend documentation (if available)
- **Astro Docs**: [https://docs.astro.build](https://docs.astro.build)
- **React Docs**: [https://react.dev](https://react.dev)
- **Tailwind CSS**: [https://tailwindcss.com](https://tailwindcss.com)

---

**Happy coding! 🚀**
