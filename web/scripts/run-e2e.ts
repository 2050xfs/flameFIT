import { spawn } from 'child_process';
import chalk from 'chalk'; // We probably don't have chalk installed, so I'll use ANSI codes directly

const COLORS = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    white: "\x1b[37m"
};

async function runCommand(command: string, args: string[], name: string): Promise<{ success: boolean, output: string }> {
    console.log(`\n${COLORS.cyan}▶ Running ${name}...${COLORS.reset}`);
    console.log(`${COLORS.white}  Command: ${command} ${args.join(' ')}${COLORS.reset}\n`);

    return new Promise((resolve) => {
        const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] }); // Capture stdout/stderr

        let output = '';

        child.stdout.on('data', (data) => {
            const str = data.toString();
            output += str;
            process.stdout.write(str); // Stream specific output to console too
        });

        child.stderr.on('data', (data) => {
            const str = data.toString();
            output += str;
            process.stderr.write(str);
        });

        child.on('close', (code) => {
            const success = code === 0;
            console.log(`\n${success ? COLORS.green + '✔' : COLORS.red + '✘'} ${name} finished with code ${code}${COLORS.reset}`);
            resolve({ success, output });
        });
    });
}

async function main() {
    console.log(`${COLORS.bright}${COLORS.white}🚀 Starting End-to-End Verification Suite${COLORS.reset}\n`);
    const startTime = Date.now();

    const results = [];

    // 1. Run Unit/API Tests (Vitest)
    // Using 'npx vitest run' to ensure single run
    results.push(await runCommand('npx', ['vitest', 'run', 'tests/workout-lab/workout-api.test.ts'], 'Unit & API Tests'));

    // 2. Run RAG System Integration Tests
    results.push(await runCommand('node', ['scripts/test-rag-system.js'], 'RAG System Integration'));

    // 3. Run Caching & Parsing Tests
    results.push(await runCommand('npx', ['tsx', 'scripts/test-caching-parsing.js'], 'Caching & Parser Logic'));

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    // Generate Report
    console.log(`\n\n${COLORS.bright}${COLORS.white}════════════════════════════════════════════════════════════════${COLORS.reset}`);
    console.log(`${COLORS.bright}${COLORS.white}  📊 E2E TEST REPORT${COLORS.reset}`);
    console.log(`${COLORS.bright}${COLORS.white}════════════════════════════════════════════════════════════════${COLORS.reset}\n`);

    console.log(`Total Duration: ${duration}s\n`);

    let allPassed = true;

    results.forEach((res, index) => {
        const names = ['Unit & API Tests', 'RAG System Integration', 'Caching & Parser Logic'];
        const name = names[index];
        const status = res.success ? `${COLORS.green}PASS${COLORS.reset}` : `${COLORS.red}FAIL${COLORS.reset}`;

        console.log(`${status}  ${COLORS.bright}${name}${COLORS.reset}`);

        // Extract key metrics or failure reasons loosely
        if (!res.success) {
            allPassed = false;
        }
    });

    console.log(`\n${COLORS.bright}${COLORS.white}════════════════════════════════════════════════════════════════${COLORS.reset}`);

    if (allPassed) {
        console.log(`\n${COLORS.green}${COLORS.bright}🎉 SUCCESS: All systems operational.${COLORS.reset}`);
        process.exit(0);
    } else {
        console.log(`\n${COLORS.red}${COLORS.bright}💥 FAILURE: Some systems reported errors.${COLORS.reset}`);
        process.exit(1);
    }
}

main().catch(console.error);
