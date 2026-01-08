import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const memoryStore = new Map<string, { count: number; resetAt: number }>();

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

export async function rateLimit(key: string, max: number, windowMs: number) {
  if (redis) {
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(max, `${Math.max(1, Math.floor(windowMs / 60000))} m`)
    });
    const result = await limiter.limit(key);
    return {
      success: result.success,
      remaining: result.remaining,
      resetAt: result.reset
    };
  }

  const now = Date.now();
  const existing = memoryStore.get(key);
  if (!existing || existing.resetAt < now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: max - 1, resetAt: now + windowMs };
  }

  if (existing.count >= max) {
    return { success: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { success: true, remaining: max - existing.count, resetAt: existing.resetAt };
}
