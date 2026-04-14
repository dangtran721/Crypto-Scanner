/*
  Warnings:

  - A unique constraint covering the columns `[watchlist_id,coin_symbol]` on the table `watchlist_item` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "watchlist_item" DROP CONSTRAINT "watchlist_item_watchlist_id_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "watchlist_item_watchlist_id_coin_symbol_key" ON "watchlist_item"("watchlist_id", "coin_symbol");

-- AddForeignKey
ALTER TABLE "watchlist_item" ADD CONSTRAINT "watchlist_item_watchlist_id_fkey" FOREIGN KEY ("watchlist_id") REFERENCES "watchlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
