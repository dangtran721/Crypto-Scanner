import { registerAs } from '@nestjs/config';
import { z } from 'zod';
const envSchema = z.object({
  PORT: z.string().transform(Number).default('3000'),
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
  };
});
