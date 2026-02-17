import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        default: 'Pharmacy Dashboard',
        template: '%s | Pharmacy | ROZX Healthcare',
    },
};

export default function PharmacyLayout({ children }: { children: React.ReactNode }) {
    return children;
}
