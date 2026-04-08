import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from '../auth/strategies';
import { ConfigService } from '@nestjs/config';
import { AllTypeConfig } from 'src/common/config/config.type';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllTypeConfig>) => ({
        secret: configService.getOrThrow('auth.secret', { infer: true }),
      }),
    }),
    UserModule,
  ],
  providers: [TokenService, JwtStrategy],
  exports: [TokenService],
})
export class TokenModule {}
