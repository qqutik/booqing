import { Redis } from 'ioredis';
import { Injectable, type OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LockService implements OnModuleDestroy {
  private readonly redis: Redis;

  constructor(config: ConfigService) {
    this.redis = new Redis({
      host: config.getOrThrow<string>('REDIS_HOST'),
      port: config.getOrThrow<number>('REDIS_PORT'),
    });
  }

  public async runExclusive(
    key: string,
    ttlMs: number,
    task: () => Promise<void>,
  ) {
    const acquired = await this.redis.set(
      `lock:${key}`,
      '1',
      'PX',
      ttlMs,
      'NX',
    );
    if (acquired !== 'OK') {
      return;
    }
    await task();
  }

  public async onModuleDestroy() {
    await this.redis.quit();
  }
}
