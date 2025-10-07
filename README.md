## Password Generator + Secure Vault (MVP)

Fast minimal password manager. Next.js + MongoDB. Client-side AES encryption so the server and DB only see encrypted blobs.

### 1) Prerequisites
- Node 18+ (LTS)
- MongoDB connection string (Atlas or local)

### 2) Setup
Create `password-vault/.env.local` beside `package.json`:

```
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=replace-with-long-random
NEXT_PUBLIC_CLIENT_SECRET=replace-with-strong-client-key
```

Tip (Windows): make sure the file is not saved as `.env.local.txt` and restart `npm run dev` after editing.

### 3) Run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

### Tech choices
- Next.js App Router, Tailwind (light/dark theme, no heavy UI kits)
- MongoDB with Mongoose
- Auth: email + password (bcrypt) → JWT (localStorage)
- Crypto: client‑side AES (CryptoJS)


### API surface
- POST `/api/auth/signup` → create user
- POST `/api/auth/login` → `{ token }`
- GET `/api/vault` (Bearer) → list items (encrypted)
- POST `/api/vault` (Bearer) → create (encrypted fields)
- PUT `/api/vault` (Bearer) → update by `id`
- DELETE `/api/vault` (Bearer) → delete by `id`

### Security notes
- Vault fields are encrypted in the browser; the backend never handles plaintext fields.
- Avoid logging secrets. Keep `.env.local` out of version control.

### 

### Troubleshooting
- Error “Please define the MONGODB_URI …”: ensure `.env.local` exists in `password-vault/`, names are exact, then fully restart dev server. On Windows, confirm it’s not `.env.local.txt`.
