/**
 * Layout Components - Footer
 */

import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { routes } from '@/config';
import { Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Facebook, Youtube } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

const footerLinks = {
    discovery: [
        { name: 'Find Doctors', href: routes.public.doctors },
        { name: 'Find Hospitals', href: routes.public.hospitals },
        { name: 'Medical Specialties', href: '/specialties' },
    ],
    company: [
        { name: 'About Us', href: routes.public.about },
        { name: 'Contact Us', href: routes.public.contact },
        { name: 'FAQs', href: '/faqs' },
    ],
    legal: [
        { name: 'Terms of Service', href: routes.public.terms },
        { name: 'Privacy Policy', href: routes.public.privacy },
        { name: 'Refund Policy', href: routes.public.refund },
    ],
    contact: [
        { name: '+91 79058 61940', href: 'tel:+917905861940', icon: Phone },
        { name: 'hello@rozx.in', href: 'mailto:hello@rozx.in', icon: Mail },
        { name: 'Ambedkar Nagar, Uttar Pradesh 224155, India', href: '#', icon: MapPin },
    ],
};

const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/rozxhealth' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/in/rozxhealth' },
    { name: 'Threads', icon: Twitter, href: 'https://threads.com/rozxhealth' },
    { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/rozxhealth' },
    { name: 'Youtube', icon: Youtube, href: 'https://www.youtube.com/rozxhealth' },
];

export function Footer() {
    return (
        <footer className="border-t bg-muted/30">
            <div className="container py-12">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex -my-10 items-center gap-2">
                            <Logo className="h-24 w-auto" />
                        </Link>
                        <p className="mt-4 text-sm text-muted-foreground">
                            {siteConfig.description}
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-sm font-semibold">Discovery</h3>
                        <ul className="mt-4 space-y-3">
                            {footerLinks.discovery.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold">Company</h3>
                        <ul className="mt-4 space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold">Legal</h3>
                        <ul className="mt-4 space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold">Contact</h3>
                        <ul className="mt-4 space-y-3">
                            {footerLinks.contact.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                                >
                                    <link.icon className="h-4 w-4" />
                                    {link.name}
                                </Link>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 border-t pt-4 flex justify-between items-center text-sm text-muted-foreground">
                    <p>
                        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
                    </p>

                    <div className="flex gap-4">
                        {socialLinks.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary"
                                aria-label={item.name}
                            >
                                <item.icon className="h-5 w-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
