import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().transform(Number).default('3000'),

  // Redis mode
  USE_UPSTASH: z.enum(['true', 'false']).default('false'),

  // Local Redis
  REDIS_PORT: z.string().transform(Number).optional(),
  REDIS_HOST: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),

  // Upstash Redis
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
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

    redis: {
      useUpstash: envVars.USE_UPSTASH === 'true',

      local: {
        host: envVars.REDIS_HOST,
        port: envVars.REDIS_PORT,
        password: envVars.REDIS_PASSWORD,
      },

      upstash: {
        url: envVars.UPSTASH_REDIS_REST_URL,
        token: envVars.UPSTASH_REDIS_REST_TOKEN,
      },
    },
  };
});
