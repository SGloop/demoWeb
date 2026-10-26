# Project Context: Modern E-Commerce Platform

## 1. System Architecture
* **Frontend**: React 18 SPA powered by Vite, TypeScript, Tailwind CSS, Zustand, and React Router.
* **Backend**: Node.js & Express RESTful API with TypeScript in a layered architecture (Controllers -> Services -> Repositories/Prisma).
* **Database**: PostgreSQL managed with Prisma ORM for relational schema integrity, migrations, and type-safe queries.
* **Cache & Rate Limiting**: Redis for session storage, caching, and request rate limiting.
* **Payments**: Stripe API with Stripe Elements for client-side tokenization and signed webhooks for idempotent order fulfillment.

## 2. Core Domain Models
* **User**: `id`, `email`, `passwordHash`, `name`, `role` (`CUSTOMER` | `ADMIN`), `createdAt`, `updatedAt`
* **Category**: `id`, `name`, `slug`, `description`
* **Product**: `id`, `title`, `slug`, `description`, `price` (cents), `inventoryCount`, `imageUrl`, `categoryId`
* **Order**: `id`, `userId`, `status` (`PENDING` | `PAID` | `SHIPPED` | `DELIVERED` | `CANCELLED`), `totalAmount` (cents), `paymentIntentId`, `shippingAddress`
* **OrderItem**: `id`, `orderId`, `productId`, `unitPrice` (cents), `quantity`

## 3. Security Requirements
* **PCI Compliance**: Credit card data is never processed or stored directly on the server; Stripe Elements handles sensitive details client-side.
* **Authentication**: HTTP-only, SameSite, Secure cookies with JWT tokens (short-lived access token + rotating refresh token).
* **Input Validation**: Strict schema validation using Zod on both client and API request payloads.
* **Rate Limiting**: Rate limiters applied to authentication, cart modifications, and checkout endpoints.
* **Environment Secrets**: All credentials (Stripe keys, database URLs, JWT secrets) managed via environment variables.

## 4. Development Phases
* [x] **Phase 1: Foundation & Baseline** - Scaffold repository, configuration, database schema, Docker Compose, and client/server shells.
* [x] **Phase 2: Product Catalog & Authentication** - Database schema, seed data, JWT auth flow (register, login, me, logout), product browsing, category filtering, search, and frontend views.
* [x] **Phase 3: Cart & Checkout** - Client shopping cart page, server-side price validation, Stripe PaymentIntent creation, Stripe Elements checkout form, webhook fulfillment, and order history views.
* [ ] **Phase 4: Admin Management** - Admin dashboard for inventory, products, and order status updates.
* [ ] **Phase 5: Testing & Production CI/CD** - Automated tests (Vitest, Supertest, Playwright) and GitHub Actions pipeline.
