'use client';

import { useState, useEffect } from 'react';
import { Settings, Shield, Mail, Globe, Loader2, Save } from 'lucide-react';
import { getAdminSettings } from '@/features/admin/api/admin';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getAdminSettings();
                setSettings(data);
            } catch (err) {
                toast.error('Failed to load platform settings');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const getSettingValue = (key: string, defaultValue: any) => {
        const setting = settings.find(s => s.key === key);
        return setting ? setting.value : defaultValue;
    };

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-muted-foreground">General platform configuration and preferences</p>
            </div>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); toast.success('Settings updated'); }}>
                <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
                    <h2 className="font-semibold flex items-center gap-2 text-lg border-b pb-2">
                        <Settings className="h-5 w-5 text-primary" />
                        General
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-1.5 flex items-center gap-2">
                                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                                Platform Name
                            </label>
                            <input
                                type="text"
                                defaultValue={getSettingValue('app_name', 'ROZX Healthcare')}
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1.5 flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                Support Email
                            </label>
                            <input
                                type="email"
                                defaultValue={getSettingValue('support_email', 'support@rozx.in')}
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
                    <h2 className="font-semibold flex items-center gap-2 text-lg border-b pb-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Security
                    </h2>

                    <div className="space-y-4">
                        <label className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer">
                            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                            <div>
                                <p className="text-sm font-medium">Require 2FA for Admin</p>
                                <p className="text-xs text-muted-foreground">Multi-factor authentication for all platform administrators</p>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer">
                            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                            <div>
                                <p className="text-sm font-medium">Auto-verify Hospitals</p>
                                <p className="text-xs text-muted-foreground">Automatically verify hospitals with valid government license numbers</p>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                        Discard Changes
                    </button>
                    <button
                        type="submit"
                        className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                    >
                        <Save className="h-4 w-4" />
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
}
