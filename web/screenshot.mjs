import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  // Navigate to the dashboard
  await page.goto('http://localhost:3000/dashboard');

  // Wait for the page to load
  await page.waitForLoadState('networkidle');

  // Take screenshot
  await page.screenshot({
    path: 'screenshot-dashboard.png',
    fullPage: true
  });

  console.log('Screenshot saved as screenshot-dashboard.png');

  await browser.close();
})();
