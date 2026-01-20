import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const VECTOR_STORE_ID = process.env.OPENAI_VECTOR_STORE_ID;

if (!OPENAI_API_KEY || !VECTOR_STORE_ID) {
    console.error('❌ Missing credentials in .env.local');
    process.exit(1);
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

function findFiles(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findFiles(filePath, fileList);
        } else {
            if (['.md', '.txt', '.pdf', '.docx', '.html', '.json'].includes(path.extname(file).toLowerCase())) {
                fileList.push(filePath);
            }
        }
    });
    return fileList;
}

// Upload a single file to OpenAI Storage
async function uploadFileToStorage(filePath: string): Promise<string | null> {
    try {
        const fileStream = fs.createReadStream(filePath);
        const file = await openai.files.create({
            file: fileStream,
            purpose: 'assistants',
        });
        return file.id;
    } catch (error: any) {
        console.error(`   ❌ Failed to upload ${path.basename(filePath)}: ${error.message}`);
        return null;
    }
}

async function updateVectorStore() {
    console.log(`🔥 Updating Vector Store: ${VECTOR_STORE_ID}...\n`);

    try {
        const knowledgeBasePath = path.join(process.cwd(), 'knowledge-base');
        if (!fs.existsSync(knowledgeBasePath)) throw new Error(`Dir not found: ${knowledgeBasePath}`);

        const allFiles = findFiles(knowledgeBasePath);
        console.log(`📁 Found ${allFiles.length} files. Processing in batches of 20...`);

        // Process in batches
        const BATCH_SIZE = 20;

        for (let i = 0; i < allFiles.length; i += BATCH_SIZE) {
            const batchFiles = allFiles.slice(i, i + BATCH_SIZE);
            const batchNum = Math.floor(i / BATCH_SIZE) + 1;
            const totalBatches = Math.ceil(allFiles.length / BATCH_SIZE);

            console.log(`\n📦 Batch ${batchNum}/${totalBatches} (${batchFiles.length} files)`);

            // 1. Upload files to Storage
            const fileIds: string[] = [];
            for (const filePath of batchFiles) {
                process.stdout.write(`   ⬆️  ${path.basename(filePath).substring(0, 30)}... `);
                const id = await uploadFileToStorage(filePath);
                if (id) {
                    fileIds.push(id);
                    console.log('✅');
                }
            }

            if (fileIds.length === 0) continue;

            // 2. Attach to Vector Store immediately
            console.log(`   🔗 Attaching ${fileIds.length} files to Vector Store...`);
            try {
                const batchResponse = await fetch(`https://api.openai.com/v1/vector_stores/${VECTOR_STORE_ID}/file_batches`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${OPENAI_API_KEY}`,
                        'Content-Type': 'application/json',
                        'OpenAI-Beta': 'assistants=v2'
                    },
                    body: JSON.stringify({
                        file_ids: fileIds
                    })
                });

                if (!batchResponse.ok) {
                    const err = await batchResponse.text();
                    throw new Error(`Failed to create file batch: ${err}`);
                }

                const batchData = await batchResponse.json();
                console.log('   ✅ Batch attached successfully!', batchData.id);
            } catch (error: any) {
                console.error('   ❌ Failed to attach batch:', error.message);
            }
        }

        console.log('\n🎯 Update Complete!');

    } catch (error: any) {
        console.error('\n❌ Fatal Error:', error.message);
    }
}

updateVectorStore();
