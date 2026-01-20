#!/usr/bin/env node
import { searchWorkoutProtocols, getProtocolDetails } from '../lib/api/vector-store.js';
import * as dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env.local') });

console.log('🧪 Testing Caching & Curriculum Parsing\n');

async function testCaching() {
    const query = "What exercises are in Sadik's abs program?";

    console.log('Test 1: First query (API call)...');
    const start1 = Date.now();
    const result1 = await searchWorkoutProtocols(query, 1);
    const time1 = Date.now() - start1;
    console.log(`✅ ${time1}ms`);

    console.log('Test 2: Second query (should be cached)...');
    const start2 = Date.now();
    await searchWorkoutProtocols(query, 1);
    const time2 = Date.now() - start2;
    console.log(`✅ ${time2}ms (${Math.round(time1 / time2)}x faster)\n`);

    // Accept 2x speedup or better as success for cache hits
    return time2 < time1 / 2;
}

async function testParsing() {
    console.log('Test 3: Curriculum parsing...');
    const details = await getProtocolDetails('sadik-abs');

    if (details.curriculum) {
        console.log(`✅ Found ${details.curriculum.exercises.length} exercises`);
        details.curriculum.exercises.slice(0, 3).forEach((ex, i) => {
            console.log(`   ${i + 1}. ${ex.name} - ${ex.sets} sets x ${ex.reps} reps`);
        });
        return details.curriculum.exercises.length > 0;
    }
    return false;
}

async function run() {
    const caching = await testCaching();
    const parsing = await testParsing();

    console.log(`\n📊 Results: Caching ${caching ? '✅' : '❌'} | Parsing ${parsing ? '✅' : '❌'}`);
}

run().catch(console.error);
