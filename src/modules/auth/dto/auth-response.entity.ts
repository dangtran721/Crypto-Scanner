import { TokenResponse } from 'src/common/types';
import { Users } from 'src/modules/user/entities/user.entity';

export class AuthResponseDto {
  user: Users;
  token: TokenResponse;
}
