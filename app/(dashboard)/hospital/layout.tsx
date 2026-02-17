import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        default: 'Hospital Dashboard',
        template: '%s | Hospital | ROZX Healthcare',
    },
};

export default function HospitalLayout({ children }: { children: React.ReactNode }) {
    return children;
}
