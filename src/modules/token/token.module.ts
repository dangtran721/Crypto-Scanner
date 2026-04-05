import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from '../auth/strategies';

@Module({
  imports: [JwtModule.register({}), UserModule],
  providers: [TokenService, JwtStrategy],
})
export class TokenModule {}
