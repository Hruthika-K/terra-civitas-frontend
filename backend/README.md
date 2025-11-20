# Terra-Civitas Backend (local)

This is a minimal auth server for local development. It uses SQLite to store users and provides two endpoints:

- `POST /auth/register` — register with `{ email, password }`.
- `POST /auth/login` — login with `{ email, password }`.

Setup

1. Install dependencies:

```powershell
cd backend
npm install
```

2. (Optional) Copy `.env.example` to `.env` and set `JWT_SECRET`.

3. Start the server:

```powershell
npm run start
# or for dev auto-reload:
npm run dev
```

The server listens on port `8000` by default and creates (or reuses) `backend/users.db` SQLite file.

Security

This is a simple local dev server. For production use a real database, stronger secrets, HTTPS, rate-limiting, validation, and secure session handling.
