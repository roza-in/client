import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        default: 'Reception Dashboard',
        template: '%s | Reception | ROZX Healthcare',
    },
};

export default function ReceptionLayout({ children }: { children: React.ReactNode }) {
    return children;
}
