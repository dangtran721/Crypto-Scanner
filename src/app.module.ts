import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TokenModule } from './modules/token/token.module';
import authConfig from './modules/auth/config/auth.config';
import appConfig from './common/config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig, authConfig] }),
    UserModule,
    PrismaModule,
    AuthModule,
    TokenModule,
  ],
})
export class AppModule {}
