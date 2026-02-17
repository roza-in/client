/**
 * API Error Handler Tests
 *
 * Tests the ApiError class, getErrorMessage(), isErrorCode(), and withRetry().
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiError, getErrorMessage, isErrorCode, withRetry } from '@/lib/api/error-handler';

describe('ApiError class', () => {
    it('creates error with all properties', () => {
        const err = new ApiError('Not found', 404, 'USER_NOT_FOUND', { id: '123' });
        expect(err.message).toBe('Not found');
        expect(err.status).toBe(404);
        expect(err.code).toBe('USER_NOT_FOUND');
        expect(err.details).toEqual({ id: '123' });
        expect(err.name).toBe('ApiError');
        expect(err).toBeInstanceOf(Error);
    });

    it.each([
        ['isAuthError', 401, true],
        ['isAuthError', 403, false],
        ['isForbiddenError', 403, true],
        ['isForbiddenError', 401, false],
        ['isNotFoundError', 404, true],
        ['isNotFoundError', 400, false],
        ['isValidationError', 400, true],
        ['isValidationError', 422, true],
        ['isValidationError', 401, false],
        ['isRateLimitError', 429, true],
        ['isRateLimitError', 403, false],
        ['isServerError', 500, true],
        ['isServerError', 502, true],
        ['isServerError', 499, false],
    ] as const)('%s for status %d → %s', (method, status, expected) => {
        const err = new ApiError('test', status);
        expect((err as any)[method]()).toBe(expected);
    });

    it('isNetworkError — status 0', () => {
        const err = new ApiError('Network error', 0);
        expect(err.isNetworkError()).toBe(true);
    });

    it('isNetworkError — code NETWORK_ERROR', () => {
        const err = new ApiError('Network error', 500, 'NETWORK_ERROR');
        expect(err.isNetworkError()).toBe(true);
    });

    it('isTimeoutError — status 408', () => {
        const err = new ApiError('Timeout', 408);
        expect(err.isTimeoutError()).toBe(true);
    });

    it('isTimeoutError — code TIMEOUT_ERROR', () => {
        const err = new ApiError('Timeout', 500, 'TIMEOUT_ERROR');
        expect(err.isTimeoutError()).toBe(true);
    });
});

describe('getErrorMessage()', () => {
    it.each([
        ['INVALID_CREDENTIALS', 'Invalid email or password'],
        ['USER_NOT_FOUND', 'Account not found'],
        ['EMAIL_ALREADY_EXISTS', 'An account with this email already exists'],
        ['PHONE_ALREADY_EXISTS', 'An account with this phone number already exists'],
        ['INVALID_OTP', 'Invalid or expired OTP'],
        ['OTP_EXPIRED', 'OTP has expired. Please request a new one'],
        ['SLOT_NOT_AVAILABLE', 'This slot is no longer available'],
        ['PAYMENT_FAILED', 'Payment failed. Please try again'],
        ['NETWORK_ERROR', 'Network error. Please check your connection'],
        ['TIMEOUT_ERROR', 'Request timed out. Please try again'],
    ])('maps code "%s" → "%s"', (code, expectedMessage) => {
        const err = new ApiError('default', 400, code);
        expect(getErrorMessage(err)).toBe(expectedMessage);
    });

    it('falls back to error message for unknown codes', () => {
        const err = new ApiError('Something custom', 400, 'UNKNOWN_CODE');
        expect(getErrorMessage(err)).toBe('Something custom');
    });

    it('handles plain Error instances', () => {
        expect(getErrorMessage(new Error('plain'))).toBe('plain');
    });

    it('handles non-error values', () => {
        expect(getErrorMessage('string error')).toBe('An unexpected error occurred');
        expect(getErrorMessage(null)).toBe('An unexpected error occurred');
        expect(getErrorMessage(42)).toBe('An unexpected error occurred');
    });
});

describe('isErrorCode()', () => {
    it('returns true for matching ApiError code', () => {
        const err = new ApiError('test', 400, 'INVALID_CREDENTIALS');
        expect(isErrorCode(err, 'INVALID_CREDENTIALS')).toBe(true);
    });

    it('returns false for non-matching code', () => {
        const err = new ApiError('test', 400, 'INVALID_CREDENTIALS');
        expect(isErrorCode(err, 'USER_NOT_FOUND')).toBe(false);
    });

    it('returns false for non-ApiError', () => {
        expect(isErrorCode(new Error('test'), 'INVALID_CREDENTIALS')).toBe(false);
        expect(isErrorCode(null, 'INVALID_CREDENTIALS')).toBe(false);
    });
});

describe('withRetry()', () => {
    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    it('returns result on first success', async () => {
        const fn = vi.fn().mockResolvedValue('ok');
        const result = await withRetry(fn, { maxRetries: 3, delay: 10 });
        expect(result).toBe('ok');
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('retries on server error and succeeds', async () => {
        const fn = vi.fn()
            .mockRejectedValueOnce(new ApiError('Server error', 500, 'INTERNAL'))
            .mockResolvedValueOnce('recovered');

        const result = await withRetry(fn, { maxRetries: 3, delay: 10 });
        expect(result).toBe('recovered');
        expect(fn).toHaveBeenCalledTimes(2);
    });

    it('retries on network error and succeeds', async () => {
        const fn = vi.fn()
            .mockRejectedValueOnce(new ApiError('Network', 0, 'NETWORK_ERROR'))
            .mockResolvedValueOnce('back');

        const result = await withRetry(fn, { maxRetries: 3, delay: 10 });
        expect(result).toBe('back');
        expect(fn).toHaveBeenCalledTimes(2);
    });

    it('throws after max retries exhausted', async () => {
        const err = new ApiError('Down', 500, 'INTERNAL');
        const fn = vi.fn().mockRejectedValue(err);

        await expect(withRetry(fn, { maxRetries: 2, delay: 10 })).rejects.toThrow('Down');
        expect(fn).toHaveBeenCalledTimes(3); // 1 initial + 2 retries
    });

    it('does not retry non-retryable errors (e.g. 401)', async () => {
        const err = new ApiError('Unauthorized', 401, 'UNAUTHORIZED');
        const fn = vi.fn().mockRejectedValue(err);

        await expect(withRetry(fn, { maxRetries: 3, delay: 10 })).rejects.toThrow('Unauthorized');
        expect(fn).toHaveBeenCalledTimes(1); // no retry
    });

    it('does not retry 404 errors', async () => {
        const err = new ApiError('Not found', 404, 'NOT_FOUND');
        const fn = vi.fn().mockRejectedValue(err);

        await expect(withRetry(fn, { maxRetries: 3, delay: 10 })).rejects.toThrow('Not found');
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('respects custom shouldRetry', async () => {
        const err = new ApiError('Custom', 418);
        const fn = vi.fn().mockRejectedValue(err);

        await expect(
            withRetry(fn, {
                maxRetries: 2,
                delay: 10,
                shouldRetry: (e: unknown) => e instanceof ApiError && e.status === 418,
            }),
        ).rejects.toThrow('Custom');

        // 1 initial + 2 retries = 3 calls
        expect(fn).toHaveBeenCalledTimes(3);
    });
});
