import { Metadata } from 'next';
import { RefreshCcw, ChevronRight, Clock, CheckCircle2, AlertCircle, Mail, Phone, XCircle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Refund Policy | Rozx Healthcare',
    description: 'Understand our refund and cancellation policies for appointments and services.',
};

export default function RefundPage() {
    return (
        <div className="space-y-0 text-foreground bg-muted/30 min-h-screen pb-20">
            {/* Hero Section */}
            <section className="relative py-20 bg-linear-to-br from-primary/5 via-transparent to-primary/10 border-b">
                <div className="container relative">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary mb-6">
                            <RefreshCcw className="h-3.5 w-3.5" />
                            Money Back Guarantee
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                            Refund Policy
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Transparent and fair cancellation policies. We value your time and trust.
                        </p>
                        <div className="mt-6 text-sm font-medium text-muted-foreground">
                            Last updated: February 2, 2026
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="container max-w-5xl -mt-10 relative z-10">
                <div className="grid lg:grid-cols-[250px_1fr] gap-8 items-start">

                    {/* Table of Contents (Sticky Sidebar) */}
                    <div className="hidden lg:block sticky top-24 space-y-2">
                        <p className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4 pl-3">Contents</p>
                        <nav className="flex flex-col space-y-1">
                            {['Patient Cancellation', 'Doctor Cancellation', 'Technical Issues', 'Payment Failures', 'Timelines', 'Contact Support'].map((item, i) => (
                                <a key={item} href={`#section-${i + 1}`} className="text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 px-3 py-2 rounded-md transition-colors text-left flex items-center justify-between group">
                                    {item}
                                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Main Document Card */}
                    <div className="rounded-2xl border bg-background p-8 md:p-12 shadow-sm">

                        {/* Refund Matrix */}
                        <div className="grid md:grid-cols-3 gap-4 mb-12 not-prose">
                            {/* > 24 Hours */}
                            <div className="p-5 rounded-xl border bg-green-50/50 border-green-100 dark:bg-green-950/10 dark:border-green-900 flex flex-col gap-3">
                                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-green-900 dark:text-green-100 mb-1">100% Refund</h3>
                                    <p className="text-xs text-muted-foreground">
                                        More than <strong>24 hours</strong> before appointment.
                                    </p>
                                </div>
                            </div>

                            {/* 12-24 Hours */}
                            <div className="p-5 rounded-xl border bg-yellow-50/50 border-yellow-100 dark:bg-yellow-950/10 dark:border-yellow-900 flex flex-col gap-3">
                                <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 shrink-0">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-yellow-900 dark:text-yellow-100 mb-1">50% Refund</h3>
                                    <p className="text-xs text-muted-foreground">
                                        Between <strong>12 to 24 hours</strong> before appointment.
                                    </p>
                                </div>
                            </div>

                            {/* < 12 Hours */}
                            <div className="p-5 rounded-xl border bg-red-50/50 border-red-100 dark:bg-red-950/10 dark:border-red-900 flex flex-col gap-3">
                                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                                    <XCircle className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-red-900 dark:text-red-100 mb-1">No Refund</h3>
                                    <p className="text-xs text-muted-foreground">
                                        Less than <strong>12 hours</strong> before appointment.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground hover:prose-a:text-primary transition-colors">

                            <h2 id="section-1">1. Cancellation by Patient</h2>
                            <p>
                                We understand plans change. You can cancel your appointment through the "My Appointments" section of the app or website.
                                Refunds are subject to the timing of your cancellation request relative to the scheduled appointment time:
                            </p>
                            <ul className="marker:text-primary">
                                <li><strong>Full Refund (100%):</strong> If you cancel <strong>more than 24 hours</strong> before the scheduled time. Platform fees will also be refunded.</li>
                                <li><strong>Partial Refund (50%):</strong> If you cancel within the window of <strong>12 to 24 hours</strong> before the scheduled time. Platform fees are non-refundable.</li>
                                <li><strong>No Refund (0%):</strong> If cancellation is made <strong>less than 12 hours</strong> before the appointment. This policy compensates the doctor for the blocked time slot.</li>
                                <li><strong>No Show:</strong> If you miss your appointment without cancelling, no refund will be issued.</li>
                            </ul>

                            <h2 id="section-2">2. Cancellation by Doctor</h2>
                            <p>
                                If the doctor cancels your appointment for any reason, you are automatically eligible for a <strong>Full Refund</strong> (including platform fees).
                                Alternatively, we can help you reschedule with priority support.
                            </p>

                            <h2 id="section-3">3. Technical Issues (Video Consultations)</h2>
                            <p>
                                In the unlikely event of technical disruptions during a video consultation attributable to our platform:
                            </p>
                            <ul>
                                <li>We will attempt to reconnect or reschedule the session.</li>
                                <li>If the session cannot be completed, a full refund will be provided.</li>
                            </ul>

                            <h2 id="section-4">4. Payment Failure & Double Deductions</h2>
                            <p>
                                If an amount is deducted from your account but the appointment is not booked:
                            </p>
                            <ul>
                                <li>The amount is auto-refunded by the gateway within <strong>5-7 business days</strong>.</li>
                                <li>If not received, please contact support with your transaction ID.</li>
                            </ul>

                            <h2 id="section-5">5. Processing Timelines</h2>
                            <p>
                                Refunds are processed to the original source of payment. Bank processing times vary:
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 not-prose my-6">
                                <div className="p-4 rounded-lg bg-muted/20 border text-center">
                                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Cards / Netbanking</div>
                                    <div className="font-bold">5-7 Days</div>
                                </div>
                                <div className="p-4 rounded-lg bg-muted/20 border text-center">
                                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">UPI / Wallets</div>
                                    <div className="font-bold">2-4 Days</div>
                                </div>
                            </div>

                            <h2 id="section-6">6. Contact for Refunds</h2>
                            <p>
                                For any refund-related queries or disputes, please reach out to our support team:
                            </p>

                            <div className="not-prose mt-8 grid md:grid-cols-2 gap-4">
                                <a href="mailto:support@rozx.in" className="flex items-center gap-3 p-4 rounded-xl border hover:border-primary/50 bg-background transition-colors">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <span className="font-medium text-sm">support@rozx.in</span>
                                </a>
                                <a href="tel:+917905861940" className="flex items-center gap-3 p-4 rounded-xl border hover:border-primary/50 bg-background transition-colors">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <span className="font-medium text-sm">+91 7905861940</span>
                                </a>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}