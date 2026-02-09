/**
 * Layout Components - Sidebar
 */

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store';
import {
    Home,
    Calendar,
    Users,
    ClipboardList,
    CreditCard,
    Settings,
    User,
    Building2,
    Stethoscope,
    BarChart3,
    Bell,
    Video,
    FileText,
    Heart,
    X,
} from 'lucide-react';
import { routes } from '@/config';
import { Logo } from '@/components/ui/logo';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
}

const patientNavigation: NavItem[] = [
    { name: 'Dashboard', href: routes.patient.dashboard, icon: Home },
    { name: 'Appointments', href: routes.patient.appointments, icon: Calendar },
    { name: 'Prescriptions', href: routes.patient.prescriptions, icon: ClipboardList },
    { name: 'Payments', href: routes.patient.payments, icon: CreditCard },
];

const doctorNavigation: NavItem[] = [
    { name: 'Dashboard', href: routes.doctor.dashboard, icon: Home },
    { name: 'Appointments', href: routes.doctor.appointments, icon: Calendar },
    { name: 'Schedule', href: routes.doctor.schedule, icon: Calendar },
    { name: 'Patients', href: routes.doctor.patients, icon: Users },
];

const hospitalNavigation: NavItem[] = [
    { name: 'Dashboard', href: routes.hospital.dashboard, icon: Home },
    { name: 'Appointments', href: routes.hospital.appointments, icon: Calendar },
    { name: 'Doctors', href: routes.hospital.doctors, icon: Stethoscope },
    { name: 'Patients', href: routes.hospital.patients, icon: Users },
    { name: 'Staff', href: routes.hospital.staff, icon: User },
    { name: 'Revenue', href: '/hospital/revenue', icon: CreditCard },
];

const adminNavigation: NavItem[] = [
    { name: 'Dashboard', href: routes.admin.dashboard, icon: Home },
    { name: 'Hospitals', href: routes.admin.hospitals, icon: Building2 },
    { name: 'Doctors', href: routes.admin.doctors, icon: Stethoscope },
    { name: 'Patients', href: routes.admin.patients, icon: Users },
    { name: 'Payments', href: routes.admin.payments, icon: CreditCard },
];

const receptionNavigation: NavItem[] = [
    { name: 'Dashboard', href: routes.reception?.dashboard || '/reception', icon: Home },
    { name: 'Queue', href: routes.reception?.queue || '/reception/queue', icon: ClipboardList },
    { name: 'Patients', href: routes.reception?.patients || '/reception/patients', icon: Users },
    { name: 'Schedule', href: routes.reception?.schedule || '/reception/schedule', icon: Calendar },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { user } = useAuthStore();

    const getNavigation = (): NavItem[] => {
        switch (user?.role) {
            case 'doctor':
                return doctorNavigation;
            case 'hospital':
                return hospitalNavigation;
            case 'admin':
                return adminNavigation;
            case 'reception':
                return receptionNavigation;
            default:
                return patientNavigation;
        }
    };

    const navigation = getNavigation();

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed left-0 top-0 z-40 h-full w-44 transform border-r bg-background transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Header */}
                <div className="flex h-16 items-center justify-between border-b px-4">
                    <Link href="/" className="flex items-center gap-2">
                        <Logo className="h-24 w-auto" />
                    </Link>
                    <button
                        onClick={onClose}
                        className="md:hidden"
                        aria-label="Close sidebar"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4">
                    <ul className="space-y-1">
                        {navigation.map((item) => {
                            const isRoot = ['/admin', '/doctor', '/hospital', '/patient', '/reception'].includes(item.href);
                            const isActive = isRoot
                                ? pathname === item.href
                                : pathname === item.href || pathname.startsWith(`${item.href}/`);
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={onClose}
                                        className={cn(
                                            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                            isActive
                                                ? 'bg-primary text-primary-foreground'
                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        )}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="border-t p-4">
                    <Link
                        href={`/${user?.role || 'patient'}/settings`}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        <Settings className="h-5 w-5" />
                        Settings
                    </Link>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
