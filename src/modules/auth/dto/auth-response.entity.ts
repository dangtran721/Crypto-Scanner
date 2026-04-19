import { Users } from 'src/modules/user/entities/user.entity';
import { TokenResponse } from '../types/auth-token-response.type';

export class AuthResponseDto {
  user: Users;
  token: TokenResponse;
}
