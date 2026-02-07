import { Metadata } from 'next';
import { HelpCircle, ChevronDown, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'FAQs | ROZX Healthcare',
    description: 'Frequently asked questions about ROZX Healthcare. Find answers for patients, doctors, and hospital partners.',
};

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

export default function FAQPage() {
    return (
        <div className="space-y-0">
            {/* Hero Section */}
            <section className="py-16 bg-linear-to-br from-primary/5 via-transparent to-primary/10">
                <div className="container">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-sm font-medium text-primary mb-6">
                            <HelpCircle className="h-4 w-4" />
                            Help Center
                        </div>
                        <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Find answers to common questions about our platform and services.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ content */}
            <section className="py-16">
                <div className="container">
                    <div className="max-w-3xl mx-auto space-y-12">
                        {faqSections.map((section) => (
                            <div key={section.title} className="space-y-4">
                                <h2 className="text-2xl font-bold border-b pb-2">{section.title}</h2>
                                <div className="space-y-3">
                                    {section.qas.map((item, idx) => (
                                        <details key={idx} className="group rounded-xl border bg-background overflow-hidden transition-all hover:border-primary/30">
                                            <summary className="flex items-center justify-between p-5 list-none cursor-pointer font-medium hover:text-primary">
                                                {item.q}
                                                <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
                                            </summary>
                                            <div className="p-5 pt-0 text-muted-foreground border-t bg-muted/20">
                                                {item.a}
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Still have questions? */}
            <section className="py-16 bg-muted/30">
                <div className="container">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-2xl font-bold">Still have questions?</h2>
                        <p className="mt-4 text-muted-foreground">
                            If you couldn't find the answer you're looking for, please contact our support team.
                        </p>
                        <div className="mt-8 flex justify-center gap-4">
                            <a href="/contact" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-primary/90 transition-colors">
                                <MessageCircle className="h-4 w-4" />
                                Contact Support
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
