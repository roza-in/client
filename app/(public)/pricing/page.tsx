import { Metadata } from 'next';
import Link from 'next/link';
import { Check, X, Info, ArrowRight, Wallet, Activity, CreditCard, Building2, Video, Users, ChevronDown } from 'lucide-react';
import { routes } from '@/config';

export const metadata: Metadata = {
    title: 'Pricing | ROZX Healthcare',
    description: 'Transparent pricing for patients and providers. No hidden fees, pay only when you earn.',
};

export default function PricingPage() {
    return (
        <div className="bg-background min-h-screen">

            {/* Hero Section */}
            <section className="relative py-20 lg:py-24 overflow-hidden border-b">
                <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-primary/5 to-transparent pointer-events-none" />
                <div className="container relative text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary mb-6 animate-fade-in">
                        <Wallet className="h-3.5 w-3.5" />
                        Simple & Transparent
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6 bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent pb-1">
                        Pricing that makes sense. <br className="hidden sm:block" />
                        <span className="text-primary">Zero fixed costs.</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        We believe healthcare should be accessible. Patients pay nothing to book.
                        Providers only pay a small commission on successful appointments.
                    </p>
                </div>
            </section>

            {/* Split Section: Patients vs Providers */}
            <section className="container py-16 -mt-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">

                    {/* Patient Card */}
                    <div className="bg-background rounded-3xl border shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                        <div className="p-8 md:p-10 text-center border-b bg-muted/20">
                            <span className="inline-block p-3 rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 mb-4">
                                <Users className="h-8 w-8" />
                            </span>
                            <h2 className="text-2xl font-bold mb-2">For Patients</h2>
                            <p className="text-muted-foreground">Premium healthcare access, completely free.</p>
                            <div className="mt-8">
                                <span className="text-5xl font-extrabold text-foreground">₹0</span>
                                <span className="text-muted-foreground font-medium"> / forever</span>
                            </div>
                        </div>
                        <div className="p-8 md:p-10 space-y-6">
                            <ul className="space-y-4">
                                {[
                                    { text: 'Unlimited searching & booking', desc: 'Find doctors & hospitals near you' },
                                    { text: 'Digital Health Lockers', desc: 'Securely store prescriptions & reports' },
                                    { text: 'AI Health Insights', desc: 'Smart summary of your medical history' },
                                    { text: 'Live Queue Tracking', desc: 'Track your token number from home' },
                                    { text: 'Family Profiles', desc: 'Manage health for parents & kids' },
                                    { text: 'Smart Reminders', desc: 'WhatsApp alerts for appointments' },
                                    { text: '100% Refund Protection', desc: 'Guaranteed refunds on cancellations' }
                                ].map((feature) => (
                                    <li key={feature.text} className="flex items-start gap-3">
                                        <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0 mt-0.5">
                                            <Check className="h-3.5 w-3.5" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold">{feature.text}</div>
                                            <div className="text-xs text-muted-foreground">{feature.desc}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/auth/register"
                                className="block w-full py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-center hover:opacity-90 transition-opacity shadow-lg shadow-slate-900/10"
                            >
                                Sign Up Free
                            </Link>
                        </div>
                    </div>

                    {/* Provider Card */}
                    <div className="bg-slate-900 text-white rounded-3xl border border-slate-700 shadow-2xl overflow-hidden hover:scale-[1.01] transition-transform duration-300 relative">
                        <div className="absolute top-0 right-0 p-3 bg-primary text-white text-xs font-bold rounded-bl-2xl">
                            PAY AS YOU EARN
                        </div>
                        <div className="p-8 md:p-10 text-center border-b border-slate-800 bg-slate-900/50">
                            <span className="inline-block p-3 rounded-2xl bg-white/10 text-primary-foreground mb-4">
                                <Building2 className="h-8 w-8" />
                            </span>
                            <h2 className="text-2xl font-bold mb-2">For Hospitals & Clinics</h2>
                            <p className="text-slate-400">Grow your practice with zero upfront investment.</p>
                            <div className="mt-8 flex items-center justify-center gap-2">
                                <span className="text-5xl font-extrabold text-white">0%</span>
                                <span className="text-slate-400 font-medium text-left leading-tight text-sm">
                                    Fixed Monthly <br /> Subscription
                                </span>
                            </div>
                        </div>

                        <div className="p-8 md:p-10 space-y-8">

                            {/* Commission Fees */}
                            <div className="space-y-3">
                                {/* Online */}
                                <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 flex items-start gap-4">
                                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 shrink-0">
                                        <Video className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className="font-semibold text-sm">Online (Video)</h3>
                                            <span className="font-bold text-blue-400">8% Total</span>
                                        </div>
                                        <div className="text-xs text-slate-400 flex gap-2">
                                            <span>6% Platform</span>
                                            <span className="text-slate-600">+</span>
                                            <span>2% Gateway</span>
                                        </div>
                                    </div>
                                </div>

                                {/* In-Person */}
                                <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 flex items-start gap-4">
                                    <div className="p-2 rounded-lg bg-green-500/20 text-green-400 shrink-0">
                                        <Building2 className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className="font-semibold text-sm">Clinic Visit (App)</h3>
                                            <span className="font-bold text-green-400">4% Total</span>
                                        </div>
                                        <div className="text-xs text-slate-400 flex gap-2">
                                            <span>2% Platform</span>
                                            <span className="text-slate-600">+</span>
                                            <span>2% Gateway</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Walk-In */}
                                <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 flex items-start gap-4">
                                    <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 shrink-0">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className="font-semibold text-sm">Walk-In (Desk)</h3>
                                            <span className="font-bold text-white">Free (₹0)</span>
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            Manage your own patients for free
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-800">
                                <p className="text-xs text-slate-500 text-center mb-4">
                                    Includes powerful features to manage your practice
                                </p>
                                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                    {['Smart Calendar', 'Patient Records (EMR)', 'Analytics Dashboard', 'Staff Management'].map(f => (
                                        <div key={f} className="flex items-center gap-2 text-xs text-slate-300">
                                            <Check className="h-3 w-3 text-primary" /> {f}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Link
                                href="/register?type=hospital"
                                className="block w-full py-4 rounded-xl bg-primary text-white font-bold text-center hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                            >
                                Join as Provider
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison Section */}
            <section className="container py-16 max-w-5xl mx-auto border-b">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Why Providers Choose ROZX</h2>
                    <p className="text-muted-foreground text-lg">Compare us with traditional software and other aggregators.</p>
                </div>

                <div className="overflow-x-auto">
                    <div className="min-w-[700px] border rounded-2xl bg-card shadow-xs">
                        {/* Header */}
                        <div className="grid grid-cols-4 p-4 md:p-6 bg-muted/30 border-b text-sm md:text-base font-bold text-center items-center">
                            <div className="text-left pl-4 text-muted-foreground font-medium">Features</div>
                            <div className="text-primary text-xl">ROZX</div>
                            <div className="text-muted-foreground">Typical SaaS<br /><span className="text-xs font-normal opacity-70">Clinic Software</span></div>
                            <div className="text-muted-foreground">Aggregators<br /><span className="text-xs font-normal opacity-70">Booking Apps</span></div>
                        </div>

                        {/* Rows */}
                        <div className="divide-y">
                            {[
                                { feat: 'Annual Charges (AMC)', rozx: '₹0', saas: '₹15,000+', agg: '₹0' },
                                { feat: 'Setup / Onboarding Fee', rozx: '₹0', saas: '₹5,000 - ₹25,000', agg: '₹0' },
                                { feat: 'Walk-In Patients', rozx: 'Free (₹0)', saas: 'Included', agg: 'N/A' },
                                { feat: 'Online/App Bookings', rozx: '4% - 8%', saas: '0%', agg: '20% - 30%' },
                                { feat: 'Settlement Cycle', rozx: 'T+2 Days', saas: 'N/A', agg: 'Weekly / 15 Days' },
                                { feat: 'WhatsApp Reminders', rozx: 'Included', saas: 'Extra ₹1/msg', agg: 'Included' },
                                { feat: 'Marketing & SEO', rozx: 'Included', saas: 'No', agg: 'Paid Boosts' },
                            ].map((row, i) => (
                                <div key={i} className="grid grid-cols-4 p-4 md:p-6 text-center items-center hover:bg-muted/20 transition-colors text-sm md:text-base">
                                    <div className="text-left pl-4 font-medium text-foreground">{row.feat}</div>
                                    <div className="font-bold text-primary bg-primary/5 py-2 rounded-lg">{row.rozx}</div>
                                    <div className="text-muted-foreground">{row.saas}</div>
                                    <div className="text-muted-foreground">{row.agg}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Additional Info Cards */}
            <section className="container py-12 max-w-5xl mx-auto">
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-muted/40 border">
                        <Activity className="h-8 w-8 text-primary mb-4" />
                        <h3 className="font-bold mb-2">Quick Settlements (T+2)</h3>
                        <p className="text-sm text-muted-foreground">
                            Payments are settled automatically to your bank account on a T+2 day cycle.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-muted/40 border">
                        <Info className="h-8 w-8 text-primary mb-4" />
                        <h3 className="font-bold mb-2">GST Compliant</h3>
                        <p className="text-sm text-muted-foreground">
                            All platform fees are inclusive of 18% GST. You receive proper tax invoices.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-muted/40 border">
                        <CreditCard className="h-8 w-8 text-primary mb-4" />
                        <h3 className="font-bold mb-2">Secure Payments</h3>
                        <p className="text-sm text-muted-foreground">
                            Powered by Razorpay. We support Cards, UPI, Netbanking, and Wallets.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="container py-16 max-w-3xl mx-auto mb-20">
                <h2 className="text-2xl font-bold text-center mb-10">Frequently Asked Questions</h2>
                <div className="divide-y border rounded-2xl overflow-hidden shadow-xs">
                    {[
                        {
                            q: 'Is this really free for my own walk-in patients?',
                            a: 'Yes! We charge ₹0 for patients you add yourself or who walk into your clinic. You get the full software suite (appointments, billing, EMR) for free. We only charge when we send you a *new* patient via our app.'
                        },
                        {
                            q: 'How does the "Pay-as-you-earn" model work?',
                            a: 'There are no fixed monthly rentals or AMCs. You only pay a small commission (4% - 8%) when a patient books you through the ROZX App. If you get no app bookings, you pay ₹0 that month.'
                        },
                        {
                            q: 'When do I get my money? (Settlement Cycle)',
                            a: 'We settle your earnings directly to your bank account on a T+2 day cycle (Transaction + 2 business days). It is fully automated.'
                        },
                        {
                            q: 'Is GST included in the fees?',
                            a: 'Yes, the platform fee is inclusive of 18% GST. You will receive a proper tax invoice from us every month for the commissions charged, which you can claim as input credit.'
                        },
                        {
                            q: 'What if a patient cancels their appointment?',
                            a: 'If a patient cancels more than 24 hours before the slot, we refund them fully. If they cancel late, you receive a partial payment as per the cancellation policy. You never lose money on last-minute no-shows.'
                        },
                        {
                            q: 'Can I migrate my patient data from other software?',
                            a: 'Absolutely. Our support team helps you import your existing patient records and appointments for free during onboarding.'
                        },
                    ].map((faq, i) => (
                        <details key={i} className="group bg-card open:bg-muted/30 transition-colors duration-200">
                            <summary className="flex cursor-pointer list-none items-center justify-between p-6 font-medium text-lg [&::-webkit-details-marker]:hidden">
                                <span>{faq.q}</span>
                                <span className="transition md:ml-6 group-open:rotate-180">
                                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                </span>
                            </summary>
                            <div className="px-6 pb-6 pt-0 text-muted-foreground leading-relaxed animate-in slide-in-from-top-2 fade-in duration-200">
                                {faq.a}
                            </div>
                        </details>
                    ))}
                </div>
            </section>

        </div>
    );
}
