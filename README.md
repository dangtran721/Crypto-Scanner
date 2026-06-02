# Crypto Scanner Backend

Crypto Scanner is a NestJS backend for managing crypto watchlists, technical indicators, scan rules, scan jobs, persisted scan results, and a simulated realtime price stream.

The codebase currently has two main flows:

- REST scan flow: create user-owned resources, run scan jobs on demand, and persist scan runs/results.
- Realtime demo flow: generate mock price ticks and broadcast them through Socket.IO.

## Tech Stack

- NestJS 11
- TypeScript
- Prisma ORM 6
- PostgreSQL
- Redis
- Socket.IO
- Swagger/OpenAPI
- Docker Compose
- `technicalindicators`

## Features

- JWT auth with access and refresh tokens
- Refresh token persistence and logout blacklist
- User-scoped watchlists, indicators, scan rules, and scan jobs
- Watchlist item management with bulk insert support
- Rule-based scan execution against watchlist symbols
- Scan run/result persistence with old run cleanup
- Dashboard read model for user-owned resources
- Manual market data providers:
  - `mock`
  - `binance`
- Redis candle cache for manual scan data
- Simulated realtime mock price ticks over Socket.IO
- Swagger docs at `/docs`

## Current Status

Implemented:

- REST API for auth, watchlists, indicators, scan rules, scan jobs, and dashboard
- Manual scan job execution through `POST /scan-jobs/:id/run`
- Binance candle provider with fallback to mock data for the known region-block error
- Mock candle provider for scans
- Mock realtime stream provider for price ticks
- Socket.IO gateway under namespace `/scan`
- Local HTML realtime demo at `demo/realtime-client.html`

Not implemented yet:

- Realtime rule evaluation from live ticks
- Real `scan.live_result` and `scan.signal_triggered` workflow
- JWT authentication for Socket.IO rooms
- Hosted frontend for the HTML demo
- Meaningful automated test coverage

## Project Structure

```text
src/
  common/
    config/
    decorators/
    swagger/
    types/
    utils/
  modules/
    auth/
    dashboard/
    indicator/
    market-data/
    market-stream/
    realtime/
    redis/
    scan-jobs/
    scanrule/
    token/
    user/
    watchlists/
  prisma/
    seeds/
prisma/
  migrations/
  schema.prisma
demo/
  realtime-client.html
```

Key modules:

- `auth`: register, login, refresh, logout, and current-user endpoint
- `token`: refresh/access token persistence and blacklist helpers
- `watchlists`: user watchlists and watchlist items
- `indicator`: indicator config CRUD
- `scanrule`: JSON rule logic CRUD
- `scan-jobs`: job CRUD, scan execution, and result history
- `market-data`: candle providers for manual scans
- `market-stream`: simulated realtime tick source
- `realtime`: Socket.IO gateway and scan event emitter
- `dashboard`: aggregate read model for a user's resources
- `redis`: Redis connection service used by market data caching

## Data Model

Prisma models:

- `User`
- `Token`
- `Watchlist`
- `WatchlistItem`
- `Indicator`
- `ScanRule`
- `ScanJob`
- `ScanRun`
- `ScanResult`
- `Alert`

Supported enum values:

- Roles: `ADMIN`, `USER`
- Indicators: `RSI`, `EMA`, `ICHIMOKU`
- Scan job statuses: `PENDING`, `RUNNING`, `COMPLETED`, `FAILED`
- Alert types: `EMAIL`, `TELEGRAM`

## Environment Variables

Create `.env` from `.env.example`.

Example local config:

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

## Local Setup

Install dependencies:

```bash
npm install
```

Start PostgreSQL and Redis:

```bash
docker compose up -d
```

Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate:deploy
```

Seed demo data:

```bash
npm run seed
```

Start the app in watch mode:

```bash
npm run dev
```

Local URLs:

```text
API: http://localhost:3000
Swagger: http://localhost:3000/docs
Socket.IO namespace: http://localhost:3000/scan
```

## Seed Data

The seed script creates:

- demo user
- admin user
- `Top Coins` watchlist
- watchlist items: `BTCUSDT`, `ETHUSDT`, `BNBUSDT`, `SOLUSDT`, `XRPUSDT`
- demo EMA indicators
- demo scan rule

Demo user:

```text
email: demo@gmail.com
password: 123456
```

Admin user:

```text
email: admin@gmail.com
password: 123456
```

Note: user and watchlist seeds use upsert, but indicator and scan rule seeds currently insert new rows each run.

## API Overview

Most endpoints require:

```http
Authorization: Bearer <access_token>
```

Public endpoints:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`

Auth:

- `POST /auth/logout`
- `GET /auth/me`

Watchlists:

- `POST /watchlists`
- `GET /watchlists/me`
- `GET /watchlists/:id`
- `PATCH /watchlists/:id`
- `DELETE /watchlists/:id`
- `POST /watchlists/:id/item`
- `POST /watchlists/:id/items/bulk`
- `DELETE /watchlists/:id/items/:itemId`

Indicators:

- `POST /indicator`
- `GET /indicator`
- `GET /indicator/:id`
- `PATCH /indicator/:id`
- `DELETE /indicator/:id`

Scan rules:

- `POST /scan-rules`
- `GET /scan-rules`
- `GET /scan-rules/:id`
- `PATCH /scan-rules/:id`
- `DELETE /scan-rules/:id`

Scan jobs:

- `POST /scan-jobs`
- `GET /scan-jobs`
- `GET /scan-jobs/:id`
- `POST /scan-jobs/:id/run`
- `GET /scan-jobs/:id/results`

Dashboard:

- `GET /dash-board/me`

Swagger contains request/response DTO examples:

```text
http://localhost:3000/docs
```

## Manual Scan Flow

1. Register or log in.
2. Create a watchlist.
3. Add symbols to the watchlist.
4. Create indicators.
5. Create a scan rule.
6. Create a scan job.
7. Run the scan job.
8. Read saved scan results.

Create a scan job:

```http
POST /scan-jobs
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "scanRuleId": 1,
  "watchlistId": 1
}
```

Run a job:

```http
POST /scan-jobs/:id/run
Authorization: Bearer <access_token>
Content-Type: application/json
```

Use mock candles:

```json
{
  "type": "mock"
}
```

Use Binance candles:

```json
{
  "type": "binance"
}
```

The response includes:

```text
providerRequested
providerUsed
fallback
message
results
```

The scanner keeps the newest 5 runs per scan job and deletes older runs.

## Supported Rules

Supported scan operators:

- `lt`
- `gt`
- `cross_above`
- `cross_below`

Supported scanner operands:

- fixed numeric value
- indicator value

Supported scanner indicators:

- `EMA`
- `RSI`

`ICHIMOKU` exists in the indicator layer and Prisma enum, but the scanner runtime currently rejects it with `ICHIMOKU not supported in scanner yet`.

Example scan rule logic:

```json
{
  "type": "condition",
  "timeFrames": "1d",
  "operator": "cross_above",
  "left": {
    "type": "indicator",
    "indicatorId": 1
  },
  "right": {
    "type": "indicator",
    "indicatorId": 2
  }
}
```

## Realtime Demo

The realtime flow currently broadcasts simulated price ticks only.

Flow:

```text
MockStreamProvider
  -> MarketStreamService
  -> MarketStreamBridge
  -> ScanEventsService
  -> ScanGateway
  -> Socket.IO client
```

Socket.IO namespace:

```text
/scan
```

Connection event:

```text
scan.connected
```

Client join event:

```text
scan.join_user
```

Active broadcast event:

```text
scan.price_tick
```

Example payload:

```json
{
  "provider": "mock",
  "symbol": "BTCUSDT",
  "price": 68932.66,
  "updatedAt": "2026-06-02T15:51:06.579Z"
}
```

The stream uses distinct symbols from `watchlistItem`. If the database has no watchlist items, it falls back to:

```text
BTCUSDT
ETHUSDT
```

The bridge currently emits ticks to `user:1`, so the demo client must join user room `1`.

### Test Realtime Locally

Start dependencies and backend:

```bash
docker compose up -d
npm run dev
```

Open this file in a browser:

```text
demo/realtime-client.html
```

Use this server URL:

```text
http://localhost:3000/scan
```

Then click `Connect`.

### Test Railway Backend With Local Demo

The Railway deployment is backend-only. It does not serve the demo HTML page.

Open the local file:

```text
demo/realtime-client.html
```

Set the server URL input to:

```text
https://crypto-scanner-production-8ebe.up.railway.app/scan
```

Then click `Connect`.

Important:

- `/scan` is a Socket.IO namespace, not a REST route.
- Opening `/scan` directly in a browser can show `Cannot GET /scan`; that is expected.
- A Socket.IO handshake from `/socket.io/?EIO=4&transport=polling&nsp=%2Fscan` means the Socket.IO server is reachable.

## Scripts

```bash
npm run dev
npm run build
npm run start:prod
npm run prisma:generate
npm run prisma:migrate:deploy
npm run seed
npm run test
npm run test:e2e
npm run lint
npm run format
```

Script notes:

- `npm run build` runs `prisma generate` before `nest build`.
- `npm run start:prod` runs `prisma migrate deploy` before `node dist/main`.
- `npm run lint` uses `--fix`.
- `npm run test` looks for `*.spec.ts` under `src`.
- `npm run test:e2e` uses `test/jest-e2e.json`.

## Deployment

Production build:

```bash
npm run build
```

Production start:

```bash
npm run start:prod
```

Before deploying:

1. Set all environment variables.
2. Provision PostgreSQL.
3. Provision Redis.
4. Run Prisma migrations.
5. Seed demo data only if needed.

Railway backend:

```text
Swagger:
https://crypto-scanner-production-8ebe.up.railway.app/docs

Socket.IO namespace:
https://crypto-scanner-production-8ebe.up.railway.app/scan
```

The Railway URL is backend-only. Use the local HTML demo file to connect to its Socket.IO namespace.

## Known Limitations

- Realtime data is simulated, not live exchange data.
- Realtime currently emits price ticks only.
- Realtime scan result evaluation is not wired yet.
- `scan.live_result` and `scan.signal_triggered` gateway methods exist, but there is no live evaluation flow emitting them.
- Socket room joining trusts the client-provided `userId`.
- `ICHIMOKU` is not supported by scanner runtime yet.
- Binance can be blocked from some deployment regions; the scanner falls back to mock data for the known blocked-region error.
- Indicator and scan rule seeds can create duplicates when re-run.
- Automated tests are minimal.

## Portfolio Summary

Suggested wording:

```text
Built a NestJS crypto scanner backend with JWT auth, Prisma/PostgreSQL persistence, Redis candle caching, rule-based scan execution, Binance/mock market providers, persisted scan results, and a simulated Socket.IO realtime price stream.
```

## License

This project is for learning and portfolio purposes.
