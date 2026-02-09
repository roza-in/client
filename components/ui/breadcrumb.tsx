'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbProps {
    className?: string;
    separator?: React.ReactNode;
}

const routeNameMap: Record<string, string> = {
    'admin': 'Admin',
    'dashboard': 'Dashboard',
    'hospitals': 'Hospitals',
    'doctors': 'Doctors',
    'patients': 'Patients',
    'users': 'Users',
    'settings': 'Settings',
    'profile': 'Profile',
    'appointments': 'Appointments',
    'verify': 'Verify',
    'payments': 'Payments',
    'schedule': 'Schedule',
    'consultations': 'Consultations',
    'earnings': 'Earnings',
    'records': 'Records',
    'family': 'Family',
    'prescriptions': 'Prescriptions',
    'staff': 'Staff',
    'invoices': 'Invoices',
    'analytics': 'Analytics',
};

export function Breadcrumb({ className, separator = <ChevronRight className="h-4 w-4" /> }: BreadcrumbProps) {
    const pathname = usePathname();

    // Split pathname into segments, filter out empty strings
    const segments = pathname.split('/').filter(Boolean);

    // Check if the root segment is a dashboard role
    const roles = ['admin', 'doctor', 'hospital', 'patient'];
    const rootSegment = segments[0];
    const isRoleRoot = roles.includes(rootSegment);

    // Determine Home href (link to dashboard root if applicable)
    const homeHref = isRoleRoot ? `/${rootSegment}` : '/';

    // Generate crumbs
    const crumbs = segments.map((segment, index) => {
        // Create the path for this segment
        const href = `/${segments.slice(0, index + 1).join('/')}`;

        // Try to map the name, or capitalize it, or leave as is if it looks like an ID
        let name = routeNameMap[segment];

        if (!name) {
            // Check if it looks like an ID (long alphanumeric, or typical ID format)
            const isId = /^[0-9a-fA-F-]{10,}$/.test(segment) || /^\d+$/.test(segment);
            if (isId) {
                name = 'Details'; // Or generic "Item", or truncate ID
            } else {
                // Capitalize first letter
                name = segment.charAt(0).toUpperCase() + segment.slice(1);
            }
        }

        const isLast = index === segments.length - 1;

        return {
            name,
            href,
            isLast
        };
    }).filter((_, index) => {
        // Hide the root role segment from the text list
        if (isRoleRoot && index === 0) return false;
        return true;
    });

    // Don't render if at root or only 1 deep (dashboard root usually)
    // Actually, user wants "best way", showing "Dashboard > Hospitals" is good.
    // if (segments.length === 0) return null;

    return (
        <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm text-muted-foreground", className)}>
            <Link
                href={homeHref}
                className="flex items-center hover:text-foreground transition-colors"
                title="Home"
            >
                <Home className="h-4 w-4" />
            </Link>

            {crumbs.length > 0 && (
                <span className="mx-2 text-muted-foreground/50">{separator}</span>
            )}

            {crumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center">
                    {crumb.isLast ? (
                        <span className="font-semibold text-foreground">
                            {crumb.name}
                        </span>
                    ) : (
                        <Link
                            href={crumb.href}
                            className="hover:text-foreground transition-colors"
                        >
                            {crumb.name}
                        </Link>
                    )}

                    {!crumb.isLast && (
                        <span className="mx-2 text-muted-foreground/50">{separator}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
