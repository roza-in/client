'use client';

import { useState, useEffect } from 'react';
import { Percent, Save, Loader2, AlertCircle } from 'lucide-react';
import { getAdminSettings } from '@/features/admin/api/admin';
import { toast } from 'sonner';

export default function AdminPlatformFeesPage() {
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
                <h1 className="text-2xl font-bold">Platform Fees</h1>
                <p className="text-muted-foreground">Configure commission rates and platform fees</p>
            </div>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); toast.success('Settings saved (mock update)'); }}>
                <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                    <h2 className="font-semibold flex items-center gap-2">
                        <Percent className="h-4 w-4 text-primary" />
                        Commission Rates
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-foreground/80">Default Hospital Commission (%)</label>
                            <input
                                type="number"
                                defaultValue={getSettingValue('hospital_commission', 10)}
                                min="0"
                                max="100"
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Applied to hospitals without custom rates</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-foreground/80">Default Doctor Commission (%)</label>
                            <input
                                type="number"
                                defaultValue={getSettingValue('doctor_commission', 15)}
                                min="0"
                                max="100"
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                            <p className="text-xs text-muted-foreground mt-1">For independent doctors</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                    <h2 className="font-semibold">Fee Structure</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-foreground/80">Platform Service Fee (₹)</label>
                            <input
                                type="number"
                                defaultValue={getSettingValue('platform_fee', 4900) / 100}
                                min="0"
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Fixed fee added to each consultation (in Rupees)</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-foreground/80">Payment Gateway Fee (%)</label>
                            <input
                                type="number"
                                defaultValue={getSettingValue('gateway_fee', 2)}
                                min="0"
                                max="10"
                                step="0.1"
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Estimated gateway processing cost</p>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                >
                    <Save className="h-4 w-4" />
                    Save Changes
                </button>
            </form>
        </div>
    );
}
