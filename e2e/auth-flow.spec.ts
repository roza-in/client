import { test, expect, type Page } from '@playwright/test';

/**
 * Auth Flow E2E Tests
 *
 * Tests login → dashboard redirect → session state → logout → restricted route redirect
 *
 * NOTE: These tests require a running dev server (or use the webServer config in
 * playwright.config.ts). They test the FULL auth flow against the real UI.
 *
 * Set env vars E2E_TEST_EMAIL / E2E_TEST_PASSWORD or use the defaults below.
 */

const TEST_EMAIL = process.env.E2E_TEST_EMAIL || 'test@rozx.in';
const TEST_PASSWORD = process.env.E2E_TEST_PASSWORD || 'Test@1234';

// ── Helpers ──────────────────────────────────────────────────────────────────

async function loginViaEmail(page: Page, email: string, password: string) {
    await page.goto('/login');
    // Switch to email tab if not already active
    const emailTab = page.getByRole('button', { name: /email login/i });
    if (await emailTab.isVisible()) {
        await emailTab.click();
    }
    await page.getByPlaceholder('john@example.com').fill(email);
    await page.getByPlaceholder('••••••••').fill(password);
    await page.getByRole('button', { name: /sign in/i }).click();
}

// ── Tests ────────────────────────────────────────────────────────────────────

test.describe('Auth Flow E2E', () => {
    test.beforeEach(async ({ page }) => {
        // Clear cookies to start fresh
        await page.context().clearCookies();
    });

    test('should show login page with Welcome Back heading', async ({ page }) => {
        await page.goto('/login');
        await expect(page.getByText('Welcome Back')).toBeVisible();
    });

    test('login form shows validation errors for empty submit', async ({ page }) => {
        await page.goto('/login');
        // Switch to email tab
        const emailTab = page.getByRole('button', { name: /email login/i });
        if (await emailTab.isVisible()) {
            await emailTab.click();
        }
        // Click sign in without filling
        await page.getByRole('button', { name: /sign in/i }).click();
        // Should show validation errors
        await expect(page.getByText(/invalid email/i)).toBeVisible({ timeout: 3000 });
    });

    test('login form shows error for invalid credentials', async ({ page }) => {
        await page.goto('/login');
        const emailTab = page.getByRole('button', { name: /email login/i });
        if (await emailTab.isVisible()) {
            await emailTab.click();
        }
        await page.getByPlaceholder('john@example.com').fill('wrong@email.com');
        await page.getByPlaceholder('••••••••').fill('wrongpassword');
        await page.getByRole('button', { name: /sign in/i }).click();

        // Should show an error (toast or inline)
        const errorVisible = await page.getByText(/invalid|error|incorrect|not found/i).isVisible({ timeout: 10000 }).catch(() => false);
        expect(errorVisible).toBe(true);
    });

    test('successful login redirects to dashboard', async ({ page }) => {
        await loginViaEmail(page, TEST_EMAIL, TEST_PASSWORD);

        // Should redirect to a protected dashboard route
        await page.waitForURL(/\/(patient|doctor|hospital|admin|reception|pharmacy)/, { timeout: 15000 });
        const url = page.url();
        expect(url).toMatch(/\/(patient|doctor|hospital|admin|reception|pharmacy)/);
    });

    test('authenticated user visiting /login gets redirected to dashboard', async ({ page }) => {
        // Login first
        await loginViaEmail(page, TEST_EMAIL, TEST_PASSWORD);
        await page.waitForURL(/\/(patient|doctor|hospital|admin|reception|pharmacy)/, { timeout: 15000 });

        // Now try visiting /login again
        await page.goto('/login');
        // Should be redirected back to dashboard (not stay on login)
        await page.waitForURL(/\/(patient|doctor|hospital|admin|reception|pharmacy)/, { timeout: 10000 });
    });

    test('logout clears session and redirects to login', async ({ page }) => {
        // Login first
        await loginViaEmail(page, TEST_EMAIL, TEST_PASSWORD);
        await page.waitForURL(/\/(patient|doctor|hospital|admin|reception|pharmacy)/, { timeout: 15000 });

        // Find and click logout (usually in user menu / dropdown)
        const logoutButton = page.getByRole('button', { name: /log\s*out|sign\s*out/i });
        const logoutLink = page.getByRole('link', { name: /log\s*out|sign\s*out/i });
        const menuButton = page.getByRole('button', { name: /menu|profile|avatar/i });

        // Try opening a dropdown menu first if logout isn't directly visible
        if (await menuButton.isVisible().catch(() => false)) {
            await menuButton.click();
        }

        if (await logoutButton.isVisible().catch(() => false)) {
            await logoutButton.click();
        } else if (await logoutLink.isVisible().catch(() => false)) {
            await logoutLink.click();
        }

        // Should redirect to login
        await page.waitForURL(/\/login/, { timeout: 10000 });
    });

    test('unauthenticated user visiting protected route gets redirected to login', async ({ page }) => {
        // Visit a protected route without logging in
        await page.goto('/patient');
        await page.waitForURL(/\/login/, { timeout: 10000 });
        expect(page.url()).toContain('/login');
    });

    test('phone OTP tab is visible and functional', async ({ page }) => {
        await page.goto('/login');
        const phoneTab = page.getByRole('button', { name: /phone otp/i });
        if (await phoneTab.isVisible()) {
            await phoneTab.click();
        }
        // Phone number field should be visible
        await expect(page.getByPlaceholder('9876543210')).toBeVisible();
    });

    test('register link navigates from login to register page', async ({ page }) => {
        await page.goto('/login');
        await page.getByRole('link', { name: /create account/i }).click();
        await page.waitForURL(/\/register/, { timeout: 5000 });
        expect(page.url()).toContain('/register');
    });
});
