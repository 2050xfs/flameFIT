import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load .env.local explicitly
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found in .env.local');
    process.exit(1);
}

async function createVectorStore() {
    console.log('🔥 Creating FlameFit Vector Store...\n');

    try {
        // Step 1: Create the vector store using fetch API
        const createResponse = await fetch('https://api.openai.com/v1/vector_stores', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v2'
            },
            body: JSON.stringify({
                name: "FlameFit Pro Knowledge Base",
                expires_after: {
                    anchor: "last_active_at",
                    days: 30
                }
            })
        });

        if (!createResponse.ok) {
            const error = await createResponse.text();
            throw new Error(`Failed to create vector store: ${error}`);
        }

        const vectorStore = await createResponse.json();

        console.log('✅ Vector Store Created!');
        console.log('   ID:', vectorStore.id);
        console.log('   Name:', vectorStore.name);
        console.log('   Status:', vectorStore.status);
        console.log('');

        // Step 2: Check for knowledge base files
        const knowledgeBasePath = path.join(process.cwd(), 'knowledge-base');

        if (!fs.existsSync(knowledgeBasePath)) {
            console.log('📁 Creating knowledge-base directory...');
            fs.mkdirSync(knowledgeBasePath, { recursive: true });

            // Create a sample file
            const sampleContent = `# FlameFit Training Fundamentals

## Progressive Overload
Progressive overload is the gradual increase of stress placed upon the body during exercise training.

### Key Principles:
1. **Increase Weight**: Add 2.5-5% more weight when you can complete all sets with good form
2. **Increase Volume**: Add more sets or reps
3. **Increase Frequency**: Train muscle groups more often
4. **Decrease Rest**: Reduce rest periods between sets

## Recovery
Recovery is when your muscles repair and grow stronger.

### Recovery Guidelines:
- Sleep 7-9 hours per night
- Rest 48-72 hours between training same muscle groups
- Stay hydrated (3-4 liters water daily)
- Consume adequate protein (1.6-2.2g per kg bodyweight)

## Nutrition for Muscle Growth
Proper nutrition fuels your workouts and recovery.

### Macro Breakdown:
- **Protein**: 30-35% of calories
- **Carbohydrates**: 40-50% of calories
- **Fats**: 20-30% of calories

### Pre-Workout Meal (2-3 hours before):
- Complex carbs (oats, rice, sweet potato)
- Lean protein (chicken, fish, tofu)
- Small amount of healthy fats

### Post-Workout Meal (within 2 hours):
- Fast-digesting protein (whey, chicken breast)
- Simple carbs (white rice, banana)
`;

            fs.writeFileSync(
                path.join(knowledgeBasePath, 'training-fundamentals.md'),
                sampleContent
            );

            console.log('   ✅ Created sample file: training-fundamentals.md');
            console.log('   📝 Add more .txt, .md, or .pdf files to knowledge-base/');
            console.log('');
        }

        // Step 3: Save vector store ID to .env.local
        const envPath = path.join(process.cwd(), '.env.local');
        let envContent = '';

        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf-8');
        }

        // Add or update OPENAI_VECTOR_STORE_ID
        if (envContent.includes('OPENAI_VECTOR_STORE_ID=')) {
            envContent = envContent.replace(
                /OPENAI_VECTOR_STORE_ID=.*/,
                `OPENAI_VECTOR_STORE_ID=${vectorStore.id}`
            );
        } else {
            envContent += `\n# OpenAI Vector Store\nOPENAI_VECTOR_STORE_ID=${vectorStore.id}\n`;
        }

        fs.writeFileSync(envPath, envContent);
        console.log('✅ Saved vector store ID to .env.local');
        console.log('');

        // Step 4: Instructions for next steps
        console.log('🎯 Next Steps:');
        console.log('   1. Add your fitness content files to knowledge-base/');
        console.log('   2. Use the OpenAI Platform to upload files:');
        console.log(`      https://platform.openai.com/storage/vector_stores/${vectorStore.id}`);
        console.log('   3. Link to your agent in OpenAI Agent Builder:');
        console.log(`      - Add "File Search" tool to your agent`);
        console.log(`      - Use Vector Store ID: ${vectorStore.id}`);
        console.log('');
        console.log('💡 Tip: You can also upload files via API or use the web interface');
        console.log('');

    } catch (error: any) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createVectorStore();
