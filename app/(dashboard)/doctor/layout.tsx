import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        default: 'Doctor Dashboard',
        template: '%s | Doctor | ROZX Healthcare',
    },
};

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
    return children;
}
