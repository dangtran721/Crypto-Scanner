import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { AllTypeConfig } from 'src/common/config/config.type';
@Injectable()
export class RedisService {
  private readonly redis: Redis;

  constructor(private configService: ConfigService<AllTypeConfig>) {
    this.redis = new Redis({
      host: this.configService.getOrThrow('app.redisHost', {
        infer: true,
      }),

      port: this.configService.getOrThrow('app.redisPort', {
        infer: true,
      }),

      password: this.configService.get('app.redisPassword', { infer: true }),
    });
  }

  async get(key: string) {
    const rawValue = await this.redis.get(key);
    if (!rawValue) {
      return;
    }
    const jsonValue = JSON.parse(rawValue);
    return jsonValue;
  }

  async set(key: string, value: unknown, ttl?: number) {
    const jsonValue = JSON.stringify(value);

    if (ttl) {
      return this.redis.set(key, jsonValue, 'EX', ttl);
    }
    return this.redis.set(key, jsonValue);
  }

  async del(key: string) {
    return this.redis.del(key);
  }
}
