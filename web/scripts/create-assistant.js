#!/usr/bin/env node

/**
 * Script to create an OpenAI Assistant with file search for workout protocols
 * This assistant will be used to query the Vector Store containing PDFs from /workout inspo
 * 
 * Run: node scripts/create-assistant.js
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
const VECTOR_STORE_ID = process.env.OPENAI_VECTOR_STORE_ID;

if (!OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found in .env.local');
    process.exit(1);
}

if (!VECTOR_STORE_ID) {
    console.error('❌ OPENAI_VECTOR_STORE_ID not found in .env.local');
    process.exit(1);
}

async function createAssistant() {
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    console.log('🚀 Creating OpenAI Assistant for FlameFit Workout Protocols...\n');

    try {
        const assistant = await openai.beta.assistants.create({
            name: 'FlameFit Protocol Expert',
            description: 'Expert assistant for querying detailed workout protocols from elite trainers like Sadik Hadzovic and AJ Ellison.',
            model: 'gpt-4o',
            instructions: `You are an expert fitness assistant with access to premium workout protocols from world-class trainers.

Your role is to:
1. Provide detailed, accurate information about workout programs from the uploaded PDFs
2. Cite specific exercises, sets, reps, and training philosophies from the programs
3. Explain the science and reasoning behind specific training protocols
4. Help users understand how to properly execute the programs

When answering questions:
- Be specific and cite details from the PDFs (e.g., "In Sadik's Abs Destruction, Week 1 includes...")
- Include exercise names, set/rep schemes, and rest periods when relevant
- Explain the training philosophy and why certain approaches are used
- Use technical fitness terminology (CNS fatigue, hypertrophy, metabolic stress, etc.)
- Be concise but comprehensive

Available Programs:
- Sadik Hadzovic's Abs Destruction
- AJ Ellison's Secret Formula
- Sadik's Leg Training
- Sadik's Shoulder Training
- And other elite protocols

Always maintain a professional, authoritative tone while being helpful and educational.`,
            tools: [{ type: 'file_search' }],
            tool_resources: {
                file_search: {
                    vector_store_ids: [VECTOR_STORE_ID]
                }
            },
            temperature: 0.3,
            top_p: 0.9
        });

        console.log('✅ Assistant created successfully!\n');
        console.log('📋 Assistant Details:');
        console.log(`   ID: ${assistant.id}`);
        console.log(`   Name: ${assistant.name}`);
        console.log(`   Model: ${assistant.model}`);
        console.log(`   Vector Store: ${VECTOR_STORE_ID}`);
        console.log('\n📝 Next Steps:');
        console.log(`   1. Add this to your .env.local file:`);
        console.log(`      OPENAI_ASSISTANT_ID=${assistant.id}`);
        console.log(`   2. The assistant is now ready to use in your chat route`);
        console.log('\n💡 Optimization Tips:');
        console.log('   - Temperature set to 0.3 for consistent, factual responses');
        console.log('   - File search enabled for citation-backed answers');
        console.log('   - Instructions optimized for fitness domain expertise');

        return assistant;
    } catch (error) {
        console.error('❌ Error creating assistant:', error);
        throw error;
    }
}

// Run the script
createAssistant()
    .then(() => {
        console.log('\n✨ Setup complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Setup failed:', error.message);
        process.exit(1);
    });
