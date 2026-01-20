// using built-in fetch in Node 18+

const BASE_URL = 'http://localhost:3000';
const CONCURRENCY = 20;
const TOTAL_REQUESTS = 100;

async function runTest() {
    console.log(`Starting stress test against ${BASE_URL} with concurrency ${CONCURRENCY}...`);

    const results = {
        success: 0,
        fail: 0,
        times: []
    };

    const batch = [];

    // Simple verification endpoint (using public page if API needs auth)
    // We'll hit the landing page which does some SSR
    const targetUrl = `${BASE_URL}/`;

    for (let i = 0; i < TOTAL_REQUESTS; i++) {
        batch.push((async () => {
            const start = Date.now();
            try {
                // Use built-in fetch if node version supports it, else require
                // In this env, likely Node 18+
                const res = await fetch(targetUrl);
                const duration = Date.now() - start;
                results.times.push(duration);
                if (res.ok) {
                    process.stdout.write('.');
                    results.success++;
                } else {
                    process.stdout.write('x');
                    results.fail++;
                }
            } catch (e) {
                process.stdout.write('E');
                results.fail++;
                console.error(e.message);
            }
        })());

        if (batch.length >= CONCURRENCY) {
            await Promise.all(batch);
            batch.length = 0;
        }
    }

    await Promise.all(batch); // Finish remaining

    console.log('\n\n--- Test Complete ---');
    console.log(`Total Requests: ${TOTAL_REQUESTS}`);
    console.log(`Success: ${results.success}`);
    console.log(`Fail: ${results.fail}`);

    const avg = results.times.reduce((a, b) => a + b, 0) / results.times.length;
    console.log(`Average Response Time: ${avg.toFixed(2)}ms`);

    if (results.fail > 0) {
        process.exit(1);
    }
}

runTest().catch(console.error);
