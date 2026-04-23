-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "IndicatorType" AS ENUM ('RSI', 'EMA', 'ICHIMOKU');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('EMAIL', 'TELEGRAM');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('REFRESH', 'ACCESS', 'RESET_PASSWORD');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indicators" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" "IndicatorType" NOT NULL,
    "config" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "indicators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scan_rules" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "indicator_id" INTEGER NOT NULL,
    "logic" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scan_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "watchlist" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "watchlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "watchlist_item" (
    "id" SERIAL NOT NULL,
    "watchlist_id" INTEGER NOT NULL,
    "coin_symbol" TEXT NOT NULL,

    CONSTRAINT "watchlist_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scan_jobs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "scan_rule_id" INTEGER NOT NULL,
    "watchlist_id" INTEGER NOT NULL,
    "status" "Status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scan_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scan_results" (
    "id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "coin_symbol" TEXT NOT NULL,
    "result" JSONB NOT NULL,
    "is_valid_setup" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scan_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "scan_rule_id" INTEGER NOT NULL,
    "type" "AlertType" NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "blacklisted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_token_key" ON "tokens"("token");

-- AddForeignKey
ALTER TABLE "indicators" ADD CONSTRAINT "indicators_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_rules" ADD CONSTRAINT "scan_rules_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_rules" ADD CONSTRAINT "scan_rules_indicator_id_fkey" FOREIGN KEY ("indicator_id") REFERENCES "indicators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watchlist_item" ADD CONSTRAINT "watchlist_item_watchlist_id_fkey" FOREIGN KEY ("watchlist_id") REFERENCES "watchlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_jobs" ADD CONSTRAINT "scan_jobs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_jobs" ADD CONSTRAINT "scan_jobs_scan_rule_id_fkey" FOREIGN KEY ("scan_rule_id") REFERENCES "scan_rules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_jobs" ADD CONSTRAINT "scan_jobs_watchlist_id_fkey" FOREIGN KEY ("watchlist_id") REFERENCES "watchlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_results" ADD CONSTRAINT "scan_results_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "scan_jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_scan_rule_id_fkey" FOREIGN KEY ("scan_rule_id") REFERENCES "scan_rules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
