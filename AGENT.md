# AGENT.md — Bahar Frontend

Guidance for AI agents working on this repository.

## Project

Persian RTL e-commerce storefront for skincare/makeup (**بهار**).

| Item | Value |
|------|--------|
| Stack | React 19 + Vite 8 + React Router 7 |
| Language | JS + JSDoc (no TypeScript) |
| UI copy | Persian only (code/comments may be English) |
| Layout | RTL (`dir="rtl"`, Vazirmatn) |
| Backend | Bahar API OpenAPI (`bahar-backend/internal/doc/swagger.yaml`) |
| API base | `VITE_API_BASE_URL` (default `http://localhost:3000`) |

## Commands

```bash
npm install
cp .env.example .env
npm run dev      # http://localhost:5173
npm run build
npm run lint     # oxlint
```

Backend must be running for auth, products, orders, and admin.

## Architecture

```
src/
├── app/                 # App shell + router
├── components/          # Shared UI (layout, products, auth guards)
├── contexts/            # AuthProvider, CartProvider
├── features/            # Feature UI (home sections, product detail)
├── pages/               # Route pages (store + admin)
├── services/            # API / domain services (single place for HTTP)
│   ├── api/             # client, token, query helpers
│   ├── auth/
│   ├── products/
│   ├── orders/
│   ├── cart/            # localStorage only (no cart API)
│   └── admin/
├── hooks/
├── types/               # JSDoc typedefs aligned with OpenAPI
├── utils/
├── styles/              # globals + CSS variables + form modules
└── mocks/               # legacy/demo data — prefer live API
```

### Layering rules

1. **Pages** compose features/components; keep data fetching thin.
2. **Services** own all `fetch` / API calls. Do not call `apiClient` from JSX.
3. **Contexts** hold session/cart state; do not duplicate token logic outside `services/api/token.js`.
4. **Types** in `src/types/` must stay aligned with OpenAPI schemas.
5. Prefer **CSS Modules** next to components (`Component.module.css`).

## Auth & roles

- Login/register via `/login` and `/register` (same login for users and admins).
- Register accepts optional `name`, `phone`, `address` (OpenAPI `RegisterRequest`).
- JWT stored in `localStorage` (`bahar_access_token`).
- `GET /me` → `{ id, email, name, phone, address, is_admin, created_at }`.
- `PUT /me` → update profile (`ProfileUpdateRequest`: email, name, phone, address, password).
- `ProtectedRoute` → authenticated users.
- `AdminRoute` → `is_admin === true` → `/admin/*`.
- On 401 with `auth: true`, clear token.

## Domain notes

### Products (API)

Fields: `id`, `name`, `description`, `price`, `newPrice`, `image`, `images`, `stock`, `categoryId`, `category` (slug), `onSale`, `created_at`.

Product filter `category` query param uses category **slug**.

Curated lists:
- `GET /products/most-sales?limit=` — best sellers by order quantity
- `GET /products/recently-added?limit=` — newest products

### Categories (API)

- Public: `GET /categories`, `GET /categories/{id}`
- Admin: `POST /categories`, `PUT /categories/{id}`, `DELETE /categories/{id}`
- Fields: `id`, `name`, `slug`, `created_at`
- Product upsert prefers `categoryId`; `category` slug is fallback.

Helpers in `src/utils/productHelpers.js`:

- Sale price = `newPrice ?? price`
- Original = `price` when `newPrice` is set
- In stock = `stock > 0`

### Cart

Client-only (`localStorage`), keyed per user / guest. Merged on login. Not part of OpenAPI.

### Orders

- Create: `POST /orders` with `{ items: [{ product_id, quantity }] }`
- User list: `GET /orders/my`
- Admin: `GET/PUT/DELETE /admin/orders...`
- Admin users: `GET/PUT/DELETE /admin/users...`
- Status enum: `pending | paid | processing | shipped | delivered | cancelled`
- Checkout “mock payment” is frontend-only; real gateway TBD. Admin can set status to `paid`.

### Admin

Routes under `/admin`:

- Dashboard
- Products CRUD + optional image upload (`POST /products/{id}/images`)
- Categories CRUD (`/categories`)
- Orders list / status update / delete
- Users list / edit / delete

## Conventions for changes

- Match existing patterns; do not introduce Tailwind/Redux/etc. unless asked.
- Keep Persian for all user-visible strings.
- Resolve media URLs with `resolveMediaUrl()` from `services/api/client.js`.
- When OpenAPI changes, update: `types/`, `services/`, then pages.
- Do not commit secrets; `.env` is local — update `.env.example` for new public vars only.
- Prefer small, focused diffs. No drive-by refactors.
- Do not create commits unless the user asks.

## Important routes

| Path | Notes |
|------|--------|
| `/` | Home |
| `/products/:id` | Product detail |
| `/cart` | Basket |
| `/checkout`, `/checkout/:orderId` | Order + mock pay |
| `/login`, `/register` | Auth |
| `/profile` | User profile (`PUT /me`) + orders |
| `/admin` | Admin shell |
| `/categories/:slug` | Products by category |
| `/search?q=` | Product search results |
| `/admin/products` | Product CRUD |
| `/admin/categories` | Category CRUD |
| `/admin/orders` | Order CRUD |
| `/admin/users` | User CRUD |

## Backend reference

Canonical contract: `../bahar-backend/internal/doc/swagger.yaml` (or the path the user provides).

Do not invent endpoints. If something is missing from the API (e.g. cart, payment gateway), keep it client-side or ask before adding backend assumptions.
