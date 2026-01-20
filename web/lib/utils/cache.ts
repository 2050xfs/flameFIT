import { Redis } from '@upstash/redis';

// Initialize Redis client
let redis: Redis | null = null;

function getRedisClient(): Redis | null {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
        console.warn('Redis not configured - caching disabled');
        return null;
    }

    if (!redis) {
        redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN
        });
    }

    return redis;
}

/**
 * Cache assistant responses to reduce OpenAI API costs
 * TTL: 24 hours (workout protocols don't change frequently)
 */
export async function getCachedResponse<T>(key: string): Promise<T | null> {
    const client = getRedisClient();
    if (!client) return null;

    try {
        const cached = await client.get<T>(key);
        if (cached) {
            console.log('✅ Redis cache hit:', key.substring(0, 50));
        }
        return cached;
    } catch (error) {
        console.error('Redis get error:', error);
        return null;
    }
}

/**
 * Cache a response with 24-hour TTL
 */
export async function setCachedResponse<T>(key: string, value: T, ttlSeconds = 86400): Promise<void> {
    const client = getRedisClient();
    if (!client) return;

    try {
        await client.setex(key, ttlSeconds, JSON.stringify(value));
        console.log('💾 Cached response:', key.substring(0, 50));
    } catch (error) {
        console.error('Redis set error:', error);
    }
}

/**
 * Generate cache key from query
 */
export function generateCacheKey(prefix: string, query: string): string {
    // Normalize query: lowercase, trim, remove extra spaces
    const normalized = query.toLowerCase().trim().replace(/\s+/g, ' ');
    // Use first 100 chars to keep key manageable
    return `${prefix}:${normalized.substring(0, 100)}`;
}

/**
 * Clear all cached responses (use sparingly)
 */
export async function clearCache(pattern?: string): Promise<void> {
    const client = getRedisClient();
    if (!client) return;

    try {
        if (pattern) {
            // Note: Upstash Redis doesn't support SCAN, so we can't clear by pattern
            console.warn('Pattern-based cache clearing not supported in Upstash Redis');
        } else {
            await client.flushdb();
            console.log('🗑️  Cache cleared');
        }
    } catch (error) {
        console.error('Redis clear error:', error);
    }
}
