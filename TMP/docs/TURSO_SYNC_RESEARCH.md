# Turso Sync Configuration Research

## Executive Summary

**Status**: Sync functionality is correctly disabled due to Turso free plan limitations. **Root
Cause**: Embedded replicas are not supported on Turso's free tier. **Recommendation**: Current
implementation is correct; upgrade Turso plan to enable sync.

## Research Findings

### 1. Free Plan Limitations

**Critical Discovery**: Turso's free plan does not support embedded replicas.

**Evidence**:

- GitHub Issue: https://github.com/tursodatabase/libsql/issues/1900
- Error Message: `"embedded replicas are not supported for this platform and tariff plan"`
- Multiple users reporting the same issue on free plans

**Impact**:

- Sync functionality cannot work on free tier regardless of configuration
- Local replica databases are not supported
- Direct remote connections only

### 2. Prisma Adapter Issues

**Current State**: Prisma's Turso support is in "Early Access"

**Known Issues**:

- `@prisma/adapter-libsql` version 6.17.1 has compatibility issues
- Environment variable handling problems (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`)
- Webpack bundling issues in some production environments
- Inconsistent behavior across different Node.js versions

**Official Configuration** (from Prisma docs):

```typescript
import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

const adapter = new PrismaLibSQL(libsql)
const prisma = new PrismaClient({ adapter })
```

### 3. Current Implementation Analysis

**Our Current Approach** (Correct):

```typescript
// Direct Prisma client without adapter
export const prisma = new PrismaClient()

// libSQL client without sync
export const libsql = createClient({
  url: `file://${dbPath}`
  // Sync disabled - not supported on free plan
})
```

**Why This Works**:

- Uses local SQLite database directly
- No dependency on Turso's paid features
- Avoids adapter compatibility issues
- Maintains full functionality for development

## Solutions and Recommendations

### Option 1: Upgrade Turso Plan (Recommended for Production)

**Benefits**:

- Enables embedded replicas and sync
- Better performance with local caching
- Automatic synchronization with remote database

**Cost**: Check Turso pricing for embedded replica support

**Implementation**:

```typescript
// Re-enable sync after plan upgrade
export const libsql = createClient({
  url: `file://${dbPath}`,
  syncUrl: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
  syncInterval: 600
})

// Use adapter with sync-enabled client
const adapter = new PrismaLibSQL(libsql)
export const prisma = new PrismaClient({ adapter })
```

### Option 2: Remote-Only Mode (Alternative)

**Use Case**: If local replica isn't needed

**Implementation**:

```typescript
// Direct remote connection without local replica
export const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

const adapter = new PrismaLibSQL(libsql)
export const prisma = new PrismaClient({ adapter })
```

**Trade-offs**:

- ✅ Works on free plan
- ✅ Always up-to-date data
- ❌ Higher latency (no local caching)
- ❌ Requires internet connection

### Option 3: Hybrid Approach (Development vs Production)

**Development**: Current local SQLite approach **Production**: Remote-only or upgraded plan with
sync

```typescript
const isDev = import.meta.env.DEV

export const libsql = isDev
  ? createClient({ url: `file://${dbPath}` })
  : createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    })

export const prisma = isDev
  ? new PrismaClient()
  : new PrismaClient({ adapter: new PrismaLibSQL(libsql) })
```

## Action Items

### Immediate (Completed)

- [x] Document current implementation rationale
- [x] Add detailed TODO comments explaining disabled sync
- [x] Verify current approach works correctly

### Short-term

- [ ] Evaluate Turso plan upgrade cost/benefit
- [ ] Test remote-only mode in development environment
- [ ] Monitor Prisma adapter improvements

### Long-term

- [ ] Implement production-ready sync solution
- [ ] Set up proper environment-based configuration
- [ ] Add monitoring for sync status and errors

## Technical Notes

### Environment Variables Required

```bash
# For remote connections (production)
TURSO_DATABASE_URL=libsql://[database-name]-[org-name].turso.io
TURSO_AUTH_TOKEN=eyJ...

# For local development (current)
# No additional variables needed
```

### Database Schema Compatibility

- Current schema works with both local SQLite and remote Turso
- No migration needed when switching between modes
- Prisma handles dialect differences automatically

## References

- [Prisma Turso Documentation](https://www.prisma.io/docs/orm/overview/databases/turso)
- [Turso Embedded Replicas](https://docs.turso.tech/features/embedded-replicas)
- [libSQL Client Documentation](https://docs.turso.tech/sdk/ts/quickstart)
- [GitHub Issue #1900](https://github.com/tursodatabase/libsql/issues/1900)

---

**Last Updated**: October 20, 2025 **Status**: Research Complete **Next Review**: When considering
Turso plan upgrade
