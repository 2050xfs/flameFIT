import { Redis } from '@upstash/redis';

let redis: Redis | null = null;

function getRedis(): Redis | null {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
    if (!redis) {
        redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
    }
    return redis;
}

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetIn: number; // seconds until window resets
}

/**
 * Sliding-window rate limiter backed by Upstash Redis.
 * Falls back to allowing all requests if Redis is unavailable.
 *
 * @param key     Unique key, e.g. `chat:${userId}` or `generate:${userId}`
 * @param limit   Max requests allowed within the window
 * @param window  Window duration in seconds (default 60)
 */
export async function rateLimit(
    key: string,
    limit: number,
    window = 60,
): Promise<RateLimitResult> {
    const client = getRedis();
    if (!client) {
        // Redis not configured — allow request, log warning
        console.warn('[rate-limit] Redis unavailable, skipping rate limit check');
        return { allowed: true, remaining: limit - 1, resetIn: window };
    }

    try {
        const redisKey = `rl:${key}`;
        const count = await client.incr(redisKey);

        // Set TTL only on the first increment (avoids resetting the window)
        if (count === 1) {
            await client.expire(redisKey, window);
        }

        const ttl = await client.ttl(redisKey);
        const remaining = Math.max(0, limit - count);
        const allowed = count <= limit;

        if (!allowed) {
            console.warn(`[rate-limit] Blocked: key=${key} count=${count} limit=${limit}`);
        }

        return { allowed, remaining, resetIn: ttl > 0 ? ttl : window };
    } catch (err) {
        // Redis error — fail open (don't block users for infrastructure issues)
        console.error('[rate-limit] Redis error, failing open:', err);
        return { allowed: true, remaining: limit - 1, resetIn: window };
    }
}
