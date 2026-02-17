'use client';

import { useState, type FormEvent } from 'react';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface ContactFormState {
    name: string;
    phone: string;
    email: string;
    subject: string;
    message: string;
}

const initialState: ContactFormState = {
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
};

export function ContactForm() {
    const [form, setForm] = useState<ContactFormState>(initialState);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setErrorMessage('');

        // Basic validation
        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
            setErrorMessage('Please fill in all required fields.');
            return;
        }

        setStatus('submitting');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || 'Failed to send message. Please try again.');
            }

            setStatus('success');
            setForm(initialState);
        } catch (err) {
            setStatus('error');
            setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        }
    }

    if (status === 'success') {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Message Sent!</h3>
                <p className="text-muted-foreground max-w-sm">
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
                <button
                    onClick={() => setStatus('idle')}
                    className="text-sm font-medium text-primary hover:underline"
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium mb-1.5">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="Your name"
                    />
                </div>
                <div>
                    <label htmlFor="contact-phone" className="block text-sm font-medium mb-1.5">Phone</label>
                    <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="+91 79058 XXXXX"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="contact-email" className="block text-sm font-medium mb-1.5">
                    Email <span className="text-red-500">*</span>
                </label>
                <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="you@example.com"
                />
            </div>

            <div>
                <label htmlFor="contact-subject" className="block text-sm font-medium mb-1.5">Subject</label>
                <select
                    id="contact-subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                    <option value="">Select a topic</option>
                    <option value="patient">Patient Support</option>
                    <option value="doctor">Doctor Onboarding</option>
                    <option value="hospital">Hospital Partnership</option>
                    <option value="technical">Technical Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div>
                <label htmlFor="contact-message" className="block text-sm font-medium mb-1.5">
                    Message <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    value={form.message}
                    onChange={handleChange}
                    className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all"
                    placeholder="How can we help you?"
                />
            </div>

            {errorMessage && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{errorMessage}</p>
            )}

            <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {status === 'submitting' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Send className="h-4 w-4" />
                )}
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>

            <p className="text-xs text-center text-muted-foreground px-4">
                By submitting this form, you agree to our{' '}
                <Link href="/privacy" className="text-primary hover:underline font-medium">
                    Privacy Policy
                </Link>
            </p>
        </form>
    );
}
