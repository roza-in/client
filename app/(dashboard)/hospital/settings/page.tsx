import { redirect } from 'next/navigation';
import { routes } from '@/config';

export default function HospitalSettingsPage() {
    redirect(`${routes.hospital.settings}/profile`);
}