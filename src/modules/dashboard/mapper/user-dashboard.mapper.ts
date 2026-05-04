import { UserDashBoardDto } from '../dto/dashboard.dto';
import { UserWithRelations } from '../types/user-dash-board.type';

export function toUserDashboardDto(user: UserWithRelations): UserDashBoardDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,

    watchlists: user.watchlists.map((list) => ({
      id: list.id,
      name: list.name,
      itemCount: list.items.length,
      items: list.items.map((i) => i.coinSymbol),
    })),

    scanRules: user.scanRules.map((rule) => ({
      id: rule.id,
      logic: rule.logic,
    })),

    scanJobs: user.scanJobs.map((job) => ({
      id: job.id,
      status: job.status,
      runs: job.scanRuns.map((run) => ({
        id: run.id,
        createdAt: run.createdAt,
        results: run.results,
      })),
    })),
  };
}
