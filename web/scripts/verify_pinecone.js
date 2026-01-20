require('dotenv').config({ path: '.env.local' });
const { Pinecone } = require('@pinecone-database/pinecone');

async function testPinecone() {
    const apiKey = process.env.PINECONE_API_KEY;
    const indexName = 'flamefit-knowledge-base'; // Hardcoded matches MCP

    console.log("Testing Pinecone Connection...");
    console.log(`API Key present: ${!!apiKey}`);
    console.log(`Target Index: ${indexName}`);

    if (!apiKey) {
        console.error("❌ No API Key found in .env.local");
        return;
    }

    try {
        const pc = new Pinecone({ apiKey });

        // 1. List Indexes to verify control plane and key validity
        console.log("Attempting to list indexes...");
        const indexes = await pc.listIndexes();
        console.log("✅ List Indexes Success:", indexes);

        // 2. Test Inference (simple query)
        // Note: For actual inference we usually use a specific fetch or older method if SDK doesn't support 'inference' namespace easily yet
        // But let's try to just get stats for the index to prove data plane access
        const index = pc.index(indexName);
        const stats = await index.describeIndexStats();
        console.log("✅ Index Stats Success:", stats);

    } catch (error) {
        console.error("❌ Pinecone Error:", error);
    }
}

testPinecone();
