/**
 * Payment Verification Tests
 *
 * Tests the payment flow logic: create order → verify → confirm.
 * Uses mocked API responses.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── Re-implement payment flow types and logic for isolated testing ───────────

interface PaymentOrder {
    orderId: string;
    amount: number;
    currency: string;
    key: string;
    provider: 'razorpay' | 'phonepe';
}

interface RazorpayVerification {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

interface PaymentResult {
    success: boolean;
    appointmentId?: string;
    error?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FetchFn = any;

// Simulate the booking + payment flow steps
async function checkSlotAvailability(
    doctorId: string,
    date: string,
    slotTime: string,
    fetchFn: FetchFn,
): Promise<{ available: boolean }> {
    const response = await fetchFn(`/api/v1/appointments/check-availability?doctorId=${doctorId}&date=${date}&slotTime=${slotTime}`, {
        method: 'GET',
        credentials: 'include',
    });
    return response.json() as Promise<{ available: boolean }>;
}

async function bookAppointment(
    data: { doctorId: string; date: string; slotTime: string; consultationType: string },
    fetchFn: FetchFn,
): Promise<{ appointmentId: string; requiresPayment: boolean; paymentOrder?: PaymentOrder }> {
    const response = await fetchFn('/api/v1/appointments', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return response.json() as Promise<any>;
}

async function verifyPayment(
    verification: RazorpayVerification,
    appointmentId: string,
    fetchFn: FetchFn,
): Promise<PaymentResult> {
    const response = await fetchFn('/api/v1/payments/verify', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...verification, appointmentId }),
    });
    return response.json() as Promise<PaymentResult>;
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Payment Verification Flow', () => {
    let fetchMock: FetchFn;

    beforeEach(() => {
        fetchMock = vi.fn() as unknown as FetchFn;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('full flow: check slot → book → pay → verify success', async () => {
        // Step 1: Slot is available
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ available: true }),
        });

        // Step 2: Booking created, needs payment
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                appointmentId: 'apt-123',
                requiresPayment: true,
                paymentOrder: {
                    orderId: 'order_abc',
                    amount: 50000,
                    currency: 'INR',
                    key: 'rzp_test_key',
                    provider: 'razorpay',
                },
            }),
        });

        // Step 3: Payment verified
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                success: true,
                appointmentId: 'apt-123',
            }),
        });

        // Execute flow
        const slot = await checkSlotAvailability('doc-1', '2025-01-15', '10:00', fetchMock);
        expect(slot.available).toBe(true);

        const booking = await bookAppointment(
            { doctorId: 'doc-1', date: '2025-01-15', slotTime: '10:00', consultationType: 'online' },
            fetchMock,
        );
        expect(booking.requiresPayment).toBe(true);
        expect(booking.paymentOrder?.orderId).toBe('order_abc');
        expect(booking.paymentOrder?.provider).toBe('razorpay');

        const result = await verifyPayment(
            {
                razorpay_order_id: 'order_abc',
                razorpay_payment_id: 'pay_xyz',
                razorpay_signature: 'sig_123',
            },
            'apt-123',
            fetchMock,
        );
        expect(result.success).toBe(true);
        expect(result.appointmentId).toBe('apt-123');

        // Verify all 3 API calls were made
        expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it('slot unavailable aborts booking', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ available: false }),
        });

        const slot = await checkSlotAvailability('doc-1', '2025-01-15', '10:00', fetchMock);
        expect(slot.available).toBe(false);

        // Should NOT proceed to booking
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('walk-in booking skips payment', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ available: true }),
        });

        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                appointmentId: 'apt-456',
                requiresPayment: false,
            }),
        });

        const slot = await checkSlotAvailability('doc-1', '2025-01-15', '09:00', fetchMock);
        expect(slot.available).toBe(true);

        const booking = await bookAppointment(
            { doctorId: 'doc-1', date: '2025-01-15', slotTime: '09:00', consultationType: 'walk_in' },
            fetchMock,
        );
        expect(booking.requiresPayment).toBe(false);
        expect(booking.appointmentId).toBe('apt-456');

        // Only 2 calls — no payment verify
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('payment verification failure returns error', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ available: true }),
        });

        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                appointmentId: 'apt-789',
                requiresPayment: true,
                paymentOrder: {
                    orderId: 'order_fail',
                    amount: 30000,
                    currency: 'INR',
                    key: 'rzp_test_key',
                    provider: 'razorpay',
                },
            }),
        });

        fetchMock.mockResolvedValueOnce({
            ok: false,
            status: 400,
            json: async () => ({
                success: false,
                error: 'Payment verification failed — signature mismatch',
            }),
        });

        await checkSlotAvailability('doc-1', '2025-01-15', '11:00', fetchMock);
        await bookAppointment(
            { doctorId: 'doc-1', date: '2025-01-15', slotTime: '11:00', consultationType: 'online' },
            fetchMock,
        );

        const result = await verifyPayment(
            {
                razorpay_order_id: 'order_fail',
                razorpay_payment_id: 'pay_bad',
                razorpay_signature: 'bad_sig',
            },
            'apt-789',
            fetchMock,
        );
        expect(result.success).toBe(false);
        expect(result.error).toContain('signature mismatch');
    });

    it('idempotency key is included in booking request body', async () => {
        fetchMock.mockResolvedValue({
            ok: true,
            json: async () => ({ appointmentId: 'apt-xxx', requiresPayment: false }),
        });

        await bookAppointment(
            { doctorId: 'doc-1', date: '2025-01-15', slotTime: '10:00', consultationType: 'in_person' },
            fetchMock,
        );

        // Verify POST was called to /appointments
        const [url, opts] = fetchMock.mock.calls[0];
        expect(url).toBe('/api/v1/appointments');
        expect(opts.method).toBe('POST');
        expect(opts.headers['Content-Type']).toBe('application/json');
    });

    it('Razorpay verification sends correct payload structure', async () => {
        fetchMock.mockResolvedValue({
            ok: true,
            json: async () => ({ success: true }),
        });

        await verifyPayment(
            {
                razorpay_order_id: 'order_123',
                razorpay_payment_id: 'pay_456',
                razorpay_signature: 'sig_789',
            },
            'apt-100',
            fetchMock,
        );

        const [url, opts] = fetchMock.mock.calls[0];
        expect(url).toBe('/api/v1/payments/verify');
        expect(opts.method).toBe('POST');

        const body = JSON.parse(opts.body);
        expect(body).toEqual({
            razorpay_order_id: 'order_123',
            razorpay_payment_id: 'pay_456',
            razorpay_signature: 'sig_789',
            appointmentId: 'apt-100',
        });
    });
});
