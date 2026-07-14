# Setup Notes

This zip has your Week 1 frontend (Navbar, Footer, landing sections) **and** the
full backend auth system (register, email verification, login, JWT, protected
routes) already wired in an MVC layout:

```
app/api/auth/*      -> route.ts files only call a controller
controllers/        -> reads request, validates, calls a service, shapes response
services/           -> business logic (DB queries, hashing, tokens)
models/             -> Mongoose schemas
lib/                -> mongodb connection, jwt helpers, email sender
middleware/         -> withAuth / withAdminAuth guards for future routes
validations/        -> Zod input schemas
helpers/authApi.ts  -> frontend fetch wrappers + token storage
app/(auth)/*         -> register, login, verify-email, verify-email-pending pages
```

`node_modules`, `.git`, and `.next` are intentionally excluded (see prior notes on
why not to zip/commit `node_modules`).

## 1. Install dependencies

```bash
npm install
```

This installs everything already in `package.json`, including the backend
packages (`mongoose`, `bcryptjs`, `jsonwebtoken`, `zod`, `nodemailer`,
`react-hot-toast`) and their `@types/*` packages.

## 2. Set up environment variables

Copy the example file and fill in your real values:

```bash
cp .env.example .env.local
```

Then edit `.env.local`:
- `MONGODB_URI` — your MongoDB Atlas connection string (**use a freshly rotated
  password** — do not reuse any credential you've pasted into a chat before).
- `JWT_SECRET` — generate one with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- `SMTP_USER` / `SMTP_PASS` — a Gmail address + an **App Password**
  (Google Account → Security → 2-Step Verification → App Passwords). Gmail
  rejects your normal password for SMTP.

`.env.local` is already in `.gitignore` — never commit it.

## 3. Run it

```bash
npm run dev
```

Open http://localhost:3000. Test the auth flow:
1. Go to `/register`, sign up.
2. You're redirected to `/verify-email-pending`.
3. Check your inbox, click the verification link (`/verify-email?token=...`).
4. On success, click "Go to Login".
5. Log in at `/login` — you're redirected to `/` with a JWT saved in
   `localStorage` (see the note in `helpers/authApi.ts` about upgrading this to
   an HTTP-only cookie for real production use).

## Notes
- If you see `next: Permission denied` on Linux/Mac after unzipping, run:
  `chmod +x node_modules/.bin/*` — a fresh `npm install` won't have this issue.
- `app/api/auth/me/route.ts` is a working example of a JWT-protected route using
  `middleware/auth.ts`'s `withAuth()` wrapper — reuse that pattern for cart,
  orders, wishlist, and admin routes later.
