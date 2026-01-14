# AI_AGENT_RULES.md
```
## Purpose
This document defines **non-negotiable rules** for AI agents contributing to this codebase.
The goal is to enforce **TypeScript safety, Express best practices, Prisma correctness,
security-first development, and scalable architecture**.

If a suggestion violates any rule below, **do not generate it**.

---

## Project Context (DO NOT IGNORE)
- Runtime: **Node.js (ESM)**
- Language: **TypeScript**
- Framework: **Express v5**
- ORM: **Prisma + PostgreSQL**
- Validation: **Zod**
- Auth: **JWT + bcrypt**
- Payments: **Midtrans**
- Security: **Helmet, Rate Limit, CORS**
- Email: **Resend**

This is a **backend-only server**, not a monolith, not MVC-heavy, not frontend-aware.

---

## Absolute Rules (Hard Fail If Violated)

### 1. TypeScript Is Mandatory
- ❌ No `any`
- ❌ No implicit `any`
- ❌ No untyped request/response objects
- ✅ Always type:
  - `Request`
  - `Response`
  - `NextFunction`
- ✅ Prefer **type inference from Zod schemas**

Bad:
```ts
(req, res) => {}
Good:

ts
Copy code
(req: Request<Params, ResBody, ReqBody>, res: Response)
2. Validation First, Always
❌ Never trust req.body, req.query, or req.params

❌ Never manually validate inputs

✅ Use Zod schemas only

✅ Validate at the edge (controller layer)

Pattern:

ts
Copy code
const parsed = schema.parse(req.body)
Never:

ts
Copy code
if (!email) throw ...
3. Layered Architecture (NO GOD FILES)
Mandatory separation:

routes/ → routing only

controllers/ → request handling

services/ → business logic

repositories/ → Prisma queries

schemas/ → Zod schemas

middlewares/ → auth, rate limit, error handling

lib/ → shared utilities (jwt, prisma, mail)

❌ Controllers talking directly to Prisma
❌ Routes containing business logic

4. Prisma Rules (Very Important)
❌ Never instantiate PrismaClient multiple times

❌ Never access Prisma from controllers

✅ Use a singleton Prisma client

✅ Queries live in repositories only

Good:

ts
Copy code
lib/prisma.ts
Bad:

ts
Copy code
new PrismaClient() inside controller
5. Auth & Security Rules
❌ Never store plaintext passwords

❌ Never manually hash without bcrypt

❌ Never expose JWT payloads blindly

✅ Always:

bcrypt.hash

bcrypt.compare

jwt.sign with expiry

jwt.verify inside middleware

JWT middleware must:

Attach user to req.user

Reject expired or invalid tokens

6. Error Handling Discipline
❌ No try/catch inside routes

❌ No raw error messages sent to client

✅ Centralized error middleware

✅ Custom error classes

Pattern:

ts
Copy code
throw new AppError("Unauthorized", 401)
7. Express Best Practices
✅ Use helmet() globally

✅ Use express-rate-limit for auth & payment routes

❌ No anonymous middleware functions everywhere

❌ No deeply nested callbacks

Prefer:

ts
Copy code
router.post("/login", loginController)
8. Payments (Midtrans)
❌ Never trust payment callbacks blindly

❌ Never mark orders as paid without verification

✅ Always:

Verify Midtrans signature

Store transaction status

Handle idempotency

Payment logic must live in services, never controllers.

9. Environment Variables
❌ No hardcoded secrets

❌ No fallback secrets in code

✅ Use dotenv

✅ Validate env with Zod at startup

Fail fast if env is invalid.

10. Async Discipline
❌ No unhandled promises

❌ No .then() chains

✅ async/await only

✅ Controllers return Promise<void>

11. Logging & Side Effects
❌ No console.log in production logic

✅ Abstract logging if needed

❌ No side effects during import time

AI Behavior Constraints
The AI agent:

❌ Must not invent libraries not in package.json

❌ Must not downgrade Express or Prisma versions

❌ Must not suggest ORM alternatives

❌ Must not introduce MVC frameworks

The AI may:

Refactor for clarity

Improve performance

Tighten security

Reduce coupling

Improve typings

Preferred References (Ground Truth)
AI suggestions must align with:

Prisma Docs (Client, Transactions, Migrations)

Express 5 Docs

Zod Documentation

OWASP API Security Top 10

Node.js ESM Best Practices

If unsure → do nothing.

Final Rule
If a suggestion feels clever but risky, don’t generate it.
Stability > novelty.
Type safety > speed.
Security > convenience.

End of rules.

```
