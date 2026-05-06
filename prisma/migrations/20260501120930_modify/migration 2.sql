-- DropForeignKey
ALTER TABLE "scan_results" DROP CONSTRAINT "scan_results_run_id_fkey";

-- AddForeignKey
ALTER TABLE "scan_results" ADD CONSTRAINT "scan_results_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "scan_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
