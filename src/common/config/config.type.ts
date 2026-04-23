import { AuthConfig } from 'src/modules/auth/config/auth-config.type';
import { AppConfig } from './app-config.type';

export type AllTypeConfig = {
  app: AppConfig;
  auth: AuthConfig;
};
