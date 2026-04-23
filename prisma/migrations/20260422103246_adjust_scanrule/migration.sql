/*
  Warnings:

  - You are about to drop the column `indicator_id` on the `scan_rules` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "scan_rules" DROP CONSTRAINT "scan_rules_indicator_id_fkey";

-- AlterTable
ALTER TABLE "scan_rules" DROP COLUMN "indicator_id";
