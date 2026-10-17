# Astra Astrology — Web

The public site: the astrologer directory and the signed-in user's own account.
Next.js (App Router) + TypeScript + Tailwind v4, talking to the FastAPI backend.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

Out of the box it talks to the **deployed** backend
(`https://astra-astrology-backend.onrender.com`), so nothing else needs to run.
To develop against a local backend, uncomment the localhost line in `.env.local`
and start `uvicorn app.main:app --port 8000` in `Astra-Astrology-Backend`.
CORS is open (`ALLOWED_ORIGINS=*`), so no proxy is needed either way.

`.env.local`:

| Variable | Meaning |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend origin, no trailing slash. **Optional** — defaults to the deployed API, `https://astra-astrology-backend.onrender.com`. Set it to `http://localhost:8000` to work against a local backend. |
| `NEXT_PUBLIC_API_PREFIX` | API prefix, `/api/v1` |
| `NEXT_PUBLIC_APP_NAME` | Shown in the header and page titles |

Everything is client-rendered against the API, so these are public by design —
never put a secret in a `NEXT_PUBLIC_*` variable.

## Pages

| Route | What it does |
| --- | --- |
| `/` | Landing page |
| `/register` | Email + password sign-up with an OTP step, or Google |
| `/login` | Email + password, or Google |
| `/forgot-password`, `/reset-password` | OTP-based password reset |
| `/astrologers` | Directory: search, skill/language/mode filters, sorting |
| `/astrologers/[slug]` | One astrologer's public page |
| `/account` | Name, gender, phone, avatar, languages |
| `/account/birth-details` | Birth date/time/place — drives the kundli, panchang and numerology readiness |
| `/account/addresses` | Saved addresses |
| `/account/security` | Change password |

Email cannot be changed once the account exists — the backend rejects it and the
field is read-only here.

## How it is wired

- `src/lib/api/client.ts` — the only place that talks to the API. It unwraps the
  `{ success, message, data }` envelope and throws `ApiError`, which carries
  `fieldErrors` for form fields. There is no token refresh (the backend has no
  refresh endpoint), so a 401 ends the session — except for 401s that mean "the
  password you just typed was wrong", which would otherwise sign people out for a typo.
- `src/lib/session.ts` — tokens and the user in `localStorage`, every read and
  write guarded, with listeners so all tabs follow a sign-out.
- `src/types/api.d.ts` — **generated**, never edited by hand. Regenerate after a
  backend change:

  ```bash
  npx openapi-typescript http://localhost:8000/openapi.json -o src/types/api.d.ts
  ```

  `src/types/index.ts` holds the friendly aliases and label maps built on top.
- `src/providers/` — React Query, auth and theme providers.

## Checks

```bash
npx tsc --noEmit
npm run build
```
