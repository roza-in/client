import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Lock, Eye, FileText, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Privacy Policy | Rozx Healthcare',
    description: 'We prioritize your privacy. Learn how Rozx Healthcare collects, uses, and protects your personal and medical data.',
};

export default function PrivacyPage() {
    return (
        <div className="space-y-0 text-foreground bg-muted/30 min-h-screen pb-20">
            {/* Hero Section */}
            <section className="relative py-20 bg-linear-to-br from-primary/5 via-transparent to-primary/10 border-b">
                <div className="container relative">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary mb-6">
                            <Shield className="h-3.5 w-3.5" />
                            Your Data is Secure
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                            Privacy Policy
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            We are committed to protecting your personal information and your right to privacy.
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
                            {['Information We Collect', 'How We Use Info', 'Sharing Data', 'Data Retention', 'Security', 'Contact Us'].map((item, i) => (
                                <a key={item} href={`#section-${i + 1}`} className="text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 px-3 py-2 rounded-md transition-colors text-left flex items-center justify-between group">
                                    {item}
                                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Main Document Card */}
                    <div className="rounded-2xl border bg-background p-8 md:p-12 shadow-sm">

                        {/* Highlights Grid */}
                        <div className="grid sm:grid-cols-3 gap-6 mb-12 border-b pb-12">
                            <div className="flex flex-col items-center text-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <h3 className="font-semibold text-sm">Encrypted Data</h3>
                                <p className="text-xs text-muted-foreground">End-to-end encryption for all medical records.</p>
                            </div>
                            <div className="flex flex-col items-center text-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Eye className="h-5 w-5" />
                                </div>
                                <h3 className="font-semibold text-sm">Transparent Usage</h3>
                                <p className="text-xs text-muted-foreground">We never sell your data to third parties.</p>
                            </div>
                            <div className="flex flex-col items-center text-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <h3 className="font-semibold text-sm">ABDM Compliant</h3>
                                <p className="text-xs text-muted-foreground">Aligned with Digital India standards.</p>
                            </div>
                        </div>

                        <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground hover:prose-a:text-primary transition-colors">

                            <h2 id="section-1">1. Information We Collect</h2>
                            <p>
                                We collect personal information that you voluntarily provide to us when you register on the Rozx Healthcare platform,
                                express an interest in obtaining information about us or our products and services, when you participate in activities on the platform
                                (such as posting messages in our online forums or entering competitions, contests or giveaways) or otherwise when you contact us.
                            </p>
                            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
                                <li><strong>Personal Identity:</strong> Name, age, gender, date of birth.</li>
                                <li><strong>Contact Details:</strong> Email address, phone number, physical address.</li>
                                <li><strong>Health Information:</strong> Medical history, prescriptions, lab reports.</li>
                                <li><strong>Payment Data:</strong> Transaction history (card details are not stored).</li>
                            </ul>

                            <h2 id="section-2">2. How We Use Your Information</h2>
                            <p>We use personal information collected via our platform for a variety of business purposes described below:</p>
                            <ul>
                                <li>To facilitate account creation and logon process.</li>
                                <li>To send you administrative information, such as appointment reminders.</li>
                                <li>To fulfill and manage your doctor appointments and health orders.</li>
                                <li>To enforce our terms, conditions and policies.</li>
                                <li>To respond to legal requests and prevent harm.</li>
                            </ul>

                            <h2 id="section-3">3. Will Your Information Be Shared With Anyone?</h2>
                            <p>
                                We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
                            </p>
                            <div className="bg-muted/50 p-4 rounded-lg border text-sm not-prose space-y-2 mb-6">
                                <p className="font-medium text-foreground">Specific sharing instances:</p>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                    <li><strong>Healthcare Providers:</strong> Doctors/Hospitals you book with.</li>
                                    <li><strong>Business Partners:</strong> Only for services you explicitly opt-in for.</li>
                                    <li><strong>Legal Obligations:</strong> Compliance with court orders or ABDM mandates.</li>
                                </ul>
                            </div>

                            <h2 id="section-4">4. How Long Do We Keep Your Information?</h2>
                            <p>
                                We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law.
                                Medical records are retained as per the guidelines issued by the Medical Council of India and other relevant authorities.
                            </p>

                            <h2 id="section-5">5. How Do We Keep Your Information Safe?</h2>
                            <p>
                                We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process.
                                However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information,
                                transmission of personal information to and from our platform is at your own risk. You should only access the services within a secure environment.
                            </p>

                            <h2 id="section-6">6. Contact Us</h2>
                            <p>
                                If you have questions or comments about this policy, you may email us or contact us by post:
                            </p>

                            <div className="not-prose mt-8 grid md:grid-cols-2 gap-6">
                                <a href="mailto:legal@rozx.in" className="flex items-start gap-4 p-4 rounded-xl border hover:border-primary/50 hover:bg-primary/5 transition-all group">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">Email Us</h4>
                                        <p className="text-sm text-primary font-medium mt-1">legal@rozx.in</p>
                                    </div>
                                </a>
                                <div className="flex items-start gap-4 p-4 rounded-xl border hover:border-primary/50 hover:bg-primary/5 transition-all group">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">Mailing Address</h4>
                                        <p className="text-sm text-muted-foreground mt-1">Rozx Healthcare, Ambedkar Nagar, Uttar Pradesh 224155, India</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}