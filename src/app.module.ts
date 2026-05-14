import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TokenModule } from './modules/token/token.module';
import authConfig from './modules/auth/config/auth.config';
import appConfig from './common/config/app.config';
import { WatchlistsModule } from './modules/watchlists/watchlists.module';
import { IndicatorModule } from './modules/indicator/indicator.module';
import { ScanruleModule } from './modules/scanrule/scanrule.module';
import { ScanJobsModule } from './modules/scan-jobs/scan-jobs.module';
import { MarketDataModule } from './modules/market-data/market-data.module';
import { DashBoardModule } from './modules/dashboard/dashboard.module';
import { UserModule } from './modules/user/user.module';
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig, authConfig] }),
    UserModule,
    PrismaModule,
    AuthModule,
    TokenModule,
    WatchlistsModule,
    IndicatorModule,
    ScanruleModule,
    ScanJobsModule,
    MarketDataModule,
    DashBoardModule,
    RedisModule,
  ],
})
export class AppModule {}
