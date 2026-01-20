#!/usr/bin/env node

/**
 * Script to upload knowledge base articles to OpenAI Vector Store
 * This will add 191 markdown articles to the existing Vector Store
 * 
 * Run: node scripts/upload-kb-to-vector-store.js
 */

import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs/promises';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const VECTOR_STORE_ID = process.env.OPENAI_VECTOR_STORE_ID;
const KB_PATH = resolve(__dirname, '../../knowledge-base/bodybuilding-training/articles');

if (!OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found in .env.local');
    process.exit(1);
}

if (!VECTOR_STORE_ID) {
    console.error('❌ OPENAI_VECTOR_STORE_ID not found in .env.local');
    process.exit(1);
}

async function getAllMarkdownFiles(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            const subFiles = await getAllMarkdownFiles(fullPath);
            files.push(...subFiles);
        } else if (entry.name === 'content.md') {
            files.push(fullPath);
        }
    }

    return files;
}

async function extractMetadata(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');

    // Extract title from first heading
    const titleLine = lines.find(line => line.startsWith('# '));
    const title = titleLine ? titleLine.replace('# ', '').trim() : path.basename(path.dirname(filePath));

    return { title, content };
}

async function uploadArticles() {
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    console.log('🚀 Starting Knowledge Base Upload to Vector Store...\n');
    console.log(`📂 Source: ${KB_PATH}`);
    console.log(`🎯 Vector Store: ${VECTOR_STORE_ID}\n`);

    try {
        // Get all markdown files
        console.log('📋 Scanning for articles...');
        const markdownFiles = await getAllMarkdownFiles(KB_PATH);
        console.log(`✅ Found ${markdownFiles.length} articles\n`);

        if (markdownFiles.length === 0) {
            console.log('⚠️  No articles found. Check the path.');
            return;
        }

        // Upload in batches to avoid rate limits
        const BATCH_SIZE = 20;
        let uploaded = 0;
        let failed = 0;

        for (let i = 0; i < markdownFiles.length; i += BATCH_SIZE) {
            const batch = markdownFiles.slice(i, i + BATCH_SIZE);
            console.log(`\n📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(markdownFiles.length / BATCH_SIZE)}`);

            for (const filePath of batch) {
                try {
                    const { title, content } = await extractMetadata(filePath);

                    // Create a temporary file with better formatting
                    const tempPath = path.join('/tmp', `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`);
                    const formattedContent = `TITLE: ${title}\n\nSOURCE: FlameFit Knowledge Base\n\n${content}`;
                    await fs.writeFile(tempPath, formattedContent);

                    // Upload to OpenAI
                    const file = await openai.files.create({
                        file: await fs.readFile(tempPath),
                        purpose: 'assistants'
                    });

                    // Add to vector store
                    await openai.beta.vectorStores.files.create(VECTOR_STORE_ID, {
                        file_id: file.id
                    });

                    // Clean up temp file
                    await fs.unlink(tempPath);

                    uploaded++;
                    process.stdout.write(`   ✓ ${title.substring(0, 60)}...\n`);
                } catch (error) {
                    failed++;
                    const { title } = await extractMetadata(filePath);
                    console.error(`   ✗ Failed: ${title} - ${error.message}`);
                }
            }

            // Rate limiting pause between batches
            if (i + BATCH_SIZE < markdownFiles.length) {
                console.log('   ⏸️  Pausing 2s to avoid rate limits...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('📊 Upload Summary:');
        console.log(`   ✅ Successfully uploaded: ${uploaded}`);
        console.log(`   ❌ Failed: ${failed}`);
        console.log(`   📈 Total articles in Vector Store: ${11 + uploaded} (11 PDFs + ${uploaded} articles)`);
        console.log('='.repeat(60));

        if (uploaded > 0) {
            console.log('\n💡 Next Steps:');
            console.log('   1. Test the assistant with general fitness questions');
            console.log('   2. Verify citations from knowledge base articles');
            console.log('   3. Monitor search relevance and response quality');
            console.log('\n✨ Vector Store expansion complete!');
        }

    } catch (error) {
        console.error('❌ Error during upload:', error);
        throw error;
    }
}

// Run the script
uploadArticles()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Upload failed:', error.message);
        process.exit(1);
    });
