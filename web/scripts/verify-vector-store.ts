import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load .env.local explicitly
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const VECTOR_STORE_ID = process.env.OPENAI_VECTOR_STORE_ID;

if (!OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found in .env.local');
    process.exit(1);
}

if (!VECTOR_STORE_ID) {
    console.error('❌ OPENAI_VECTOR_STORE_ID not found in .env.local');
    process.exit(1);
}

async function verifyVectorStore() {
    console.log(`🔍 Verifying Vector Store: ${VECTOR_STORE_ID}...\n`);

    try {
        // 1. Get Vector Store Details
        const storeResponse = await fetch(`https://api.openai.com/v1/vector_stores/${VECTOR_STORE_ID}`, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'OpenAI-Beta': 'assistants=v2'
            }
        });

        if (!storeResponse.ok) {
            throw new Error(`Failed to fetch vector store: ${storeResponse.statusText}`);
        }

        const store = await storeResponse.json();
        console.log('📊 Vector Store Status:');
        console.log(`   ID: ${store.id}`);
        console.log(`   Name: ${store.name}`);
        console.log(`   Status: ${store.status}`);
        console.log(`   File Counts:`);
        console.log(`     - Total: ${store.file_counts.total}`);
        console.log(`     - Completed: ${store.file_counts.completed}`);
        console.log(`     - In Progress: ${store.file_counts.in_progress}`);
        console.log(`     - Failed: ${store.file_counts.failed}`);
        console.log(`     - Cancelled: ${store.file_counts.cancelled}`);
        console.log('');

        // 2. List Files (first page)
        const filesResponse = await fetch(`https://api.openai.com/v1/vector_stores/${VECTOR_STORE_ID}/files?limit=100`, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'OpenAI-Beta': 'assistants=v2'
            }
        });

        if (filesResponse.ok) {
            const filesData = await filesResponse.json();
            console.log(`📄 Files Attached (First ${filesData.data.length}):`);
            filesData.data.forEach((f: any) => {
                console.log(`   - ${f.id} (${f.status})`);
            });

            if (filesData.has_more) {
                console.log('   ... and more.');
            }
        }

        console.log('');
        if (store.file_counts.failed > 0) {
            console.warn('⚠️ Some files failed processing. You might want to re-upload them.');
        } else if (store.status === 'in_progress') {
            console.log('⏳ Store is still processing files. Check back later.');
        } else {
            console.log('✅ Vector Store looks healthy!');
        }

    } catch (error: any) {
        console.error('❌ Error:', error.message);
    }
}

verifyVectorStore();
