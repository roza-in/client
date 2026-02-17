'use client';

import { Settings } from 'lucide-react';

export default function PharmacySettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Pharmacy Settings</h1>
                <p className="text-muted-foreground">Configure pharmacy preferences</p>
            </div>

            <div className="rounded-xl border p-8 text-center">
                <Settings className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-lg font-semibold mb-2">Settings Coming Soon</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Pharmacy settings configuration including notification preferences,
                    delivery partners, and inventory alerts will be available here.
                </p>
            </div>
        </div>
    );
}
