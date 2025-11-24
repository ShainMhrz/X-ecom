# Family Store E-Commerce (Scalable Architecture)

This project is a Next.js (App Router) e-commerce platform architected to start as a **single product store** and evolve into a **multi-category marketplace** with minimal refactoring. It emphasizes clean architecture, storage-agnostic design, and a dynamic theming engine.

## Tech Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS (CSS Variables mapped in `tailwind.config.ts`)
- Zustand (cart + theme state)
- Prisma + PostgreSQL
- React Hook Form + Zod (forms + validation)
- Shadcn/UI compatible styling utilities (can be added)

## Architecture Overview
```
src/
	app/
		(shop)/
			layout.tsx
			page.tsx
			product/[slug]/page.tsx
			category/[slug]/page.tsx
			cart/page.tsx
		(admin)/
			layout.tsx
			dashboard/page.tsx
			products/
				page.tsx
				new/page.tsx
				[id]/edit/page.tsx
			variants/[productId]/page.tsx
			themes/page.tsx
			orders/
				page.tsx
				[id]/page.tsx
	server/
		db/prisma.ts
		repositories/product.repository.ts
		services/product.service.ts
		services/storage/
			storage.interface.ts
			storage.service.ts
			providers/
				local.provider.ts
				s3.provider.ts
	lib/state/
		cartStore.ts
		themeStore.ts
	ui/providers/ThemeProvider.tsx
	prisma/
		schema.prisma
		seed.ts
```

## Storage Agnostic Design
Environment variable `STORAGE_DRIVER` selects implementation (`local` | `s3`). Code consuming storage uses `StorageService` which proxies the selected provider implementing `IStorageProvider`.

Switch provider:
```env
STORAGE_DRIVER=local
# or
STORAGE_DRIVER=s3
```
No component or business logic changes required.

## Dynamic Theme Engine
Themes are stored in Zustand (`themeStore.ts`) and injected at runtime by `ThemeProvider`, applying CSS variables to `:root`. Tailwind references these via `tailwind.config.ts`. Additional themes can be registered dynamically or persisted in the database (see `ThemeSetting` model and seed script).

## Database Schema Highlights
- `Product` generic parent; `ProductVariant` holds SKU-specific data.
- `ProductOption` / `ProductOptionValue` model flexible option axes (Color, Material, Size, etc.).
- `ProductVariantOptionValue` join maps variant -> option values (supports arbitrary combinations).
- `isFeatured` flag enables curated marketing exposure without structural changes.
- `ThemeSetting` + `SiteConfig` enable DB-driven active theme selection.
- Order workflow via `OrderStatus` enum (`PENDING -> SHIPPED -> DELIVERED` / `CANCELLED`).

## Getting Started
### 1. Install Dependencies
```powershell
npm install
```

### 2. Environment Variables
Create `.env`:
```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DBNAME
STORAGE_DRIVER=local
CDN_BASE_URL=https://cdn.example.com # optional for s3
```

### 3. Prisma Setup
```powershell
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts
```
(Install `ts-node` globally or add as dev dep if preferred.)

### 4. Run Dev Server
```powershell
npm run dev
```

### 5. Admin Access
Set a cookie `role=ADMIN` manually (placeholder auth). Middleware blocks `/ (admin)` routes if role mismatch. Integrate real auth later (NextAuth, custom, etc.).

## Extending
- Add new storage provider: implement `IStorageProvider`, add case in `storage.service.ts`.
- Add theme in DB: insert into `ThemeSetting`, toggle `active` and update `SiteConfig.activeThemeId`.
- Add product option axis: create new `ProductOption` + values; variants can include them without schema changes.

## Roadmap Suggestions
- Replace placeholder S3 provider with AWS SDK v3 integration.
- Form components using RHF + Zod for product/variant editing.
- Image uploads via route handlers using `StorageService.uploadFile`.
- Public-facing category navigation + search.
- Caching layer (Edge / Redis) for product listing performance.

## Scripts
- `npm run dev` — start Next.js
- `npm run build` — production build
- `npm run start` — start built app
- `npx prisma studio` — inspect DB

## Reliability Notes
- Single source of truth via Prisma models.
- All variant option combinations explicitly persisted (no dynamic Cartesian explosion at runtime).
- Storage abstraction prevents vendor lock-in.

## License
Private / Family Business Use.
