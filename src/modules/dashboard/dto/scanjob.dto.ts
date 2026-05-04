import { ScanResult, Status } from '@prisma/client';

export type ScanJobDto = {
  id: number;
  status: Status;
  runs: {
    id: number;
    createdAt: Date;
    results: ScanResult[];
  }[];
};
