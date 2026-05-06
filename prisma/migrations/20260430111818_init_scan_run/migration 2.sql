/*
  Warnings:

  - You are about to drop the column `job_id` on the `scan_results` table. All the data in the column will be lost.
  - Added the required column `run_id` to the `scan_results` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "scan_results" DROP CONSTRAINT "scan_results_job_id_fkey";

-- AlterTable
ALTER TABLE "scan_results" DROP COLUMN "job_id",
ADD COLUMN     "run_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "scan_runs" (
    "id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scan_runs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "scan_results" ADD CONSTRAINT "scan_results_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "scan_runs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_runs" ADD CONSTRAINT "scan_runs_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "scan_jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
