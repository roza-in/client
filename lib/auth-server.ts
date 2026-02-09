import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { publicRoutes } from '@/config/routes';

/**
 * Server-side auth guard to protect dashboard routes.
 * To be used in layout.tsx or page.tsx (Server Components).
 */
export async function protectDashboard() {
    const cookieStore = await cookies();
    const token = cookieStore.get('rozx_access');

    if (!token) {
        redirect(publicRoutes.login);
    }

    // Optional: Add logic to verify token or check role
    // For now, presence of token is our "authenticated" signal
}

/**
 * Public route guard to redirect logged-in users away from login/register.
 */
export async function redirectIfAuthenticated(dashboardPath: string = '/patient') {
    const cookieStore = await cookies();
    const token = cookieStore.get('rozx_access');

    if (token) {
        redirect(dashboardPath);
    }
}
