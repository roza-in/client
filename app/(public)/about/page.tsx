import { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Shield, Zap, Target, Rocket, Code, Stethoscope, Building2, Users, Globe, Linkedin, Twitter, Mail, Instagram, BadgeCheck } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

export const metadata: Metadata = {
    title: 'About Us | ROZX Healthcare',
    description: 'Learn about ROZX Healthcare - Building the future of healthcare technology in India. Our mission, vision, and the story behind the platform.',
    openGraph: {
        title: 'About ROZX Healthcare',
        description: 'Building modern healthcare infrastructure for India',
        type: 'website',
    },
};

const stats = [
    { value: '10K+', label: 'Verified Doctors', icon: Stethoscope },
    { value: '500+', label: 'Partner Hospitals', icon: Building2 },
    { value: '1M+', label: 'Happy Patients', icon: Users },
    { value: '50+', label: 'Cities', icon: Globe },
];

const values = [
    {
        icon: Heart,
        title: 'Patient First',
        description: 'Every feature, every decision is designed with patient care and convenience at its core.',
    },
    {
        icon: Shield,
        title: 'Trust & Security',
        description: 'Enterprise-grade security with ABDM compliance. Your health data is protected.',
    },
    {
        icon: Zap,
        title: 'Innovation',
        description: 'Leveraging cutting-edge technology to solve real healthcare challenges.',
    },
    {
        icon: Target,
        title: 'Accessibility',
        description: 'Making quality healthcare accessible to everyone, everywhere in India.',
    },
];

const trustItems = [
    {
        icon: Shield,
        title: 'ABDM Compliant',
        description: 'Building in alignment with India\'s Ayushman Bharat Digital Mission (ABDM).'
    },
    {
        icon: Target,
        title: 'Data Privacy',
        description: 'Enterprise-grade encryption and secure health record management.'
    },
    {
        icon: BadgeCheck,
        title: 'Verified Partners',
        description: 'Rigorous vetting for every doctor and hospital on the platform.'
    }
];

export default function AboutPage() {
    return (
        <div className="space-y-0">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/10" />
                <div className="container relative">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-sm font-medium text-primary mb-6">
                            <Rocket className="h-4 w-4" />
                            Building the Future of Healthcare
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Modern Healthcare
                            <span className="text-primary"> Infrastructure</span>
                            <br />for India
                        </h1>
                        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
                            ROZX is building the digital backbone for India's healthcare system —
                            connecting patients, doctors, and hospitals through seamless technology.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 border-y bg-muted/30">
                <div className="container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                                    <stat.icon className="h-6 w-6 text-primary" />
                                </div>
                                <p className="text-3xl font-bold">{stat.value}</p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16">
                <div className="container">
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="rounded-2xl border bg-background p-8">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                <Target className="h-6 w-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold">Our Mission</h2>
                            <p className="mt-4 text-muted-foreground leading-relaxed">
                                To democratize healthcare access in India by building technology that
                                connects every patient with the right doctor, at the right time,
                                from anywhere. We believe quality healthcare should not be a privilege
                                but a right accessible to all.
                            </p>
                        </div>
                        <div className="rounded-2xl border bg-background p-8">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                <Rocket className="h-6 w-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold">Our Vision</h2>
                            <p className="mt-4 text-muted-foreground leading-relaxed">
                                To become India's most trusted healthcare platform — powering
                                hospitals, empowering doctors, and serving patients with a unified,
                                ABDM-compliant digital health ecosystem. We're building infrastructure
                                that will transform how healthcare is delivered.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story / Solo Founder Section */}
            <section className="py-16 bg-muted/30">
                <div className="container">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold">The Story Behind <Logo className="inline-block h-24 w-auto -ml-2 -mb-10" /></h2>
                            <p className="mt-2 text-muted-foreground">
                                A passionate solo founder journey to transform healthcare in India
                            </p>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="flex items-center justify-between gap-8">
                                {/* Founder Avatar */}
                                <div className="flex items-center gap-4">
                                    <div className="shrink-0">
                                        <div className="h-12 w-12 p-2 rounded-2xl bg-linear-to-br from-primary to-primary/60 flex items-center justify-center">
                                            <Code className="h-12 w-12 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Shivam Maurya</h3>
                                        <p className="text-primary font-medium">Founder & Entrepreneur</p>
                                    </div>
                                </div>
                                <div className="mt-6 flex gap-3 justify-center md:justify-start">
                                    <a href="https://www.instagram.com/shivammauryain/" className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                                        <Instagram className="h-5 w-5" />
                                    </a>
                                    <a href="https://www.linkedin.com/in/shivammauryain/" className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                                        <Linkedin className="h-5 w-5" />
                                    </a>
                                    <a href="https://twitter.com/shivammauryain" className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                                        <Twitter className="h-5 w-5" />
                                    </a>
                                    <a href="mailto:shivam@rozx.in" className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                                        <Mail className="h-5 w-5" />
                                    </a>
                                </div>
                            </div>


                            {/* Founder Story */}
                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <p>
                                    ROZX Healthcare is a one-person mission to transform how healthcare
                                    technology works in India. From ideation to design, from development
                                    to deployment every line of code, every pixel, every feature is
                                    crafted with care and purpose.
                                </p>
                                <p>
                                    This isn't just a startup; it's a commitment to solving real problems
                                    in healthcare. The challenges are immense, but so is the opportunity
                                    to make a meaningful impact on millions of lives.
                                </p>
                                <p>

                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">Our Values</h2>
                        <p className="mt-2 text-muted-foreground">
                            The principles that guide every decision
                        </p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {values.map((value) => (
                            <div key={value.title} className="rounded-xl border bg-background p-6 hover:shadow-lg transition-shadow">
                                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <value.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="mt-4 font-semibold text-lg">{value.title}</h3>
                                <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust & Security Section */}
            <section className="py-16 bg-muted/30">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">Safe, Secure & Compliant</h2>
                        <p className="mt-2 text-muted-foreground">
                            We take our responsibility towards your health data seriously
                        </p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-3">
                        {trustItems.map((item) => (
                            <div key={item.title} className="text-center p-6 bg-background rounded-2xl border hover:shadow-md transition-shadow">
                                <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                    <item.icon className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">{item.title}</h3>
                                <p className="mt-2 text-muted-foreground text-sm">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-linear-to-br from-primary to-primary/80 text-white">
                <div className="container text-center">
                    <h2 className="text-3xl font-bold">Join the Healthcare Revolution</h2>
                    <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
                        Whether you're a patient seeking care, a doctor expanding your practice,
                        or a hospital looking to digitize we're here to help.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link
                            href="/doctors"
                            className="rounded-lg bg-white px-6 py-3 font-medium text-primary hover:bg-gray-100 transition-colors"
                        >
                            Find a Doctor
                        </Link>
                        <Link
                            href="/contact"
                            className="rounded-lg border-2 border-white/50 px-6 py-3 font-medium text-white hover:bg-white/10 transition-colors"
                        >
                            Get in Touch
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
