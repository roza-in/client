import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

export default function AuthLayout({ children }: { children: ReactNode }) {

    const brandingFeatures = [
        "Connect with top certified doctors",
        "Secure health records management",
        "Seamless video consultations",
        "Instant prescription access"
    ];

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background">
            {/* Branding Side (60% on Desktop) */}
            <div className="relative hidden w-3/5 flex-col justify-between overflow-hidden bg-linear-to-br from-teal-600 via-teal-700 to-teal-800 p-8 text-white lg:flex">
                {/* Decorative Pattern Background */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#grid)" />
                    </svg>
                </div>

                {/* Header */}
                <div className="relative z-10 flex items-start justify-between">
                    <Logo className="h-24 w-auto -mt-6" />
                    <Link
                        href="/"
                        className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 py-2 px-5 text-sm font-medium backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/40"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>
                </div>

                {/* Branding Content */}
                <div className="relative z-10 max-w-xl">
                    <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
                        Revolutionizing <br />
                        <span className="text-teal-300">Healthcare Excellence</span>
                    </h1>
                    <p className="mt-6 text-lg text-teal-50/80">
                        Join India's most trusted digital health platform. Experience seamless
                        consultations, secure records, and personalized care at your fingertips.
                    </p>

                    <ul className="mt-12 space-y-5">
                        {brandingFeatures.map((feature, index) => (
                            <li key={index} className="flex items-center gap-4 text-teal-50">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-400/20 text-teal-400">
                                    <CheckCircle2 className="h-4 w-4" />
                                </div>
                                <span className="text-base font-medium">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Form Side (40% on Desktop, 100% on Mobile) */}
            <div className="flex w-full flex-col lg:w-2/5">
                {/* Mobile Header (Only visible on mobile) */}
                <div className="flex items-center justify-between border-b p-6 lg:hidden">
                    <Link href="/">
                        <Image
                            src='/logo/rozx-light-logo.svg'
                            alt="Rozx Logo"
                            width={150}
                            height={150}
                            className="h-15 -my-8 w-auto object-contain"
                            priority
                        />
                    </Link>
                    <Link href="/" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                        Home
                    </Link>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto grid place-items-center p-8 lg:p-12">
                    <div className="w-full max-w-md animate-fade-in">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
