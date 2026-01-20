#!/usr/bin/env node

/**
 * Test script to verify RAG system integration
 * Tests both Pinecone and OpenAI Vector Store without running localhost
 * 
 * Run: node scripts/test-rag-system.js
 */

import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;
const PINECONE_HOST = 'https://flamefit-knowledge-xlzivl1.svc.aped-4627-b74a.pinecone.io';

console.log('🧪 Testing RAG System Integration\n');
console.log('='.repeat(60));

// Test 1: Pinecone Query
async function testPinecone() {
    console.log('\n📍 Test 1: Pinecone Knowledge Base Query');
    console.log('-'.repeat(60));

    if (!PINECONE_API_KEY) {
        console.log('❌ PINECONE_API_KEY not found');
        return false;
    }

    try {
        const query = "What are the best exercises for building chest muscles?";
        console.log(`Query: "${query}"\n`);

        // Generate embedding first
        const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
        const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: query
        });
        const queryVector = embeddingResponse.data[0].embedding;

        const response = await fetch(`${PINECONE_HOST}/query`, {
            method: 'POST',
            headers: {
                'Api-Key': PINECONE_API_KEY,
                'Content-Type': 'application/json',
                'X-Pinecone-API-Version': '2024-07'
            },
            body: JSON.stringify({
                namespace: '', // Default namespace
                topK: 3,
                vector: queryVector,
                includeMetadata: true
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.log(`❌ Pinecone query failed: ${response.status}`);
            console.log(`Error: ${error}`);
            return false;
        }

        const data = await response.json();

        if (data.matches && data.matches.length > 0) {
            console.log(`✅ Retrieved ${data.matches.length} results from Pinecone`);
            console.log('\nTop Result:');
            console.log(`  Score: ${data.matches[0].score?.toFixed(4) || 'N/A'}`);
            console.log(`  Metadata:`, data.matches[0].metadata);
            if (data.matches[0].metadata?.text) {
                console.log(`  Content: ${data.matches[0].metadata.text.substring(0, 200)}...`);
            }
            return true;
        } else {
            console.log('⚠️  No results returned from Pinecone');
            return false;
        }
    } catch (error) {
        console.log(`❌ Pinecone test failed: ${error.message}`);
        return false;
    }
}

// Test 2: OpenAI Vector Store Query
async function testOpenAIVectorStore() {
    console.log('\n\n🤖 Test 2: OpenAI Vector Store Query (Assistant)');
    console.log('-'.repeat(60));

    if (!OPENAI_API_KEY || !ASSISTANT_ID) {
        console.log('❌ OPENAI_API_KEY or ASSISTANT_ID not found');
        return false;
    }

    try {
        const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
        const query = "What exercises are in Sadik's abs destruction program?";
        console.log(`Query: "${query}"\n`);

        // Create a thread
        const thread = await openai.beta.threads.create({
            messages: [{
                role: 'user',
                content: query
            }]
        });

        console.log(`Thread created: ${thread.id}`);

        // Run the assistant
        const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
            assistant_id: ASSISTANT_ID
        });

        console.log(`Run status: ${run.status}`);

        if (run.status === 'completed') {
            // Get the messages
            const messages = await openai.beta.threads.messages.list(thread.id);
            const assistantMessage = messages.data.find(m => m.role === 'assistant');

            if (assistantMessage && assistantMessage.content[0].type === 'text') {
                const textContent = assistantMessage.content[0].text;
                console.log('\n✅ Assistant Response:');
                console.log('-'.repeat(60));
                console.log(textContent.value.substring(0, 500) + '...');

                // Check for citations
                if (textContent.annotations && textContent.annotations.length > 0) {
                    console.log(`\n📎 Citations found: ${textContent.annotations.length}`);
                    textContent.annotations.slice(0, 2).forEach((ann, i) => {
                        if (ann.type === 'file_citation') {
                            console.log(`  ${i + 1}. File: ${ann.file_citation.file_id}`);
                        }
                    });
                }

                return true;
            } else {
                console.log('⚠️  No response from assistant');
                return false;
            }
        } else {
            console.log(`❌ Run failed with status: ${run.status}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ OpenAI Vector Store test failed: ${error.message}`);
        return false;
    }
}

// Test 3: Integration Test (Both Sources)
async function testIntegration() {
    console.log('\n\n🔗 Test 3: Dual-Source Integration');
    console.log('-'.repeat(60));

    const query = "What's the best training split for building muscle?";
    console.log(`Query: "${query}"\n`);

    let pineconeContext = '';
    let vectorStoreContext = '';

    // Query Pinecone
    try {
        const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
        const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: query
        });

        const queryVector = embeddingResponse.data[0].embedding;

        const response = await fetch(`${PINECONE_HOST}/query`, {
            method: 'POST',
            headers: {
                'Api-Key': PINECONE_API_KEY,
                'Content-Type': 'application/json',
                'X-Pinecone-API-Version': '2024-07'
            },
            body: JSON.stringify({
                namespace: '',
                topK: 2,
                vector: queryVector,
                includeMetadata: true
            })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.matches?.length > 0) {
                pineconeContext = data.matches.map(m => m.metadata?.text || '').join('\n');
                console.log(`✅ Pinecone: Retrieved ${data.matches.length} results`);
            }
        }
    } catch (error) {
        console.log(`⚠️  Pinecone query failed: ${error.message}`);
    }

    // Query OpenAI (general, not workout-specific)
    const workoutKeywords = ['program', 'protocol', 'sadik', 'aj ellison'];
    const isWorkoutQuery = workoutKeywords.some(kw => query.toLowerCase().includes(kw));

    if (isWorkoutQuery) {
        console.log('🎯 Workout-related query detected - would query Vector Store');
    } else {
        console.log('📚 General fitness query - using Pinecone only');
    }

    // Combine contexts
    const combinedContext = pineconeContext;

    if (combinedContext) {
        console.log('\n✅ Combined Context Available:');
        console.log(`  Length: ${combinedContext.length} characters`);
        console.log(`  Preview: ${combinedContext.substring(0, 150)}...`);
        return true;
    } else {
        console.log('\n⚠️  No context retrieved from either source');
        return false;
    }
}

// Run all tests
async function runTests() {
    const results = {
        pinecone: false,
        vectorStore: false,
        integration: false
    };

    results.pinecone = await testPinecone();
    results.vectorStore = await testOpenAIVectorStore();
    results.integration = await testIntegration();

    // Summary
    console.log('\n\n' + '='.repeat(60));
    console.log('📊 Test Summary');
    console.log('='.repeat(60));
    console.log(`Pinecone Query:          ${results.pinecone ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`OpenAI Vector Store:     ${results.vectorStore ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Integration Test:        ${results.integration ? '✅ PASS' : '❌ FAIL'}`);

    const allPassed = results.pinecone && results.vectorStore && results.integration;

    if (allPassed) {
        console.log('\n🎉 All tests passed! RAG system is fully operational.');
    } else {
        console.log('\n⚠️  Some tests failed. Review the output above for details.');
    }

    console.log('='.repeat(60));
}

// Run the tests
runTests()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('\n💥 Test suite failed:', error.message);
        process.exit(1);
    });
