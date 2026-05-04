import { WatchlistDto } from './watchlist.dto';
import { ScanRuleDto } from './scanrule.dto';
import { ScanJobDto } from './scanjob.dto';

export class UserDashBoardDto {
  id: number;
  email: string;
  name: string | null;

  watchlists: WatchlistDto[];
  scanRules: ScanRuleDto[];
  scanJobs: ScanJobDto[];
}
