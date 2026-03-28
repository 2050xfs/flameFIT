-- Hot-path compound indices to prevent table scans on frequent queries
-- Dashboard, session, and nutrition lookups are the critical paths

-- nutrient_logs: primary join for daily macro dashboard
CREATE INDEX IF NOT EXISTS idx_nutrient_logs_user_date
    ON nutrient_logs (user_id, date);

-- nutrient_log_items: FK lookup when joining food items
CREATE INDEX IF NOT EXISTS idx_nutrient_log_items_log_id
    ON nutrient_log_items (nutrient_log_id);

-- workout_sessions: dashboard timeline + progress history
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_date
    ON workout_sessions (user_id, date DESC);

-- set_logs: volume calculations per session
CREATE INDEX IF NOT EXISTS idx_set_logs_session
    ON set_logs (workout_session_id);

-- chat_messages: session message history (most-recent first)
CREATE INDEX IF NOT EXISTS idx_chat_messages_session
    ON chat_messages (session_id, created_at DESC);

-- chat_sessions: user session list (sidebar)
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user
    ON chat_sessions (user_id, created_at DESC);

-- body_stats: weight chart (body fat history)
CREATE INDEX IF NOT EXISTS idx_body_stats_user_date
    ON body_stats (user_id, date DESC);

-- weight_logs: weight chart (primary weight history)
CREATE INDEX IF NOT EXISTS idx_weight_logs_user_date
    ON weight_logs (user_id, date DESC);

-- readiness_logs: readiness score lookups
CREATE INDEX IF NOT EXISTS idx_readiness_logs_user_date
    ON readiness_logs (user_id, date DESC);

-- water_logs: daily hydration lookup
CREATE INDEX IF NOT EXISTS idx_water_logs_user_date
    ON water_logs (user_id, date);

-- program_subscriptions: active subscription lookup
CREATE INDEX IF NOT EXISTS idx_program_subscriptions_user
    ON program_subscriptions (user_id, status);

-- knowledge_base_bookmarks: bookmark lookup per user
CREATE INDEX IF NOT EXISTS idx_knowledge_base_bookmarks_user
    ON knowledge_base_bookmarks (user_id, content_id);

-- progress_photos: photo gallery per user
CREATE INDEX IF NOT EXISTS idx_progress_photos_user_date
    ON progress_photos (user_id, photo_date DESC);

-- generated_workouts: spark architectures list
CREATE INDEX IF NOT EXISTS idx_generated_workouts_user
    ON generated_workouts (user_id, created_at DESC);
