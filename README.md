# Mille.Ecommerce

An e-commerce system built as a solo learning project, consisting of a **.NET 10 Web API backend** (Clean Architecture) and a **Vue 3 + TypeScript admin dashboard** frontend.

> Status: actively in development. Backend core modules (auth, catalog, cart, orders, COD payment) are done; frontend admin dashboard is in progress; customer-facing storefront, product reviews, coupons, and additional payment gateways are planned next.

---

## Overview

Mille.Ecommerce is a personal project built to practice designing and implementing a realistic e-commerce backend using enterprise-grade patterns and tools, paired with an admin dashboard to manage the store.

- **Backend:** `src/backend/Mille` — ASP.NET Core Web API, Clean Architecture, EF Core, JWT auth, FluentValidation, Serilog, Cloudinary, Scalar.
- **Frontend:** `src/frontend/mille-ecommerce` — Vue 3, TypeScript, Vite, Pinia, Vue Router, Tailwind CSS, shadcn-vue (reka-ui).

## Tech Stack

### Backend

| Concern              | Technology                                                                   |
| -------------------- | ---------------------------------------------------------------------------- |
| Language / Framework | C#, ASP.NET Core (.NET 10)                                                   |
| ORM                  | Entity Framework Core 10 (SQL Server)                                        |
| Architecture         | Clean Architecture (Domain / Application / Infrastructure / Api), no MediatR |
| Authentication       | JWT (access token + refresh token), BCrypt password hashing                  |
| Validation           | FluentValidation                                                             |
| File storage         | Cloudinary (product images, avatars)                                         |
| API docs / testing   | Scalar                                                                       |
| DI helper            | Scrutor                                                                      |

### Frontend

| Concern            | Technology                          |
| ------------------ | ----------------------------------- |
| Framework          | Vue 3 + TypeScript (Vite)           |
| State management   | Pinia                               |
| Routing            | Vue Router (with auth guards)       |
| UI                 | shadcn-vue (reka-ui) + Tailwind CSS |
| Forms & validation | TanStack Form + Zod                 |
| HTTP client        | Axios                               |

## Architecture

The backend follows **Clean Architecture**, split into four projects:

```
Mille.Domain          → Entities, enums, business rules (no dependencies)
Mille.Application     → Feature-based use cases (Auth, Users, Categories,
                         Products, Carts, Orders), DTOs, validators,
                         interfaces — organized by feature, without MediatR
Mille.Infrastructure  → EF Core, repositories, JWT/BCrypt services,
                         Cloudinary integration
Mille.Api             → Controllers, middleware, dependency injection,
                         request/response handling
```

Business rules live inside domain entities rather than in services — e.g. an `Order` only allows status transitions in a valid sequence (`Pending → Confirmed → Shipping → Completed`, or `Cancelled`), and every transition is recorded in an order status history.

The frontend is organized by feature module (`auth`, `categories`, `products`, `orders`, `users`), each with its own `views`, `components`, `services`, `composables`, and `types`.

## Features

Status: ✅ Done · 🚧 In Progress · ⬜ Planned

### Authentication & User

| Feature                                           | Status |
| ------------------------------------------------- | ------ |
| Register / Login (JWT access + refresh token)     | ✅     |
| Refresh token / Logout                            | ✅     |
| Change password                                   | ✅     |
| Get / update profile                              | ✅     |
| Manage shipping addresses (add / update / delete) | ✅     |
| Upload avatar (Cloudinary)                        | ✅     |

### Catalog

| Feature                                               | Status |
| ----------------------------------------------------- | ------ |
| Category CRUD (with soft delete / restore)            | ✅     |
| Product CRUD                                          | ✅     |
| Product variants (SKU, size, color, price, stock)     | ✅     |
| Product images (multiple images, thumbnail selection) | ✅     |

### Cart & Orders

| Feature                                         | Status |
| ----------------------------------------------- | ------ |
| View / add / update / remove cart items         | ✅     |
| Create order from cart                          | ✅     |
| Get order(s) by id / by user                    | ✅     |
| Cancel order                                    | ✅     |
| Update order status with status history (Admin) | ✅     |

### Payment

| Feature                             | Status |
| ----------------------------------- | ------ |
| Cash on Delivery (COD) flow         | ✅     |
| Confirm payment on delivery (Admin) | ✅     |
| VNPay integration                   | ⬜     |
| Stripe integration                  | ⬜     |

### Planned

| Feature                                         | Status |
| ----------------------------------------------- | ------ |
| Product reviews & ratings                       | ⬜     |
| Coupons / discount codes                        | ⬜     |
| Customer-facing storefront (cart & checkout UI) | 🚧     |
| Redis caching                                   | ⬜     |
| Docker containerization                         | ⬜     |

## Getting Started

### Backend

```bash
cd src/backend/Mille

# Configure Mille.Api/appsettings.json (or user-secrets) with:
# - ConnectionStrings:DefaultConnection   (SQL Server)
# - JwtSettings:SecretKey / Issuer / Audience
# - CloudinarySettings (CloudName, ApiKey, ApiSecret)

dotnet ef database update --project Mille.Infrastructure --startup-project Mille.Api
dotnet run --project Mille.Api
```

API reference is available via Scalar at `/scalar` when running in Development.

### Frontend

```bash
cd src/frontend/mille-ecommerce
npm install
npm run dev
```

## Roadmap

```
1. Auth + User/Address                    ✅ Done
2. Category + Product + Variant + Image   ✅ Done
3. Cart                                   ✅ Done
4. Order                                  ✅ Done
5. Payment (COD)                          ✅ Done
6. Admin dashboard (frontend)             🚧 In Progress
7. Customer-facing storefront             ⬜ Planned
8. Product reviews                        ⬜ Planned
9. Coupons                                ⬜ Planned
10. VNPay / Stripe integration            ⬜ Planned
11. Redis caching                         ⬜ Planned
12. Docker containerization                ⬜ Planned
```

## Author

**Tran Minh Thanh | Niyaa1786**
[GitHub](https://github.com/Niyaa1786) · [LinkedIn](https://www.linkedin.com/in/tr%E1%BA%A7n-minh-th%C3%A0nh-b56a40385/)
