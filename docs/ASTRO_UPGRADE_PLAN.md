# Astro Upgrade Plan

## Current Status
- **Current Version**: Astro 5.13.0
- **Target Version**: Astro 5.14.6+ (latest)
- **Reason for Downgrade**: Virtual module resolution bug in Astro 5.14.6

## The Issue

Astro 5.14.6 introduced a bug that prevents proper resolution of virtual modules, specifically:
- `virtual:astro:actions/options`
- `virtual:astro:actions/runtime`

This causes build failures and prevents the Astro Actions feature from working correctly.

### Error Symptoms
```
Could not resolve "virtual:astro:actions/options"
Could not resolve "virtual:astro:actions/runtime"
```

## Monitoring for Fix

### 1. Track Astro Repository
Monitor the official Astro GitHub repository for fixes:
- **Repository**: https://github.com/withastro/astro
- **Issue Tracking**: Search for issues related to "virtual modules" or "actions"
- **Release Notes**: Check release notes for mentions of virtual module fixes

### 2. Test Indicators
Before upgrading, verify these indicators:
- [ ] No open issues mentioning virtual module resolution problems
- [ ] Release notes explicitly mention virtual module fixes
- [ ] Community reports successful usage of Astro Actions in latest version

## Upgrade Process

### Step 1: Preparation
```bash
# Create a backup branch
git checkout -b backup/before-astro-upgrade

# Ensure all current changes are committed
git add .
git commit -m "Backup before Astro upgrade"
```

### Step 2: Test Upgrade
```bash
# Update Astro to latest version
yarn add astro@latest

# Update related Astro packages
yarn add @astrojs/node@latest @astrojs/react@latest @astrojs/check@latest
```

### Step 3: Verification Tests
Run these tests to ensure the upgrade is successful:

```bash
# 1. Clean build test
yarn build

# 2. Development server test
yarn dev

# 3. Actions functionality test
# Navigate to pages that use Astro Actions:
# - http://localhost:4321/login
# - http://localhost:4321/signup
# - http://localhost:4321/ (logout action)
```

### Step 4: Specific Action Tests
Verify these Astro Actions work correctly:
- [ ] Login form submission (`actions.login`)
- [ ] Signup form submission (`actions.signup`)
- [ ] Logout functionality (`actions.logout`)
- [ ] No console errors related to virtual modules

### Step 5: Rollback Plan
If issues persist:
```bash
# Rollback to working version
yarn add astro@5.13.0 @astrojs/node@9.4.0 @astrojs/react@4.3.0 @astrojs/check@0.9.5

# Verify rollback works
yarn build
yarn dev
```

## Post-Upgrade Tasks

### 1. Update Documentation
- [ ] Update this document with successful upgrade date
- [ ] Update package.json version references in documentation
- [ ] Remove this upgrade plan if no longer needed

### 2. Test Full Application
- [ ] Run complete test suite (if available)
- [ ] Test all authentication flows
- [ ] Verify all pages load correctly
- [ ] Check for any new TypeScript errors

### 3. Commit Changes
```bash
git add .
git commit -m "Upgrade Astro to [VERSION] - virtual module bug fixed"
```

## Alternative Solutions

If the virtual module bug persists in future versions:

### Option 1: Use Alternative Action Patterns
Consider migrating from Astro Actions to:
- API routes (`src/pages/api/`)
- Server-side form handling
- Client-side form submission with fetch

### Option 2: Stay on 5.13.0
- Continue using Astro 5.13.0 until the bug is definitively fixed
- Monitor security updates and apply patches as needed
- Evaluate if newer features are worth the upgrade risk

## Notes
- **Created**: October 20, 2025
- **Last Updated**: October 20, 2025
- **Status**: Waiting for Astro virtual module bug fix
- **Priority**: Medium (current version is stable and functional)
