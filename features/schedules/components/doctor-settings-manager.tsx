'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, Clock, Users, CreditCard, Stethoscope } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared';
import { api } from '@/lib/api/client';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';

interface DoctorSettingsManagerProps {
    doctorId: string;
    doctorName: string;
    initialSettings?: DoctorSettings;
}

interface DoctorSettings {
    consultationTypes: string[];
    slotDurationMinutes: number | string;
    bufferTimeMinutes: number | string;
    maxPatientsPerSlot: number | string;
    consultationFeeOnline: number | string;
    consultationFeeInPerson: number | string;
    consultationFeeWalkIn: number | string;
    followUpFee: number | string;
    followUpValidityDays: number | string;
    onlineConsultationEnabled: boolean;
    walkInEnabled: boolean;
}

const CONSULTATION_TYPE_OPTIONS = [
    { key: 'in_person', label: 'In-Person', description: 'Scheduled clinic visits' },
    { key: 'online', label: 'Online', description: 'Video/audio consultations' },
    { key: 'walk_in', label: 'Walk-In', description: 'No appointment needed' },
];

export function DoctorSettingsManager({ doctorId, doctorName, initialSettings }: DoctorSettingsManagerProps) {
    const { user } = useAuthStore();
    const hospitalId = user?.hospital?.id;

    const [isLoading, setIsLoading] = useState(!initialSettings);
    const [isSaving, setIsSaving] = useState(false);

    const [settings, setSettings] = useState<DoctorSettings>({
        consultationTypes: initialSettings?.consultationTypes ?? ['in_person'],
        slotDurationMinutes: initialSettings?.slotDurationMinutes ?? 15,
        bufferTimeMinutes: initialSettings?.bufferTimeMinutes ?? 5,
        maxPatientsPerSlot: initialSettings?.maxPatientsPerSlot ?? 1,
        consultationFeeOnline: initialSettings?.consultationFeeOnline ?? 0,
        consultationFeeInPerson: initialSettings?.consultationFeeInPerson ?? 0,
        consultationFeeWalkIn: initialSettings?.consultationFeeWalkIn ?? 0,
        followUpFee: initialSettings?.followUpFee ?? 0,
        followUpValidityDays: initialSettings?.followUpValidityDays ?? 7,
        onlineConsultationEnabled: initialSettings?.onlineConsultationEnabled ?? false,
        walkInEnabled: initialSettings?.walkInEnabled ?? true,
    });

    // Fetch settings if not provided
    useEffect(() => {
        if (!initialSettings) {
            fetchSettings();
        }
    }, [doctorId, initialSettings]);

    const fetchSettings = async () => {
        try {
            setIsLoading(true);
            const data = await api.get<any>(`/doctors/${doctorId}`);
            setSettings({
                consultationTypes: data.consultation_types ?? data.consultationTypes ?? ['in_person'],
                slotDurationMinutes: String(data.slot_duration_minutes ?? data.slotDurationMinutes ?? 15),
                bufferTimeMinutes: String(data.buffer_time_minutes ?? data.bufferTimeMinutes ?? 5),
                maxPatientsPerSlot: String(data.max_patients_per_slot ?? data.maxPatientsPerSlot ?? 1),
                consultationFeeOnline: String(data.consultation_fee_online ?? data.consultationFeeOnline ?? 0),
                consultationFeeInPerson: String(data.consultation_fee_in_person ?? data.consultationFeeInPerson ?? 0),
                consultationFeeWalkIn: String(data.consultation_fee_walk_in ?? data.consultationFeeWalkIn ?? 0),
                followUpFee: String(data.follow_up_fee ?? data.followUpFee ?? 0),
                followUpValidityDays: String(data.follow_up_validity_days ?? data.followUpValidityDays ?? 7),
                onlineConsultationEnabled: data.online_consultation_enabled ?? data.onlineConsultationEnabled ?? false,
                walkInEnabled: data.walk_in_enabled ?? data.walkInEnabled ?? true,
            });
        } catch (error: any) {
            toast.error(error.message || 'Failed to load settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTextChange = (field: keyof DoctorSettings, value: string) => {
        // Strip non-numeric characters for these specific fields
        const numericFields: Array<keyof DoctorSettings> = [
            'slotDurationMinutes', 'bufferTimeMinutes', 'maxPatientsPerSlot',
            'consultationFeeOnline', 'consultationFeeInPerson', 'consultationFeeWalkIn',
            'followUpFee', 'followUpValidityDays'
        ];

        if (numericFields.includes(field)) {
            // Remove everything except digits
            const cleaned = value.replace(/\D/g, '');
            // Remove leading zeros but keep "0" if it's the only character
            const sanitized = cleaned.replace(/^0+(?=\d)/, '');
            setSettings({ ...settings, [field]: sanitized });
        } else {
            setSettings({ ...settings, [field]: value });
        }
    };

    const handleSave = async () => {
        if (!hospitalId) {
            toast.error('Hospital information not found');
            return;
        }

        try {
            setIsSaving(true);
            await api.patch(`/hospitals/${hospitalId}/doctors/${doctorId}/settings`, {
                consultation_types: settings.consultationTypes,
                slot_duration_minutes: Number(settings.slotDurationMinutes || 0),
                buffer_time_minutes: Number(settings.bufferTimeMinutes || 0),
                max_patients_per_slot: Number(settings.maxPatientsPerSlot || 1),
                consultation_fee_online: Number(settings.consultationFeeOnline || 0),
                consultation_fee_in_person: Number(settings.consultationFeeInPerson || 0),
                consultation_fee_walk_in: Number(settings.consultationFeeWalkIn || 0),
                follow_up_fee: Number(settings.followUpFee || 0),
                follow_up_validity_days: Number(settings.followUpValidityDays || 7),
                online_consultation_enabled: settings.onlineConsultationEnabled,
                walk_in_enabled: settings.walkInEnabled,
            });
            toast.success('Settings saved successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    const toggleConsultationType = (type: string) => {
        const current = settings.consultationTypes;
        if (current.includes(type)) {
            // Don't allow removing last type
            if (current.length === 1) {
                toast.error('At least one consultation type is required');
                return;
            }
            setSettings({ ...settings, consultationTypes: current.filter(t => t !== type) });
        } else {
            setSettings({ ...settings, consultationTypes: [...current, type] });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold text-lg">Doctor Settings</h2>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {isSaving ? <LoadingSpinner size="sm" /> : <Save className="h-4 w-4" />}
                    Save Settings
                </button>
            </div>

            {/* Consultation Types */}
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <div className="bg-muted/40 px-6 py-4 border-b">
                    <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-primary" />
                        <h3 className="font-medium">Consultation Types</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Select which consultation types Dr. {doctorName} offers
                    </p>
                </div>

                <div className="p-6 space-y-3">
                    {CONSULTATION_TYPE_OPTIONS.map((type) => {
                        const isSelected = settings.consultationTypes.includes(type.key);
                        return (
                            <label
                                key={type.key}
                                className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${isSelected ? 'bg-primary/5 border-primary/30' : 'hover:bg-muted/30'
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleConsultationType(type.key)}
                                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{type.label}</p>
                                    <p className="text-xs text-muted-foreground">{type.description}</p>
                                </div>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Slot Configuration */}
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <div className="bg-muted/40 px-6 py-4 border-b">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <h3 className="font-medium">Slot Configuration</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Configure appointment slot settings for all schedules
                    </p>
                </div>

                <div className="p-6 grid gap-4 sm:grid-cols-3">
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Slot Duration</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                inputMode="numeric"
                                value={settings.slotDurationMinutes}
                                onChange={(e) => handleTextChange('slotDurationMinutes', e.target.value)}
                                className="w-20 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                            />
                            <span className="text-sm text-muted-foreground">minutes</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5">Buffer Time</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                inputMode="numeric"
                                value={settings.bufferTimeMinutes}
                                onChange={(e) => handleTextChange('bufferTimeMinutes', e.target.value)}
                                className="w-20 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                            />
                            <span className="text-sm text-muted-foreground">minutes</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">Break between appointments</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5">Max Patients/Slot</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={settings.maxPatientsPerSlot}
                            onChange={(e) => handleTextChange('maxPatientsPerSlot', e.target.value)}
                            className="w-20 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>
            </div>

            {/* Consultation Fees */}
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <div className="bg-muted/40 px-6 py-4 border-b">
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                        <h3 className="font-medium">Consultation Fees</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Set fees for different consultation types
                    </p>
                </div>

                <div className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5">In-Person Fee</label>
                        <div className="flex items-center gap-1">
                            <span className="text-sm text-muted-foreground">₹</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={settings.consultationFeeInPerson}
                                onChange={(e) => handleTextChange('consultationFeeInPerson', e.target.value)}
                                className="w-24 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5">Online Fee</label>
                        <div className="flex items-center gap-1">
                            <span className="text-sm text-muted-foreground">₹</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={settings.consultationFeeOnline}
                                onChange={(e) => handleTextChange('consultationFeeOnline', e.target.value)}
                                className="w-24 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5">Walk-In Fee</label>
                        <div className="flex items-center gap-1">
                            <span className="text-sm text-muted-foreground">₹</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={settings.consultationFeeWalkIn}
                                onChange={(e) => handleTextChange('consultationFeeWalkIn', e.target.value)}
                                className="w-24 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5">Follow-Up Fee</label>
                        <div className="flex items-center gap-1">
                            <span className="text-sm text-muted-foreground">₹</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={settings.followUpFee}
                                onChange={(e) => handleTextChange('followUpFee', e.target.value)}
                                className="w-24 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                            Valid for {settings.followUpValidityDays} days
                        </p>
                    </div>
                </div>

                <div className="px-6 pb-6">
                    <label className="block text-sm font-medium mb-1.5">Follow-Up Validity</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            inputMode="numeric"
                            value={settings.followUpValidityDays}
                            onChange={(e) => handleTextChange('followUpValidityDays', e.target.value)}
                            className="w-20 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-sm text-muted-foreground">days after last visit</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
