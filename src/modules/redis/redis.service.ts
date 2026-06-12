import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { Redis as UpstashRedis } from '@upstash/redis';
import { AllTypeConfig } from 'src/common/config/config.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private redis: Redis | UpstashRedis;
  private readonly useUpstash: boolean;

  constructor(private configService: ConfigService<AllTypeConfig>) {
    this.useUpstash = this.configService.getOrThrow('app.redis.useUpstash', {
      infer: true,
    });

    const redisConfig = this.configService.getOrThrow('app.redis', {
      infer: true,
    });

    if (this.useUpstash) {
      this.redis = new UpstashRedis({
        url: redisConfig.upstash?.url,
        token: redisConfig.upstash?.token,
      });
    } else {
      this.redis = new Redis({
        host: redisConfig.local?.host,
        port: redisConfig.local?.port,
        password: redisConfig.local?.password,
      });
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);

    if (!value) return null;

    if (typeof value === 'string') {
      return JSON.parse(value);
    }

    return value as T;
  }

  async set(key: string, value: unknown, ttl?: number) {
    const json = JSON.stringify(value);

    if (this.useUpstash) {
      const client = this.redis as UpstashRedis;

      return ttl ? client.set(key, json, { ex: ttl }) : client.set(key, json);
    }

    const client = this.redis as Redis;
    return ttl ? client.set(key, json, 'EX', ttl) : client.set(key, json);
  }

  async del(key: string) {
    return this.redis.del(key);
  }
}
