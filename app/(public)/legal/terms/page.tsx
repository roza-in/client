import { Metadata } from 'next';
import { Scale, ChevronRight, AlertTriangle, Mail } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Terms of Service | ROZX Healthcare',
    description: 'Read our Terms of Service to understand the rules and regulations for using the ROZX Healthcare platform.',
};

export default function TermsPage() {
    return (
        <div className="space-y-0 text-foreground bg-muted/30 min-h-screen pb-20">
            {/* Hero Section */}
            <section className="relative py-20 bg-linear-to-br from-primary/5 via-transparent to-primary/10 border-b">
                <div className="container relative">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary mb-6">
                            <Scale className="h-3.5 w-3.5" />
                            Legal Agreement
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                            Terms of Service
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Please read these terms carefully before using our services. They govern your relationship with ROZX Healthcare.
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
                            {['Medical Disclaimer', 'Agreement to Terms', 'IP Rights', 'User Registration', 'Appointments', 'Prohibited Activities', 'Liability', 'Contact'].map((item, i) => {
                                const id = i === 0 ? 'disclaimer' : `section-${i}`;
                                return (
                                    <a key={item} href={`#${id}`} className="text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 px-3 py-2 rounded-md transition-colors text-left flex items-center justify-between group">
                                        {item}
                                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Main Document Card */}
                    <div className="rounded-2xl border bg-background p-8 md:p-12 shadow-sm">

                        <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground hover:prose-a:text-primary transition-colors">

                            {/* Alert Box */}
                            <div id="disclaimer" className="flex gap-4 p-5 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 dark:bg-orange-950/20 dark:border-orange-900 dark:text-orange-100 mb-10 not-prose items-start shadow-sm">
                                <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center shrink-0">
                                    <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div className="text-sm leading-relaxed">
                                    <strong className="font-bold text-base block mb-1">Medical Disclaimer</strong>
                                    ROZX Healthcare connects patients with healthcare providers but does not provide medical advice, diagnosis, or treatment directly.
                                    The content on this platform is for informational purposes only. In case of a medical emergency, please contact your local emergency services immediately.
                                </div>
                            </div>

                            <h2 id="section-1">1. Agreement to Terms</h2>
                            <p>
                                These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and ROZX Healthcare ("we," "us," or "our"),
                                concerning your access to and use of the ROZX Healthcare website and application.
                            </p>

                            <h2 id="section-2">2. Intellectual Property Rights</h2>
                            <p>
                                Unless otherwise indicated, the Site and Services are our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs,
                                and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us.
                            </p>

                            <h2 id="section-3">3. User Representations</h2>
                            <p>
                                By using the Site, you represent and warrant that:
                            </p>
                            <ul className="space-y-1">
                                <li>The information you provide is true, accurate, and current.</li>
                                <li>You have the legal capacity to comply with these Terms.</li>
                                <li>You are not a minor in the jurisdiction in which you reside (or have parental consent).</li>
                                <li>You will not use the Site for any illegal or unauthorized purpose.</li>
                            </ul>

                            <h2 id="section-4">4. User Registration</h2>
                            <p>
                                You may be required to register with the Site. You agree to keep your password confidential and will be responsible for all use of your account and password.
                                We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate.
                            </p>

                            <h2 id="section-5">5. Appointments and Cancellations</h2>
                            <p>
                                The platform facilitates booking of appointments with medical practitioners. The availability of slots is determined by the respective doctors/hospitals.
                                Cancellation policies are subject to our Refund Policy and the specific terms of the healthcare provider.
                            </p>

                            <h2 id="section-6">6. Prohibited Activities</h2>
                            <p>
                                You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                            </p>

                            <h2 id="section-7">7. Limitation of Liability</h2>
                            <p>
                                In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages,
                                including lost profit, lost revenue, loss of data, or other damages arising from your use of the site.
                            </p>

                            <h2 id="section-8">8. Contact Us</h2>
                            <p>
                                In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
                            </p>

                            <div className="not-prose mt-8">
                                <a href="mailto:legal@rozx.in" className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-sm">
                                    <Mail className="h-4 w-4" />
                                    Contact Legal Team
                                </a>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}