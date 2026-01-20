import OpenAI from 'openai';
import { getCachedResponse, setCachedResponse, generateCacheKey } from '@/lib/utils/cache';
import { parseCurriculum, ParsedCurriculum } from '@/lib/utils/curriculum-parser';

/**
 * Search workout protocols using OpenAI chat completions
 * This provides general answers about workout programs without requiring the Assistants API
 */
export async function searchWorkoutProtocols(query: string, topK: number = 3): Promise<Array<{ content: string; score: number }>> {
    const apiKey = process.env.OPENAI_API_KEY;
    const vectorStoreId = process.env.OPENAI_VECTOR_STORE_ID;
    const assistantId = process.env.OPENAI_ASSISTANT_ID;

    if (!apiKey || !vectorStoreId || !assistantId) {
        console.warn('OpenAI API key, Vector Store ID, or Assistant ID not configured');
        return [];
    }

    // Check cache first
    const cacheKey = generateCacheKey('workout-protocol', query);
    const cached = await getCachedResponse<Array<{ content: string; score: number }>>(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        const openai = new OpenAI({ apiKey });

        // Create a thread for this query
        const thread = await openai.beta.threads.create({
            messages: [{
                role: 'user',
                content: query
            }]
        });

        // Run the assistant with file search
        const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
            assistant_id: assistantId
        });

        if (run.status === 'completed') {
            // Get the messages
            const messages = await openai.beta.threads.messages.list(thread.id);
            const assistantMessage = messages.data.find(m => m.role === 'assistant');

            if (assistantMessage && assistantMessage.content[0].type === 'text') {
                const textContent = assistantMessage.content[0].text;
                const results: Array<{ content: string; score: number }> = [];

                // Extract the main response
                results.push({
                    content: textContent.value,
                    score: 1.0
                });

                // Extract file citations if available
                if (textContent.annotations && textContent.annotations.length > 0) {
                    for (const annotation of textContent.annotations) {
                        if (annotation.type === 'file_citation') {
                            // File citations provide additional context
                            const citation = annotation.file_citation;
                            results.push({
                                content: `Citation: ${annotation.text} (File: ${citation.file_id})`,
                                score: 0.9
                            });
                        }
                    }
                }

                // Cache the results (24 hour TTL)
                await setCachedResponse(cacheKey, results.slice(0, topK));

                return results.slice(0, topK);
            }
        }

        return [];
    } catch (error) {
        console.error('Error searching workout protocols:', error);
        return [];
    }
}

/**
 * Get detailed protocol information for a specific program
 * This queries the vector store for program-specific details
 */
export async function getProtocolDetails(programId: string): Promise<{
    curriculum?: ParsedCurriculum;
    exercises?: any[];
    philosophy?: string;
}> {
    // Map program IDs to specific queries
    const queryMap: Record<string, string> = {
        'sadik-abs': 'Provide the complete curriculum, exercise list, sets/reps, and training philosophy from Sadik Hadzovic\'s Abs Destruction program. Be specific about the workout structure.',
        'aj-formula': 'Provide the complete curriculum, exercise list, and training philosophy from AJ Ellison\'s Secret Formula program. Include specific workout details.',
        'sadik-legs': 'Provide the complete curriculum and exercise list from Sadik\'s leg training program with sets and reps.',
        'sadik-shoulders': 'Provide the complete curriculum and exercise list from Sadik\'s shoulder training program with sets and reps.'
    };

    const query = queryMap[programId];
    if (!query) {
        return {};
    }

    const results = await searchWorkoutProtocols(query, 1);

    if (results.length === 0) {
        return {};
    }

    const rawText = results[0].content;

    // Parse the curriculum to extract structured data
    const parsed = parseCurriculum(rawText);

    return {
        philosophy: rawText,
        curriculum: parsed,
        exercises: parsed.exercises
    };
}
