# MOBSMILE — Frontend

Premium electronics showroom for Sri Lanka. No online checkout: every product
funnels customers to a WhatsApp inquiry (**0774312456**).

**Stack:** TanStack Start (React 19, SSR) · Vite · Tailwind CSS 4 · Supabase (auth + data) · deployed on Vercel.

This repository is the **frontend only**. The database, auth rules and AI
gateway live in the separate **mobsmile-backend** package (Supabase). Set that
up first — see its README.

## 1. Run locally

Requires Node.js 22.12+ (24 recommended).

```sh
npm install
cp .env.example .env     # then fill in the two VITE_SUPABASE_* values
npm run dev              # open the local URL that Vite prints
```

Commit the `package-lock.json` that `npm install` creates, so builds on Vercel
are reproducible.

## 2. Environment variables

| Variable | Where | Required | Notes |
|---|---|---|---|
| `VITE_SUPABASE_URL` | Vercel + local | yes | `https://<project-ref>.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Vercel + local | yes | Publishable (or legacy anon) key. Public by design. |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel only | no | Only for staff-management server functions. Never prefix with `VITE_`. |

AI provider keys are **not** set here — they live in Supabase secrets (backend package).

## 3. Deploy to Vercel

1. Push this folder to a GitHub repository.
2. Vercel → **Add New… → Project** → import the repo. The preset should read **TanStack Start**; leave build settings on their defaults.
3. Add the environment variables above (Production, Preview, Development) and deploy.
4. Copy your production URL, then in Supabase → **Authentication → URL Configuration** set the **Site URL** to it and add `https://<your-domain>/**` to **Redirect URLs** (otherwise login emails and Google sign-in redirect to the wrong place).

Changing an environment variable requires a redeploy.

## 4. Project structure

```
src/
  routes/        file-based routes (/, /category/$slug, /product/$id, /search, /contact, /auth, /account, /privacy, /terms)
  components/    UI (Navbar, Footer, ProductCard, LoadingScreen, shadcn/ui primitives)
  lib/           catalogue, site settings, account helpers, AI client (ai.ts)
  integrations/supabase/   Supabase clients, auth middleware, generated DB types
public/          favicon, robots.txt
docs/            design-brief.md
```

## 5. Catalogue

`src/lib/products.ts` holds a built-in baseline catalogue so the site is never
empty. Products added to the Supabase `products` table are merged on top (a
row with the same slug overrides the built-in product). Shop name, WhatsApp
number, hours and social links come from the `settings` table.

There is currently **no admin dashboard UI** in this codebase: manage products
and settings from the Supabase Table Editor (see the backend README).

## 6. Using the AI gateway

```ts
import { askAi } from "@/lib/ai";

const { reply, label } = await askAi([{ role: "user", content: "Which phone has the best camera?" }]);
```

Requires a signed-in user. The Edge Function picks the first working service
among the three configured slots (or a specific one via `{ provider: 2 }`).
