'use client';

import Link from 'next/link';
import { Settings, User, Bell, Shield } from 'lucide-react';

export default function PharmacySettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Pharmacy Settings</h1>
                <p className="text-muted-foreground">Manage your pharmacy preferences</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Link
                    href="/pharmacy/settings/profile"
                    className="flex items-center gap-4 rounded-xl border p-6 hover:bg-muted/50"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <p className="font-semibold">Profile</p>
                        <p className="text-sm text-muted-foreground">Update pharmacy details</p>
                    </div>
                </Link>

                <Link
                    href="/pharmacy/settings/notifications"
                    className="flex items-center gap-4 rounded-xl border p-6 hover:bg-muted/50"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <Bell className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="font-semibold">Notifications</p>
                        <p className="text-sm text-muted-foreground">Configure alerts</p>
                    </div>
                </Link>

                <Link
                    href="/pharmacy/settings/inventory"
                    className="flex items-center gap-4 rounded-xl border p-6 hover:bg-muted/50"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <Settings className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <p className="font-semibold">Inventory Settings</p>
                        <p className="text-sm text-muted-foreground">Stock thresholds & alerts</p>
                    </div>
                </Link>

                <Link
                    href="/pharmacy/settings/security"
                    className="flex items-center gap-4 rounded-xl border p-6 hover:bg-muted/50"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                        <Shield className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                        <p className="font-semibold">Security</p>
                        <p className="text-sm text-muted-foreground">Password & access</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
