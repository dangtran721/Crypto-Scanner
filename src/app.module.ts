import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenModule } from './modules/token/token.module';
import authConfig from './modules/auth/config/auth.config';
import appConfig from './common/config/app.config';
import { JwtModule } from '@nestjs/jwt';
import { WatchlistsModule } from './modules/watchlists/watchlists.module';
import { IndicatorModule } from './modules/indicator/indicator.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig, authConfig] }),
    UserModule,
    PrismaModule,
    AuthModule,
    TokenModule,
    WatchlistsModule,
    IndicatorModule,
  ],
})
export class AppModule {}
