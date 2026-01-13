import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

type LimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

class MemoryRatelimit {
  private store = new Map<string, number[]>();

  constructor(private limit: number, private windowMs: number) {}

  limitRequest(key: string): LimitResult {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const hits = this.store.get(key) ?? [];
    const recent = hits.filter((time) => time > windowStart);
    recent.push(now);
    this.store.set(key, recent);
    const remaining = Math.max(0, this.limit - recent.length);
    return {
      success: recent.length <= this.limit,
      limit: this.limit,
      remaining,
      reset: windowStart + this.windowMs
    };
  }
}

const fallback = {
  post: new MemoryRatelimit(5, 60 * 60 * 1000),
  vote: new MemoryRatelimit(50, 60 * 60 * 1000)
};

export function getRateLimiter() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    const redis = new Redis({ url, token });
    return {
      post: new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(5, '1 h') }),
      vote: new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(50, '1 h') })
    };
  }

  return {
    post: {
      limit: async (key: string) => fallback.post.limitRequest(key)
    },
    vote: {
      limit: async (key: string) => fallback.vote.limitRequest(key)
    }
  };
}
