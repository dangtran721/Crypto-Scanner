# Crypto Scanner Backend

Rule-based crypto scanning backend built with NestJS, Prisma, PostgreSQL, Redis, and Swagger.

The project lets users manage watchlists, technical indicators, scan rules, scan jobs, scan runs, and scan results. It supports market data providers through an abstraction layer with `mock` and `binance` implementations.

## Tech Stack

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- Swagger
- Docker Compose

## Features

- JWT authentication and token-based auth flow
- User ownership validation on private resources
- Watchlist CRUD and watchlist items management
- Indicator CRUD with validation
- Scan rule CRUD using JSON-based rule logic
- Scan job creation and scan execution
- Scan run and scan result persistence
- Dashboard read model for aggregated user data
- Market data abstraction with:
  - `mock` provider
  - `binance` provider
- Redis candle caching by provider / symbol / timeframe
- Swagger docs at `/docs`

## Current Scanner Flow

1. Create a scan job
2. Run the job with a provider type such as `mock` or `binance`
3. Load watchlist, scan rule, and indicators
4. Fetch candles from the selected market data provider
5. Evaluate the rule for each symbol
6. Create a scan run
7. Save scan results
8. Update scan job status
9. Read historical run results

## Supported Rule Operators

- `lt`
- `gt`
- `cross_above`
- `cross_below`

## Supported Indicators

- `EMA`
- `RSI`
- `ICHIMOKU`

Note:

- `ICHIMOKU` exists at the indicator layer, but scanner runtime currently blocks it.

## Project Structure

```text
src/
  common/
  modules/
    auth/
    dashboard/
    indicator/
    market-data/
    redis/
    scan-jobs/
    scanrule/
    token/
    user/
    watchlists/
  prisma/
prisma/
```

## Environment Variables

Create a `.env` file from `.env.example` and fill in the values.

Required variables:

```env
PORT=3000

AUTH_JWT_SECRET=your-secret
AUTH_ACCESS_TOKEN_EXPIRES_IN=15
AUTH_REFRESH_TOKEN_EXPIRES_IN=7

DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=crypto_scanner

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/crypto_scanner?schema=public
```

Notes:

- `AUTH_ACCESS_TOKEN_EXPIRES_IN` and `AUTH_REFRESH_TOKEN_EXPIRES_IN` are parsed as numbers.
- `REDIS_PASSWORD` is optional for local Docker, but useful for cloud Redis providers.

## Local Setup

Install dependencies:

```bash
npm install
```

Start PostgreSQL and Redis:

```bash
docker compose up -d
```

Run Prisma migrations:

```bash
npx prisma migrate deploy
```

Seed demo data:

```bash
npm run seed
```

Start the app in development mode:

```bash
npm run dev
```

App URL:

```text
http://localhost:3000
```

Swagger URL:

```text
http://localhost:3000/docs
```

## Available Scripts

```bash
npm run dev
npm run build
npm run start:prod
npm run seed
npm run test
npm run test:e2e
npm run lint
```

## Demo Seed Data

The current seed creates demo records for:

- demo user
- admin user
- watchlist
- watchlist items
- indicators
- scan rule

Seed order:

1. users
2. admin
3. watchlist
4. watchlist items
5. indicators
6. scan rule

Important:

- Seed data is intended for local/demo bootstrap.
- Some seeded IDs are still assumed explicitly in the seed flow, so a completely fresh database is the safest way to use the current seed set.

## Main API Areas

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `GET /auth/me`

### Watchlists

- `POST /watchlists`
- `GET /watchlists/me`
- `GET /watchlists/:id`
- `PATCH /watchlists/:id`
- `DELETE /watchlists/:id`
- `POST /watchlists/:id/item`
- `POST /watchlists/:id/items/bulk`
- `DELETE /watchlists/:id/items/:itemId`

### Indicators

- `POST /indicator`
- `GET /indicator`
- `GET /indicator/:id`
- `PATCH /indicator/:id`
- `DELETE /indicator/:id`

### Scan Rules

- `POST /scan-rules`
- `GET /scan-rules`
- `GET /scan-rules/:id`
- `PATCH /scan-rules/:id`
- `DELETE /scan-rules/:id`

### Scan Jobs

- `POST /scan-jobs`
- `GET /scan-jobs`
- `GET /scan-jobs/:id`
- `POST /scan-jobs/:id/run`
- `GET /scan-jobs/:id/results`

### Dashboard

- `GET /dash-board/me`

## Example End-to-End Flow

1. Register or log in
2. Create a watchlist
3. Add symbols to the watchlist
4. Create indicators
5. Create a scan rule
6. Create a scan job
7. Run the job with:

```json
{
  "type": "mock"
}
```

or:

```json
{
  "type": "binance"
}
```

8. Read scan results from `GET /scan-jobs/:id/results`

## Market Data Notes

- `mock` provider is useful for local demos and fallback scenarios.
- `binance` provider fetches real candlestick data from `api.binance.com`.
- Binance may return `451` in some deployment regions.

Current codebase note:

- The run-job response type already includes:
  - `providerRequested`
  - `providerUsed`
  - `fallback`
  - `message`
  - `results`
- If deployed in a region where Binance is blocked, the fallback flow should be handled carefully so the scanner still receives plain `Candle[]`.

## Deploy Notes

This project can be deployed to platforms such as Railway.

Before deploying:

1. Set all environment variables on the platform
2. Provision PostgreSQL and Redis
3. Run database migrations
4. Seed only if you want demo data

Suggested production commands:

Build:

```bash
npm run build
```

Start:

```bash
npm run start:prod
```

## Known Limitations

- Scanner runtime currently blocks `ICHIMOKU`
- Binance access may be region-blocked in some cloud deployments
- Seed data is best used on a fresh database
- Swagger examples are not yet fully curated for every endpoint
- There are still local changes in progress around market-data fallback and run-job response behavior

## License

This project is for learning and portfolio purposes.
