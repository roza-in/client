import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        default: 'Patient Dashboard',
        template: '%s | Patient | ROZX Healthcare',
    },
};

export default function PatientLayout({ children }: { children: React.ReactNode }) {
    return children;
}
