import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Linkedin, Twitter, Instagram, Github, HelpCircle, Building2, Stethoscope, User, ChevronDown } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Contact Us | ROZX Healthcare',
    description: 'Get in touch with ROZX Healthcare. We are here to help patients, doctors, and hospitals with any questions or support needs.',
    openGraph: {
        title: 'Contact ROZX Healthcare',
        description: 'Reach out for support, partnerships, or general inquiries',
        type: 'website',
    },
};

const quickLinks = [
    {
        icon: User,
        title: 'Patient Support',
        description: 'Help with appointments, prescriptions, and medical records',
    },
    {
        icon: Stethoscope,
        title: 'Doctor Onboarding',
        description: 'Join our platform and expand your practice',
    },
    {
        icon: Building2,
        title: 'Hospital Partnerships',
        description: 'Partner with us to digitize your hospital',
    },
    {
        icon: HelpCircle,
        title: 'General Inquiries',
        description: 'Any other questions or feedback',
    },
];

const faqSections = [
    {
        title: 'For Patients',
        qas: [
            {
                q: 'How do I book an appointment?',
                a: 'You can search for doctors by specialty or location on our homepage. Once you find a doctor, click on their profile and select an available time slot to book your appointment.'
            },
            {
                q: 'Are the doctors on ROZX verified?',
                a: 'Yes, every doctor on our platform undergoes a rigorous verification process, including medical registration checks and qualification validation.'
            },
            {
                q: 'Can I manage my family members health records?',
                a: 'Yes, our platform allows you to add family members to your account and manage their appointments and digital health records in one place.'
            }
        ]
    },
    {
        title: 'For Doctors',
        qas: [
            {
                q: 'How do I join ROZX as a doctor?',
                a: 'Click on the "For Doctors" link in the footer or go to the registration page. After submitting your details and medical credentials, our team will verify your profile within 24-48 hours.'
            },
            {
                q: 'What are the benefits of using ROZX for my practice?',
                a: 'ROZX provides you with a digital clinic management system, online appointment booking, digital prescriptions, and an easy way to manage patient health records.'
            }
        ]
    },
    {
        title: 'For Hospitals',
        qas: [
            {
                q: 'Can my hospital integrate with ROZX?',
                a: 'Absolutely. We offer a comprehensive hospital management module that covers doctor scheduling, laboratory management, and patient record systems.'
            },
            {
                q: 'Is ROZX ABDM compliant?',
                a: 'Yes, ROZX is built to be ABDM (Ayushman Bharat Digital Mission) compliant, ensuring secure and standardized health record management.'
            }
        ]
    }
];

export default function ContactPage() {
    return (
        <div className="space-y-0 text-foreground">
            {/* Hero Section */}
            <section className="py-16 bg-linear-to-br from-primary/5 via-transparent to-primary/10">
                <div className="container">
                    <div className="max-w-2xl mx-auto text-center">
                        <h1 className="text-4xl font-bold tracking-tight">Get in Touch</h1>
                        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                            Have questions or need support?<br /> We're here to help you with anything related to ROZX Healthcare.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Contact Section */}
            <section className="py-12 bg-muted/30">
                <div className="container">
                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Contact Information */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold">Contact Information</h2>
                                <p className="mt-2 text-muted-foreground">
                                    Reach out to us through any of these channels
                                </p>
                            </div>

                            <div className="rounded-xl border bg-background p-6 space-y-5">
                                <div className="flex items-start gap-4">
                                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <Mail className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Email</p>
                                        <div className="mt-1 space-y-1">
                                            <a href="mailto:hello@rozx.in" className="text-sm text-muted-foreground hover:text-primary transition-colors block">
                                                hello@rozx.in
                                            </a>
                                            <a href="mailto:support@rozx.in" className="text-sm text-muted-foreground hover:text-primary transition-colors block">
                                                support@rozx.in
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <Phone className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Phone</p>
                                        <a href="tel:+917905861940" className="mt-1 text-sm text-muted-foreground hover:text-primary transition-colors block">
                                            +91 79058 61940
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <MapPin className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Location</p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            New Delhi, India
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <Clock className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Response Time</p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            We typically respond within 24 hours
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="rounded-xl border bg-background p-6">
                                <h3 className="font-semibold">Connect with Us</h3>
                                <p className="mt-2 text-sm text-muted-foreground mb-4 leading-relaxed">
                                    Follow us on social media for updates, insights, and behind-the-scenes.
                                </p>
                                <div className="flex gap-3">
                                    <a
                                        href="https://www.instagram.com/shivammauryain/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-11 w-11 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all hover:scale-105"
                                        aria-label="Instagram"
                                    >
                                        <Instagram className="h-5 w-5" />
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/in/shivammauryain/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-11 w-11 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all hover:scale-105"
                                        aria-label="LinkedIn"
                                    >
                                        <Linkedin className="h-5 w-5" />
                                    </a>
                                    <a
                                        href="https://twitter.com/shivammauryain"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-11 w-11 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all hover:scale-105"
                                        aria-label="Twitter"
                                    >
                                        <Twitter className="h-5 w-5" />
                                    </a>
                                    <a
                                        href="https://github.com/shivammauryain"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-11 w-11 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all hover:scale-105"
                                        aria-label="GitHub"
                                    >
                                        <Github className="h-5 w-5" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="rounded-xl border bg-background p-6 lg:p-8 shadow-sm">
                            <h2 className="text-xl font-bold mb-6">Send us a Message</h2>

                            <form className="space-y-5">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Name</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Phone</label>
                                        <input
                                            type="tel"
                                            className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="+91 79058 XXXXX"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="you@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Subject</label>
                                    <select className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
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
                                    <label className="block text-sm font-medium mb-1.5">Message</label>
                                    <textarea
                                        rows={5}
                                        className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all"
                                        placeholder="How can we help you?"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-md active:scale-[0.98]"
                                >
                                    <Send className="h-4 w-4" />
                                    Send Message
                                </button>

                                <p className="text-xs text-center text-muted-foreground px-4">
                                    By submitting this form, you agree to our{' '}
                                    <Link href="/privacy" className="text-primary hover:underline font-medium">
                                        Privacy Policy
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Contact Cards */}
            <section className="py-16">
                <div className="container">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {quickLinks.map((item) => (
                            <div
                                key={item.title}
                                className="group rounded-xl border bg-background p-6 hover:shadow-lg hover:border-primary/30 transition-all text-center"
                            >
                                <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all transform group-hover:scale-110">
                                    <item.icon className="h-6 w-6 text-primary group-hover:text-white" />
                                </div>
                                <h3 className="mt-4 font-bold text-lg">{item.title}</h3>
                                <p className="mt-2 text-sm text-muted-foreground leading-relaxed px-2">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* In-Page FAQs Section */}
            <section className="py-20 border-t bg-background">
                <div className="container">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tight">Looking for Answers?</h2>
                            <p className="mt-3 text-muted-foreground">
                                Quick answers to common questions about our platform and services.
                            </p>
                        </div>

                        <div className="space-y-10">
                            {faqSections.map((section) => (
                                <div key={section.title} className="space-y-4">
                                    <h3 className="text-xl font-bold border-l-4 border-primary pl-4 py-1">{section.title}</h3>
                                    <div className="space-y-3">
                                        {section.qas.map((item, idx) => (
                                            <details key={idx} className="group rounded-xl border bg-muted/5 p-1 overflow-hidden transition-all hover:border-primary/20">
                                                <summary className="flex items-center justify-between p-4 list-none cursor-pointer font-medium hover:text-primary transition-colors">
                                                    {item.q}
                                                    <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-180 group-open:text-primary" />
                                                </summary>
                                                <div className="p-4 pt-1 mb-1 mx-1 rounded-lg text-muted-foreground text-sm bg-background/50 leading-relaxed">
                                                    {item.a}
                                                </div>
                                            </details>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
