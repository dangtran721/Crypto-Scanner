import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
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
import { ScannerModule } from './modules/scanner/scanner.module';

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
    ScannerModule,
  ],
})
export class AppModule {}
