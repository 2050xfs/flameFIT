
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    console.error('Please add your SUPABASE_SERVICE_ROLE_KEY to .env.local to run this seeding script.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const KB_DIR = path.resolve(process.cwd(), 'knowledge-base');
const MANIFEST_PATH = path.join(KB_DIR, 'manifest.json');

async function seed() {
    console.log('Starting Knowledge Base hydration...');

    if (!fs.existsSync(MANIFEST_PATH)) {
        console.error(`Manifest not found at ${MANIFEST_PATH}`);
        process.exit(1);
    }

    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
    const articles = manifest.articles || [];

    console.log(`Found ${articles.length} articles in manifest.`);

    for (const article of articles) {
        const articleFolder = path.join(KB_DIR, article.folder);
        const metadataPath = path.join(articleFolder, 'metadata.json');
        const contentPath = path.join(articleFolder, 'content.md');

        if (!fs.existsSync(metadataPath) || !fs.existsSync(contentPath)) {
            console.warn(`Missing files for ${article.slug}, skipping.`);
            continue;
        }

        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
        const content = fs.readFileSync(contentPath, 'utf-8');

        // Handle Images
        let thumbnailUrl = null;
        let imagesDir = path.join(articleFolder, 'images');

        // Sometimes images are in the root of the article folder or a subfolder?
        // Based on previous ls, there is an 'images' subdirectory
        if (fs.existsSync(imagesDir)) {
            const images = fs.readdirSync(imagesDir).filter(f => /\.(jpg|png|gif|jpeg)$/i.test(f));

            if (images.length > 0) {
                // Upload the first image as thumbnail
                const imageFile = images[0];
                const imagePath = path.join(imagesDir, imageFile);
                const fileBuffer = fs.readFileSync(imagePath);

                // Storage path: articles/{slug}/{filename}
                const storagePath = `articles/${article.slug}/${imageFile}`;

                const { error: uploadError } = await supabase.storage
                    .from('knowledge-base')
                    .upload(storagePath, fileBuffer, {
                        contentType: 'image/jpeg', // Simple assumption, or detect mime type
                        upsert: true
                    });

                if (uploadError) {
                    console.error(`Failed to upload image for ${article.slug}:`, uploadError.message);
                } else {
                    const { data: publicUrlData } = supabase.storage
                        .from('knowledge-base')
                        .getPublicUrl(storagePath);

                    thumbnailUrl = publicUrlData.publicUrl;
                }
            }
        }

        // Add 'branded' logic or premium logic if needed
        // For now, simple insert
        const { error: insertError } = await supabase
            .from('knowledge_base_articles')
            .upsert({
                slug: article.slug,
                title: metadata.title || article.title,
                description: content.slice(0, 160) + '...', // Simple truncated description if not fetched
                content: content,
                category: 'strength', // Defaulting to strength as category mapping isn't fully clear yet
                thumbnail_url: thumbnailUrl,
                tags: metadata.tags || [],
                word_count: metadata.word_count || 0,
                date: metadata.date ? new Date(metadata.date) : new Date(),
                is_premium: false // Default to free for SEO articles
            }, { onConflict: 'slug' });

        if (insertError) {
            console.error(`Error upserting ${article.slug}:`, insertError.message);
        } else {
            console.log(`Synced: ${article.title}`);
        }
    }

    console.log('Seeding complete!');
}

seed().catch(console.error);
