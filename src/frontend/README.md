# Mille.Ecommerce — Frontend (Admin Dashboard)

An admin dashboard for the Mille.Ecommerce backend, built with **Vue 3 + TypeScript**. Lets store admins manage categories, products, and orders through a protected, JWT-authenticated interface.

> Status: in progress. Category, product, and order management screens are done; the customer-facing storefront (browsing, cart, checkout) is planned next.

## Tech Stack

| Concern | Technology |
|---|---|
| Framework | Vue 3 (Composition API) + TypeScript |
| Build tool | Vite |
| State management | Pinia |
| Routing | Vue Router, with navigation guards for protected routes |
| UI components | shadcn-vue (built on [reka-ui](https://reka-ui.com)) |
| Styling | Tailwind CSS 4 |
| Forms & validation | TanStack Form + Zod |
| HTTP client | Axios, with interceptors for JWT injection and automatic token refresh |
| Icons / toasts | lucide-vue-next, vue-sonner |
| Utilities | VueUse |

## Project Structure

```
src/
├── modules/                  Feature modules — each owns its slice of the app
│   ├── auth/                 Login, register, change password, logout
│   │   ├── views/            Page-level components (LoginView, RegisterView)
│   │   ├── stores/           Pinia auth store (tokens, session state)
│   │   ├── services/         API calls (authService)
│   │   ├── composables/      useLogin, useRegister, useLogout, useChangePassword
│   │   └── types/
│   ├── categories/           Category CRUD (list, create/edit/delete dialogs)
│   ├── products/             Product CRUD (list, create/edit/delete/detail dialogs)
│   ├── orders/                Order list, detail, status update, confirm payment
│   └── users/                 Profile, address management, avatar upload
├── shared/
│   ├── layouts/               AdminLayout (authenticated shell), AuthLayout (login/register)
│   ├── components/            Shared components (Home, NavLinks)
│   ├── services/               Configured Axios instance (axios.ts)
│   ├── constants/ · types/ · utils/
├── components/ui/              shadcn-vue components (button, dialog, form, table, sidebar, ...)
├── router/                     Route definitions + auth guard
└── lib/                         Shared helpers (cn/class utilities)
```

Each feature module follows the same internal shape: `views` (pages), `components` (dialogs/widgets specific to the feature), `composables` (data-fetching/mutation hooks), `services` (API calls), and `types`.

## Key Implementation Details

- **Auth & session:** the Pinia `authStore` holds the access/refresh tokens and current user; routes with `meta: { requiresAuth: true }` are guarded in `router/index.ts`, redirecting to `/login` when there's no valid session.
- **Automatic token refresh:** the shared Axios instance attaches the access token to every request and, on a `401` response, transparently calls the refresh-token endpoint and retries the original request once — falling back to logging the user out if the refresh also fails.
- **Forms:** built with TanStack Form and validated with Zod schemas per module (e.g. category, product, address forms).
- **UI:** shadcn-vue components (button, dialog, form, table, sidebar, sheet, skeleton, etc.) styled with Tailwind CSS for a consistent admin UI.

## Current Screens

| Screen | Status |
|---|---|
| Login / Register | ✅ |
| Category list (create / edit / delete) | ✅ |
| Product list (create / edit / delete / detail) | ✅ |
| Order list (detail, update status, confirm payment) | ✅ |
| User profile & address management | ✅ (composables ready; screen wiring in progress) |
| Customer-facing storefront (browse, cart, checkout) | ⬜ Planned |

## Getting Started

```bash
npm install
```

Create a `.env` file with the backend API URL:

```
VITE_BASE_API_URL=https://localhost:{port}/api
```

### Development

```bash
npm run dev
```

### Type-check, build & preview

```bash
npm run build
npm run preview
```

## Related

- Backend API: [`../backend/Mille`](../backend/Mille) — ASP.NET Core Web API (Clean Architecture)
- Project overview: [root README](../../README.md)
