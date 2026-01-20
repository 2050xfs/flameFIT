-- Create knowledge_base_articles table
CREATE TABLE IF NOT EXISTS knowledge_base_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    category TEXT,
    thumbnail_url TEXT,
    video_url TEXT,
    tags TEXT[] DEFAULT '{}',
    word_count INTEGER,
    is_premium BOOLEAN DEFAULT FALSE,
    date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE knowledge_base_articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access (essential for SEO pages)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on knowledge_base_articles'
    ) THEN
        CREATE POLICY "Allow public read access on knowledge_base_articles"
        ON knowledge_base_articles FOR SELECT
        TO public
        USING (true);
    END IF;
END $$;

-- Enable Full Text Search (Optional but recommended)
CREATE INDEX IF NOT EXISTS knowledge_base_articles_search_idx ON knowledge_base_articles USING GIN (to_tsvector('english', title || ' ' || content));


-- STORAGE SETUP
-- Note: You usually need to create the bucket 'knowledge-base' in the Supabase Dashboard -> Storage.
-- But running this SQL might work if you have permissions:
INSERT INTO storage.buckets (id, name, public)
VALUES ('knowledge-base', 'knowledge-base', true)
ON CONFLICT (id) DO NOTHING;

-- Public Access Policy for Storage
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Public Access for knowledge-base'
    ) THEN
        CREATE POLICY "Public Access for knowledge-base" 
        ON storage.objects FOR SELECT 
        TO public 
        USING (bucket_id = 'knowledge-base');
    END IF;
END $$;
