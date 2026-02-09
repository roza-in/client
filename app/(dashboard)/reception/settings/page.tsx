'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useHospital } from '@/features/hospitals';
import {
    Building2,
    Clock,
    Bell,
    User as UserIcon,
    MapPin,
    Phone,
    Mail,
    ShieldCheck,
    Globe,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ReceptionSettingsPage() {
    const { user, hasRole, isLoading: authLoading } = useAuth();
    const { data: hospital, isLoading: hospitalLoading } = useHospital(user?.hospital?.id || null);
    const [activeTab, setActiveTab] = useState('hospital-profile');

    const isReception = hasRole('reception');

    if (authLoading || hospitalLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isReception) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
                <div className="rounded-full bg-destructive/10 p-3">
                    <ShieldCheck className="h-10 w-10 text-destructive" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Access Denied</h2>
                    <p className="text-muted-foreground">You do not have permission to view this page.</p>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'hospital-profile', name: 'Hospital Profile', icon: Building2 },
        { id: 'personal-profile', name: 'Personal Profile', icon: UserIcon },
        { id: 'notifications', name: 'Notifications', icon: Bell },
    ];

    return (
        <div className="flex flex-col space-y-8 animate-in fade-in duration-500">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Reception Settings</h2>
                <p className="text-muted-foreground">
                    View hospital details and manage your personal preferences.
                </p>
            </div>

            <nav className="flex gap-2 border-b pb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all mr-2",
                            activeTab === tab.id
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <tab.icon className="h-4 w-4" />
                        <span>{tab.name}</span>
                    </button>
                ))}
            </nav>

            <div className="grid gap-8">
                {/* Hospital Profile Tab */}
                {activeTab === 'hospital-profile' && (
                    <div className="space-y-6">
                        <section className="bg-card rounded-xl border p-6 shadow-sm">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl overflow-hidden">
                                    {hospital?.logoUrl ? (
                                        <img src={hospital.logoUrl} alt={hospital.name} className="h-full w-full object-cover" />
                                    ) : (
                                        hospital?.name?.[0] || 'H'
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">{hospital?.name || 'Hospital Name'}</h3>
                                    <p className="text-sm text-muted-foreground capitalize">{hospital?.type || 'General Hospital'}</p>
                                </div>
                                <div className="ml-auto px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold flex items-center gap-1">
                                    <ShieldCheck className="h-3 w-3" />
                                    Verified
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact Information</label>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3 text-sm">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                <span>{hospital?.phone || 'Not provided'}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <span>{hospital?.email || 'Not provided'}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <Globe className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-primary hover:underline cursor-pointer">{hospital?.website || 'www.hospital.com'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Address</label>
                                        <div className="flex gap-3 text-sm">
                                            <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                            <span>{hospital?.address}, {hospital?.city}, {hospital?.state} - {hospital?.pincode}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Operating Hours</label>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span>Monday - Saturday: 09:00 AM - 09:00 PM</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Clock className="h-4 w-4 invisible" />
                                            <span>Sunday: Emergency Only</span>
                                        </div>
                                    </div>

                                    <div className="bg-muted/30 rounded-lg p-4 border border-dashed text-xs text-muted-foreground">
                                        Note: Hospital profile information is managed by the administrator. Please contact your supervisor for any changes.
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {/* Personal Profile Tab */}
                {activeTab === 'personal-profile' && (
                    <div className="space-y-6">
                        <section className="bg-card rounded-xl border p-6 shadow-sm">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="h-20 w-20 rounded-full border-4 border-background bg-muted overflow-hidden">
                                    {user?.profilePictureUrl ? (
                                        <img src={user.profilePictureUrl} alt={user.name || ''} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary">
                                            <UserIcon className="h-10 w-10" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">{user?.name}</h3>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mt-1 capitalize">
                                        {user?.role}
                                    </span>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Full Name</label>
                                    <input
                                        type="text"
                                        value={user?.name || ''}
                                        readOnly
                                        className="w-full rounded-lg border bg-muted/50 px-4 py-2 text-sm focus:outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email Address</label>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        readOnly
                                        className="w-full rounded-lg border bg-muted/50 px-4 py-2 text-sm focus:outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={user?.phone || 'Not provided'}
                                        readOnly
                                        className="w-full rounded-lg border bg-muted/50 px-4 py-2 text-sm focus:outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Password</label>
                                    <button className="w-full text-left rounded-lg border bg-background px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center justify-between">
                                        <span>••••••••</span>
                                        <span className="text-primary text-xs font-medium">Change</span>
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                    <div className="bg-card rounded-xl border p-12 shadow-sm text-center animate-in zoom-in-95 duration-300">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                            <Bell className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-semibold">Notification Preferences</h3>
                        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                            Manage how you receive alerts about new bookings, emergencies, and system updates. Feature coming soon.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
