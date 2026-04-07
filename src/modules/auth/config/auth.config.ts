import { registerAs } from '@nestjs/config';
import { z } from 'zod';
import { AuthConfig } from './auth-config.type';
const envSchema = z.object({
  JWT_SECRET: z.string().min(1),
  AUTH_ACCESS_TOKEN_EXPIRES_IN: z.coerce.number().default(15),
  AUTH_REFRESH_TOKEN_EXPIRES_IN: z.coerce.number().default(7),
});
export default registerAs<AuthConfig>('auth', () => {
  // validate and turn data into usable
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error(result.error.format());
    throw new Error('Invalid environment variables');
  }
  const envVars = result.data;
  return {
    secret: envVars.JWT_SECRET,
    expires: envVars.AUTH_ACCESS_TOKEN_EXPIRES_IN,
    refreshExpires: envVars.AUTH_REFRESH_TOKEN_EXPIRES_IN,
  };
});
