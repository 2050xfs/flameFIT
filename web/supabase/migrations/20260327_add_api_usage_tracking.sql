-- API usage tracking table for per-user spend observability
-- Enables the /dashboard/usage page to show token consumption and estimated cost

CREATE TABLE IF NOT EXISTS api_usage (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    endpoint    text NOT NULL,            -- e.g. 'chat', 'embed', 'generate-workout'
    tokens      bigint NOT NULL DEFAULT 0,
    month       text NOT NULL,            -- YYYY-MM format for monthly rollup
    created_at  timestamptz DEFAULT now(),
    updated_at  timestamptz DEFAULT now(),

    CONSTRAINT api_usage_user_endpoint_month UNIQUE (user_id, endpoint, month)
);

-- RLS: users can only see their own usage
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "users_own_usage"
    ON api_usage FOR ALL
    USING (auth.uid() = user_id);

-- Index for dashboard queries (per user, ordered by month)
CREATE INDEX IF NOT EXISTS idx_api_usage_user_month
    ON api_usage (user_id, month DESC);

-- Atomic upsert function used by chat route (fire-and-forget)
CREATE OR REPLACE FUNCTION increment_api_usage(
    p_user_id   uuid,
    p_endpoint  text,
    p_tokens    bigint,
    p_month     text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO api_usage (user_id, endpoint, tokens, month)
    VALUES (p_user_id, p_endpoint, p_tokens, p_month)
    ON CONFLICT (user_id, endpoint, month)
    DO UPDATE SET
        tokens     = api_usage.tokens + p_tokens,
        updated_at = now();
END;
$$;
