import { test, expect } from '@playwright/test';

/**
 * Hydration Smoke Tests
 *
 * Verifies that each public page renders without console errors (particularly
 * hydration mismatches) and contains expected content.
 */

const PUBLIC_PAGES = [
    { path: '/', expectedText: /healthcare|rozx|doctor|hospital/i },
    { path: '/about', expectedText: /about|mission|team/i },
    { path: '/contact', expectedText: /contact|support|email/i },
    { path: '/doctors', expectedText: /doctor/i },
    { path: '/hospitals', expectedText: /hospital/i },
    { path: '/pricing', expectedText: /pricing|plan|free/i },
    { path: '/faqs', expectedText: /faq|question|help/i },
    { path: '/specialties', expectedText: /special/i },
    { path: '/legal/privacy', expectedText: /privacy|data|information/i },
    { path: '/legal/terms', expectedText: /terms|service|agreement/i },
];

test.describe('Hydration Smoke Tests', () => {
    for (const { path, expectedText } of PUBLIC_PAGES) {
        test(`page ${path} renders without hydration error`, async ({ page }) => {
            const consoleErrors: string[] = [];

            // Capture console errors — hydration mismatches come as console.error
            page.on('console', msg => {
                if (msg.type() === 'error') {
                    consoleErrors.push(msg.text());
                }
            });

            const response = await page.goto(path, { waitUntil: 'networkidle' });

            // Page should load successfully
            expect(response?.status()).toBeLessThan(500);

            // Page should have expected content
            const body = await page.textContent('body');
            expect(body).toMatch(expectedText);

            // No hydration mismatch errors
            const hydrationErrors = consoleErrors.filter(e =>
                /hydration|mismatch|did not match|text content does not match/i.test(e)
            );
            expect(hydrationErrors).toHaveLength(0);
        });
    }

    test('homepage hero section renders correctly', async ({ page }) => {
        await page.goto('/', { waitUntil: 'networkidle' });

        // Hero heading
        await expect(page.getByText('Modern Healthcare')).toBeVisible();

        // CTA buttons
        await expect(page.getByRole('link', { name: /find doctors/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /view hospitals/i })).toBeVisible();
    });

    test('homepage navigation links work', async ({ page }) => {
        await page.goto('/', { waitUntil: 'networkidle' });

        // Click "Find Doctors" → should navigate to /doctors
        await page.getByRole('link', { name: /find doctors/i }).first().click();
        await page.waitForURL(/\/doctors/, { timeout: 10000 });
        expect(page.url()).toContain('/doctors');
    });
});
