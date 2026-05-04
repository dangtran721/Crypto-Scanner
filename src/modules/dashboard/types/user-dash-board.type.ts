import { Prisma } from '@prisma/client';

export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    watchlists: { include: { items: true } };
    scanRules: true;
    scanJobs: { include: { scanRuns: { include: { results: true } } } };
  };
}>;
