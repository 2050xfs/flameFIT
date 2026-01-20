import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import pdf from 'pdf-parse';

// Load .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'flamefit-knowledge';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!PINECONE_API_KEY || !OPENAI_API_KEY) {
    console.error('❌ Missing API keys in .env.local');
    process.exit(1);
}

const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Configuration
const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 100;
const EMBEDDING_MODEL = 'text-embedding-3-small'; // 1536 dimensions

// Helper: Chunk text
function chunkText(text: string): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
        const end = start + CHUNK_SIZE;
        let chunk = text.slice(start, end);

        // Try to cut at a newline or space if possible to avoid breaking words too badly
        // Simple heuristic: if we are not at end, look for last space in the last 100 chars
        if (end < text.length) {
            const lastSpace = chunk.lastIndexOf(' ');
            if (lastSpace > CHUNK_SIZE - 100) {
                chunk = chunk.slice(0, lastSpace);
                start += lastSpace + 1 - CHUNK_OVERLAP; // Move start back for overlap
            } else {
                start += CHUNK_SIZE - CHUNK_OVERLAP;
            }
        } else {
            start += CHUNK_SIZE; // Finish
        }

        chunks.push(chunk.trim());
    }
    return chunks.filter(c => c.length > 50); // Filter tiny chunks
}

// Helper: Find files recursively
function findFiles(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findFiles(filePath, fileList);
        } else {
            if (['.md', '.txt', '.pdf'].includes(path.extname(file).toLowerCase())) {
                fileList.push(filePath);
            }
        }
    });
    return fileList;
}

// Helper: Read file content
async function readFileContent(filePath: string): Promise<string> {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.pdf') {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        return data.text;
    } else {
        return fs.readFileSync(filePath, 'utf-8');
    }
}

async function updatePinecone() {
    console.log('🌲 Updating Pinecone Index:', PINECONE_INDEX_NAME);

    try {
        // 1. Create Index if needed
        const existingIndexes = await pinecone.listIndexes();
        const indexExists = existingIndexes.indexes?.some(idx => idx.name === PINECONE_INDEX_NAME);

        if (!indexExists) {
            console.log(`   Creating index "${PINECONE_INDEX_NAME}"...`);
            await pinecone.createIndex({
                name: PINECONE_INDEX_NAME,
                dimension: 1536,
                metric: 'cosine',
                spec: {
                    serverless: {
                        cloud: 'aws',
                        region: 'us-east-1'
                    }
                }
            });
            console.log('   ✅ Index created.');
            // Wait a bit for initialization
            await new Promise(resolve => setTimeout(resolve, 10000));
        }

        const index = pinecone.index(PINECONE_INDEX_NAME);

        // 2. Process Files
        const knowledgeBasePath = path.join(process.cwd(), 'knowledge-base');
        const allFiles = findFiles(knowledgeBasePath);
        console.log(`   Found ${allFiles.length} files to process.`);

        let validFilesProcessed = 0;

        for (const filePath of allFiles) {
            const fileName = path.basename(filePath);
            process.stdout.write(`   Processing ${fileName.substring(0, 30)}... `);

            try {
                const text = await readFileContent(filePath);
                const chunks = chunkText(text);

                if (chunks.length === 0) {
                    console.log('Skipped (Empty/Too short)');
                    continue;
                }

                // Generate Embeddings
                const embeddingResponse = await openai.embeddings.create({
                    model: EMBEDDING_MODEL,
                    input: chunks
                });

                // Prepare vectors
                const vectors = chunks.map((chunk, i) => ({
                    id: `${fileName}-${i}`,
                    values: embeddingResponse.data[i].embedding,
                    metadata: {
                        text: chunk,
                        filename: fileName,
                        path: filePath.replace(process.cwd(), '')
                    }
                }));

                // Upsert (batch if large)
                // Pinecone limit is 100-1000 records per upsert is safe. 
                // Our chunks per file likely < 100 except for big PDFs.
                // Let's safe chunk the upsert
                const UPSERT_BATCH = 50;
                for (let i = 0; i < vectors.length; i += UPSERT_BATCH) {
                    await index.upsert(vectors.slice(i, i + UPSERT_BATCH));
                }

                console.log(`✅ (${chunks.length} chunks)`);
                validFilesProcessed++;

            } catch (error: any) {
                console.log(`❌ Error: ${error.message}`);
            }
        }

        console.log(`\n🎉 Pinecone Update Complete! Processed ${validFilesProcessed} files.`);

    } catch (error: any) {
        console.error('\n❌ Fatal Error:', error.message);
    }
}

updatePinecone();
