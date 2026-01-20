/**
 * Structured data types for parsed workout curriculum
 */

export interface ParsedExercise {
    name: string;
    sets?: number;
    reps?: string;
    rest?: string;
    notes?: string;
}

export interface ParsedCurriculum {
    exercises: ParsedExercise[];
    weeks?: number;
    phases?: string[];
    circuitFormat?: boolean;
    rawText: string;
}

/**
 * Parse workout curriculum from assistant response text
 * Extracts exercises, sets, reps, and program structure
 */
export function parseCurriculum(text: string): ParsedCurriculum {
    const exercises: ParsedExercise[] = [];

    // Pattern 1: Numbered list with bold and dash/colon separator
    // Example: "1. **Sit-up** - 3 sets, 12-15 reps" or "1. **Sit-up**: 3 sets..."
    const pattern1 = /\d+\.\s+\*\*([^*]+)\*\*\s*[-–:]\s*(\d+)\s+sets?,?\s+(\d+-?\d*)\s+reps?/gi;

    // Pattern 2: Bullet points with exercise names
    // Example: "- **Lying Leg Raise** - 3 sets x 12-15 reps"
    const pattern2 = /[-•]\s+\*\*?([^*:]+)\*\*?\s*[-–:]\s*(\d+)\s+sets?\s*[x×,]?\s*(\d+-?\d*)\s+reps?/gi;

    // Pattern 3: Simple format without bold
    // Example: "Sit-up - 3 sets, 12-15 reps"
    const pattern3 = /(\w[\w\s]+?)\s*[-–:]\s*(\d+)\s+sets?,?\s+(\d+-?\d*)\s+reps?/gi;

    let match;

    // Try pattern 1 (numbered with bold)
    while ((match = pattern1.exec(text)) !== null) {
        exercises.push({
            name: match[1].trim(),
            sets: parseInt(match[2]),
            reps: match[3],
            rest: extractRest(text, match.index)
        });
    }

    // Try pattern 2 if no matches (bullets with bold)
    if (exercises.length === 0) {
        while ((match = pattern2.exec(text)) !== null) {
            exercises.push({
                name: match[1].trim(),
                sets: parseInt(match[2]),
                reps: match[3],
                rest: extractRest(text, match.index)
            });
        }
    }

    // Try pattern 3 if still no matches (simple format)
    if (exercises.length === 0) {
        while ((match = pattern3.exec(text)) !== null) {
            const name = match[1].trim();
            // Filter out false positives matches that are common in text
            if (!name.toLowerCase().includes('week') &&
                !name.toLowerCase().includes('day') &&
                !name.toLowerCase().includes('phase')) {
                exercises.push({
                    name,
                    sets: parseInt(match[2]),
                    reps: match[3],
                    rest: extractRest(text, match.index)
                });
            }
        }
    }

    // Fallback: Check for global sets/reps if we have a list but no details
    if (exercises.length === 0) {
        const simpleExercises = parseExerciseList(text);
        if (simpleExercises.length > 0) {
            const globalStats = extractGlobalSetsReps(text);

            simpleExercises.forEach(name => {
                // If we found global stats, apply them (but create entry even if only name found)
                if (simpleExercises.length > 0) {
                    exercises.push({
                        name,
                        sets: globalStats.sets,
                        reps: globalStats.reps,
                        // Allow rest to be undefined
                        rest: globalStats.rest || extractRest(text, text.indexOf(name))
                    });
                }
            });
        }
    }

    return {
        exercises,
        weeks: extractWeeks(text),
        phases: extractPhases(text),
        circuitFormat: detectCircuit(text),
        rawText: text
    };
}

/**
 * Extract global sets and reps (e.g. "Each exercise is performed for 3 sets of 12-15 reps")
 */
function extractGlobalSetsReps(text: string): { sets?: number, reps?: string, rest?: string } {
    const setsPattern = /(\d+)\s+sets/i;
    const repsPattern = /(\d+(?:-\d+)?)\s+reps/i;
    const restPattern = /(\d+\s*(?:min|sec|minutes?|seconds?))\s+rest/i;

    const setsMatch = text.match(setsPattern);
    const repsMatch = text.match(repsPattern);
    const restMatch = text.match(restPattern);

    return {
        sets: setsMatch ? parseInt(setsMatch[1]) : undefined,
        reps: repsMatch ? repsMatch[1] : undefined,
        rest: restMatch ? restMatch[1] : undefined
    };
}

/**
 * Extract rest period from text near exercise mention
 */
function extractRest(text: string, position: number): string | undefined {
    const restPattern = /(?:rest|break)[:\s]+(\d+\s*(?:sec|min|s|m|seconds?|minutes?))/i;
    const snippet = text.slice(Math.max(0, position - 100), position + 200);
    const match = snippet.match(restPattern);
    return match ? match[1] : undefined;
}

/**
 * Extract program duration in weeks
 */
function extractWeeks(text: string): number | undefined {
    const weekPattern = /(\d+)[-\s]week/i;
    const match = text.match(weekPattern);
    return match ? parseInt(match[1]) : undefined;
}

/**
 * Extract phase/week identifiers
 */
function extractPhases(text: string): string[] {
    const phasePattern = /(?:phase|week)\s+(\d+)/gi;
    const phases: string[] = [];
    let match;

    while ((match = phasePattern.exec(text)) !== null) {
        phases.push(match[0]);
    }

    return [...new Set(phases)]; // Remove duplicates
}

/**
 * Detect if workout is in circuit format
 */
function detectCircuit(text: string): boolean {
    const circuitKeywords = ['circuit', 'no rest between', 'superset', 'giant set'];
    return circuitKeywords.some(kw => text.toLowerCase().includes(kw));
}

/**
 * Parse exercise list from a simpler format
 * Useful for fallback when structured parsing fails
 */
export function parseExerciseList(text: string): string[] {
    const exercises: string[] = [];

    // Look for numbered or bulleted lists: "1. **Name**" or "- **Name**" or "1. Name"
    // Capture content inside ** if present, otherwise whole line
    const listPattern = /(?:^|\n)\s*(?:\d+\.|-|•)\s+(?:\*\*([^*]+)\*\*|([^\n]+))/g;
    let match;

    while ((match = listPattern.exec(text)) !== null) {
        const item = match[1] ? match[1].trim() : match[2].trim();

        // Filter out non-exercise items
        if (!item.toLowerCase().startsWith('week') &&
            !item.toLowerCase().startsWith('day') &&
            !item.toLowerCase().startsWith('phase') &&
            item.length > 2) { // Too short unlikely to be exercise
            exercises.push(item);
        }
    }

    return exercises;
}
