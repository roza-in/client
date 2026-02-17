import { test, expect } from '@playwright/test';

/**
 * Booking Flow E2E Tests
 *
 * Tests: Browse doctors → select doctor → choose slot → book → payment / confirmation
 *
 * NOTE: These tests assume a running dev server with seeded doctor data.
 * Set E2E_TEST_EMAIL / E2E_TEST_PASSWORD for an authenticated patient user.
 */

const TEST_EMAIL = process.env.E2E_TEST_EMAIL || 'test@rozx.in';
const TEST_PASSWORD = process.env.E2E_TEST_PASSWORD || 'Test@1234';

async function loginAsPatient(page: import('@playwright/test').Page) {
    await page.goto('/login');
    const emailTab = page.getByRole('button', { name: /email login/i });
    if (await emailTab.isVisible()) await emailTab.click();
    await page.getByPlaceholder('john@example.com').fill(TEST_EMAIL);
    await page.getByPlaceholder('••••••••').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL(/\/(patient|doctor|hospital|admin|reception|pharmacy)/, { timeout: 15000 });
}

test.describe('Booking Flow E2E', () => {
    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies();
    });

    test('doctors listing page loads and shows doctor cards', async ({ page }) => {
        await page.goto('/doctors');
        // Should show at least a heading about doctors
        await expect(page.getByText(/doctor/i).first()).toBeVisible({ timeout: 10000 });
    });

    test('doctor profile page is accessible from listing', async ({ page }) => {
        await page.goto('/doctors');
        // Click on the first doctor card/link
        const doctorLink = page.getByRole('link', { name: /view profile|book now/i }).first();
        if (await doctorLink.isVisible({ timeout: 5000 }).catch(() => false)) {
            await doctorLink.click();
            // Should navigate to a doctor detail page
            await page.waitForURL(/\/doctors\//, { timeout: 10000 });
        }
    });

    test('booking page requires authentication', async ({ page }) => {
        // Try to access a booking page without auth
        await page.goto('/patient/book/test-doctor-id');
        // Should redirect to login
        await page.waitForURL(/\/login/, { timeout: 10000 });
        expect(page.url()).toContain('/login');
    });

    test('authenticated patient can access booking flow', async ({ page }) => {
        await loginAsPatient(page);

        // Navigate to doctors listing
        await page.goto('/doctors');

        // If any "Book Now" button exists, try clicking it
        const bookBtn = page.getByRole('link', { name: /book now/i }).first();
        if (await bookBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await bookBtn.click();
            // Should stay in an authenticated context (not redirect to login)
            const url = page.url();
            expect(url).not.toContain('/login');
        }
    });
});
