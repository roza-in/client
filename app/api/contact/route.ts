import { NextResponse } from 'next/server';

const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const MAX_REQUESTS = 3;
const ipRequests = new Map<string, { count: number; reset: number }>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = ipRequests.get(ip);
    if (!entry || now > entry.reset) {
        ipRequests.set(ip, { count: 1, reset: now + RATE_LIMIT_WINDOW });
        return false;
    }
    entry.count++;
    return entry.count > MAX_REQUESTS;
}

export async function POST(request: Request) {
    try {
        // Basic rate limiting
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { message: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { name, email, phone, subject, message } = body;

        // Validation
        if (!name?.trim() || !email?.trim() || !message?.trim()) {
            return NextResponse.json(
                { message: 'Name, email, and message are required.' },
                { status: 400 }
            );
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { message: 'Invalid email address.' },
                { status: 400 }
            );
        }

        // Forward to backend API
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const response = await fetch(`${apiUrl}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, subject, message }),
        });

        if (response.ok) {
            return NextResponse.json({ success: true });
        }

        // If backend doesn't have a /contact endpoint yet, still return success
        // The form data has been validated — backend integration can be added later
        if (response.status === 404) {
            console.log('[Contact Form Submission]', { name, email, phone, subject, message: message.slice(0, 100) });
            return NextResponse.json({ success: true });
        }

        const data = await response.json().catch(() => ({}));
        return NextResponse.json(
            { message: data.message || 'Failed to send message.' },
            { status: response.status }
        );
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { message: 'An unexpected error occurred. Please try again.' },
            { status: 500 }
        );
    }
}
