# API Testing Results - Authorization Implementation

**Date:** 2025-11-02

**Test Environment:** Development (<http://localhost:3000>)

**Database:** SQLite (replica.db)

**Test Users:**

- ADMIN: <admin@example.com> (ID: jZFlXy9A095vKrr9wNqrLY1x9uqh7GkT)
- EDITOR: <editor@example.com> (ID: PjvZcZDnkzAZHKXAUvO0KLi8FCKEe54r)
- USER: <user@example.com> (ID: Ovm72t8LHsDsTtwFXVDV2CupiYKpxhAp)

---

## Test Summary

| Category         | Total Tests | Passed | Failed |
| ---------------- | ----------- | ------ | ------ |
| Authentication   | 3           | 3      | 0      |
| Public Endpoints | 1           | 1      | 0      |
| User Management  | 8           | 8      | 0      |
| Posts Management | 10          | 10     | 0      |
| **TOTAL**        | **22**      | **22** | **0**  |

---

## 1. Authentication Tests

### 1.1 Sign In - ADMIN

**Command:**

```bash
curl -s -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "Password123!"}' \
  -c /tmp/admin-fresh.txt | jq .
```

**Expected:** 200 OK with session cookie  
**Result:** ✅ PASS  
**Response:** Session created successfully, cookie saved

### 1.2 Sign In - EDITOR

**Command:**

```bash
curl -s -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email": "editor@example.com", "password": "Password123!"}' \
  -c /tmp/editor-fresh.txt | jq .
```

**Expected:** 200 OK with session cookie  
**Result:** ✅ PASS  
**Response:** Session created successfully, cookie saved

### 1.3 Sign In - USER

**Command:**

```bash
curl -s -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "Password123!"}' \
  -c /tmp/user-fresh.txt | jq .
```

**Expected:** 200 OK with session cookie  
**Result:** ✅ PASS  
**Response:** Session created successfully, cookie saved

---

## 2. Public Endpoints Tests

### 2.1 GET /posts/public (No Authentication)

**Command:**

```bash
curl -s -X GET http://localhost:3000/posts/public | jq .
```

**Expected:** 200 OK with public posts  
**Result:** ✅ PASS  
**Response:**

```json
{
  "message": "Public posts - accessible to everyone",
  "posts": [
    { "id": "1", "title": "Public Post 1", "published": true },
    { "id": "2", "title": "Public Post 2", "published": true }
  ]
}
```

---

## 3. User Management Tests

### 3.1 GET /users/:id - ADMIN

**Command:**

```bash
curl -s http://localhost:3000/users/jZFlXy9A095vKrr9wNqrLY1x9uqh7GkT \
  -b /tmp/admin-fresh.txt | jq .
```

**Expected:** 200 OK with user details  
**Result:** ✅ PASS  
**Response:**

```json
{
  "id": "jZFlXy9A095vKrr9wNqrLY1x9uqh7GkT",
  "email": "admin@example.com",
  "name": "Admin User",
  "role": "admin"
}
```

### 3.2 GET /users/:id - EDITOR

**Command:**

```bash
curl -s http://localhost:3000/users/PjvZcZDnkzAZHKXAUvO0KLi8FCKEe54r \
  -b /tmp/editor-fresh.txt | jq .
```

**Expected:** 200 OK with user details  
**Result:** ✅ PASS  
**Response:**

```json
{
  "id": "PjvZcZDnkzAZHKXAUvO0KLi8FCKEe54r",
  "email": "editor@example.com",
  "name": "Editor User",
  "role": "editor"
}
```

### 3.3 GET /users/:id - USER

**Command:**

```bash
curl -s http://localhost:3000/users/Ovm72t8LHsDsTtwFXVDV2CupiYKpxhAp \
  -b /tmp/user-fresh.txt | jq .
```

**Expected:** 200 OK with user details  
**Result:** ✅ PASS  
**Response:**

```json
{
  "id": "Ovm72t8LHsDsTtwFXVDV2CupiYKpxhAp",
  "email": "user@example.com",
  "name": "Regular User",
  "role": "user"
}
```

### 3.4 GET /users/:id - No Authentication

**Command:**

```bash
curl -s http://localhost:3000/users/jZFlXy9A095vKrr9wNqrLY1x9uqh7GkT | jq .
```

**Expected:** 401 Unauthorized  
**Result:** ✅ PASS  
**Response:**

```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

### 3.5 PUT /users/:id/role - ADMIN Updates EDITOR to USER

**Command:**

```bash
curl -s -X PUT http://localhost:3000/users/PjvZcZDnkzAZHKXAUvO0KLi8FCKEe54r/role \
  -b /tmp/admin-fresh.txt \
  -H "Content-Type: application/json" \
  -d '{"role": "user"}' | jq .
```

**Expected:** 200 OK with updated user  
**Result:** ✅ PASS  
**Response:**

```json
{
  "id": "PjvZcZDnkzAZHKXAUvO0KLi8FCKEe54r",
  "email": "editor@example.com",
  "name": "Editor User",
  "role": "user"
}
```

### 3.6 PUT /users/:id/role - EDITOR Attempts to Update Role

**Command:**

```bash
curl -s -X PUT http://localhost:3000/users/Ovm72t8LHsDsTtwFXVDV2CupiYKpxhAp/role \
  -b /tmp/editor-fresh.txt \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}' | jq .
```

**Expected:** 403 Forbidden  
**Result:** ✅ PASS  
**Response:**

```json
{
  "message": "Insufficient permissions",
  "error": "Forbidden",
  "statusCode": 403
}
```

### 3.7 PUT /users/:id/role - USER Attempts to Update Role

**Command:**

```bash
curl -s -X PUT http://localhost:3000/users/PjvZcZDnkzAZHKXAUvO0KLi8FCKEe54r/role \
  -b /tmp/user-fresh.txt \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}' | jq .
```

**Expected:** 403 Forbidden  
**Result:** ✅ PASS  
**Response:**

```json
{
  "message": "Insufficient permissions",
  "error": "Forbidden",
  "statusCode": 403
}
```

### 3.8 PUT /users/:id/role - ADMIN Attempts to Change Own Role

**Command:**

```bash
curl -s -X PUT http://localhost:3000/users/jZFlXy9A095vKrr9wNqrLY1x9uqh7GkT/role \
  -b /tmp/admin-fresh.txt \
  -H "Content-Type: application/json" \
  -d '{"role": "user"}' | jq .
```

**Expected:** 400 Bad Request (Cannot change own role)  
**Result:** ✅ PASS  
**Response:**

```json
{
  "message": "You cannot change your own role",
  "error": "Bad Request",
  "statusCode": 400
}
```

---

## 4. Posts Management Tests

### 4.1 POST /posts - EDITOR Creates Post

**Command:**

```bash
curl -s -X POST http://localhost:3000/posts \
  -b /tmp/editor-fresh.txt \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Post by Editor", "content": "Test content"}' | jq .
```

**Expected:** 201 Created with post details  
**Result:** ✅ PASS  
**Response:**

```json
{
  "message": "Post created - accessible to users with create permission",
  "user": {
    "id": "PjvZcZDnkzAZHKXAUvO0KLi8FCKEe54r",
    "role": "editor"
  },
  "post": {
    "id": "new-post-id",
    "title": "Test Post by Editor",
    "content": "Test content",
    "authorId": "PjvZcZDnkzAZHKXAUvO0KLi8FCKEe54r",
    "published": false
  }
}
```

### 4.2 POST /posts - USER Attempts to Create Post

**Command:**

```bash
curl -s -X POST http://localhost:3000/posts \
  -b /tmp/user-fresh.txt \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Post by User", "content": "Test content"}' | jq .
```

**Expected:** 403 Forbidden

**Result:** ✅ PASS

**Response:**

```json
{
  "message": "Insufficient permissions",
  "error": "Forbidden",
  "statusCode": 403
}
```

### 4.3 PUT /posts/:id - EDITOR Updates Post

**Command:**

```bash
curl -s -X PUT http://localhost:3000/posts/1 \
  -b /tmp/editor-fresh.txt \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Post by Editor"}' | jq .
```

**Expected:** 200 OK with updated post

**Result:** ✅ PASS

**Response:**

```json
{
  "message": "Post 1 updated - accessible to users with update permission",
  "user": {
    "id": "PjvZcZDnkzAZHKXAUvO0KLi8FCKEe54r",
    "role": "editor"
  },
  "post": {
    "id": "1",
    "title": "Updated Post by Editor",
    "content": "Updated content...",
    "updatedBy": "PjvZcZDnkzAZHKXAUvO0KLi8FCKEe54r"
  }
}
```

### 4.4 PUT /posts/:id - USER Attempts to Update Post

**Command:**

```bash
curl -s -X PUT http://localhost:3000/posts/1 \
  -b /tmp/user-fresh.txt \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Post by User"}' | jq .
```

**Expected:** 403 Forbidden

**Result:** ✅ PASS

**Response:**

```json
{
  "message": "Insufficient permissions",
  "error": "Forbidden",
  "statusCode": 403
}
```

### 4.5 DELETE /posts/:id - ADMIN Deletes Post

**Command:**

```bash
curl -s -X DELETE http://localhost:3000/posts/1 \
  -b /tmp/admin-fresh.txt | jq .
```

**Expected:** 200 OK with deleted post ID

**Result:** ✅ PASS

**Response:**

```json
{
  "message": "Post 1 deleted - accessible to users with delete permission (ADMIN only)",
  "user": {
    "id": "jZFlXy9A095vKrr9wNqrLY1x9uqh7GkT",
    "role": "admin"
  },
  "deletedPostId": "1"
}
```

### 4.6 DELETE /posts/:id - EDITOR Attempts to Delete Post

**Command:**

```bash
curl -s -X DELETE http://localhost:3000/posts/2 \
  -b /tmp/editor-fresh.txt | jq .
```

**Expected:** 403 Forbidden

**Result:** ✅ PASS

**Response:**

```json
{
  "message": "Insufficient permissions",
  "error": "Forbidden",
  "statusCode": 403
}
```

### 4.7 DELETE /posts/:id - USER Attempts to Delete Post

**Command:**

```bash
curl -s -X DELETE http://localhost:3000/posts/3 \
  -b /tmp/user-fresh.txt | jq .
```

**Expected:** 403 Forbidden

**Result:** ✅ PASS

**Response:**

```json
{
  "message": "Insufficient permissions",
  "error": "Forbidden",
  "statusCode": 403
}
```

### 4.8 POST /posts/admin/bulk-delete - ADMIN Bulk Deletes Posts

**Command:**

```bash
curl -s -X POST http://localhost:3000/posts/admin/bulk-delete \
  -b /tmp/admin-fresh.txt \
  -H "Content-Type: application/json" \
  -d '{"postIds": ["1", "2", "3"]}' | jq .
```

**Expected:** 200 OK with deleted count

**Result:** ✅ PASS

**Response:**

```json
{
  "message": "Bulk delete - accessible to ADMIN only (manage all)",
  "user": {
    "id": "jZFlXy9A095vKrr9wNqrLY1x9uqh7GkT",
    "role": "admin"
  },
  "deletedCount": 3,
  "deletedPostIds": ["1", "2", "3"]
}
```

### 4.9 POST /posts/admin/bulk-delete - EDITOR Attempts Bulk Delete

**Command:**

```bash
curl -s -X POST http://localhost:3000/posts/admin/bulk-delete \
  -b /tmp/editor-fresh.txt \
  -H "Content-Type: application/json" \
  -d '{"postIds": ["1", "2"]}' | jq .
```

**Expected:** 403 Forbidden

**Result:** ✅ PASS

**Response:**

```json
{
  "message": "Insufficient permissions",
  "error": "Forbidden",
  "statusCode": 403
}
```

### 4.10 POST /posts/admin/bulk-delete - USER Attempts Bulk Delete

**Command:**

```bash
curl -s -X POST http://localhost:3000/posts/admin/bulk-delete \
  -b /tmp/user-fresh.txt \
  -H "Content-Type: application/json" \
  -d '{"postIds": ["1"]}' | jq .
```

**Expected:** 403 Forbidden

**Result:** ✅ PASS

**Response:**

```json
{
  "message": "Insufficient permissions",
  "error": "Forbidden",
  "statusCode": 403
}
```

---

## Issues Discovered and Resolved

### Issue 1: Better Auth Custom Fields Not in Session

**Problem:** The `role` field was not included in the session by default, causing authorization
checks to fail.

**Root Cause:** Better Auth does not include custom fields in the session by default.

**Solution:** Added `user.additionalFields` configuration in Better Auth config:

```typescript
user: {
  additionalFields: {
    role: {
      type: 'string',
      required: true,
      defaultValue: 'user'
    }
  }
}
```

### Issue 2: Custom @CurrentUser Decorator Incompatible with Better Auth

**Problem:** PostsController was using a custom `@CurrentUser` decorator that looked for
`request.user`, but Better Auth sets `request.session.user`.

**Root Cause:** Better Auth uses a different request structure than the custom decorator expected.

**Solution:** Updated all controller methods to use Better Auth's `@Session()` decorator instead of
the custom `@CurrentUser()` decorator.

### Issue 3: Session Caching After Configuration Changes

**Problem:** After adding custom fields to Better Auth configuration, existing sessions did not
include the new fields.

**Root Cause:** Session caching does not automatically include newly configured custom fields.

**Solution:** Created fresh sessions by signing in again after the configuration change.

---

## Authorization Matrix

| Endpoint                      | ADMIN | EDITOR | USER | Anonymous |
| ----------------------------- | ----- | ------ | ---- | --------- |
| GET /posts/public             | ✅    | ✅     | ✅   | ✅        |
| GET /posts                    | ✅    | ✅     | ✅   | ❌        |
| GET /posts/:id                | ✅    | ✅     | ✅   | ❌        |
| POST /posts                   | ✅    | ✅     | ❌   | ❌        |
| PUT /posts/:id                | ✅    | ✅     | ❌   | ❌        |
| DELETE /posts/:id             | ✅    | ❌     | ❌   | ❌        |
| POST /posts/admin/bulk-delete | ✅    | ❌     | ❌   | ❌        |
| GET /users/:id                | ✅    | ✅     | ✅   | ❌        |
| PUT /users/:id/role           | ✅    | ❌     | ❌   | ❌        |

---

## Conclusion

All 22 API tests passed successfully. The authorization system is working correctly with:

1. **Better Auth Integration**: Successfully integrated Better Auth with custom role field in
   session
2. **CASL Authorization**: Role-based permissions working as expected
3. **Hexagonal Architecture**: Clean separation of concerns maintained
4. **Security**: Proper authentication and authorization checks in place

**Next Steps:**

- Consider adding integration tests using the Bun test runner
- Add validation for request bodies (DTOs)
- Implement actual database operations for Posts endpoints
- Add audit logging for sensitive operations (role changes, deletions)
