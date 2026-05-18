import { registerAs } from '@nestjs/config';
import { z } from 'zod';
const envSchema = z.object({
  PORT: z.string().transform(Number).default('3000'),
  REDIS_PORT: z.string().transform(Number).default('6379'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PASSWORD: z.string(),
});
export default registerAs('app', () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error(result.error.format());
    throw new Error('Invalid environment variables');
  }
  const envVars = result.data;
  return {
    port: envVars.PORT,
    redisPort: envVars.REDIS_PORT,
    redisHost: envVars.REDIS_HOST,
    redisPassword: envVars.REDIS_PASSWORD,
  };
});
