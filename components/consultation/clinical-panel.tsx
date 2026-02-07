'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Thermometer, Heart, Wind, Gauge, Activity, Save, Loader2 } from 'lucide-react';

interface ClinicalPanelProps {
    initialVitals?: any;
    initialNotes?: string;
    onSaveNotes: (notes: string) => void;
    onSaveVitals: (vitals: any) => void;
    isSaving?: boolean;
}

export function ClinicalPanel({
    initialVitals = {},
    initialNotes = '',
    onSaveNotes,
    onSaveVitals,
    isSaving
}: ClinicalPanelProps) {
    const [vitals, setVitals] = useState(initialVitals);
    const [notes, setNotes] = useState(initialNotes);

    const handleVitalChange = (key: string, value: string) => {
        const newVitals = { ...vitals, [key]: value };
        setVitals(newVitals);
    };

    const handleVitalsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSaveVitals(vitals);
    };

    return (
        <div className="h-full flex flex-col gap-6">
            {/* Header Area */}
            <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    Patient Vitals
                </h2>
                {isSaving && (
                    <div className="flex items-center gap-2 text-xs text-orange-600 font-medium animate-pulse bg-orange-50 px-2 py-1 rounded-md">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Saving
                    </div>
                )}
            </div>

            {/* Vitals Form */}
            <form onSubmit={handleVitalsSubmit} className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <Label htmlFor="temp" className="flex items-center gap-1.5 text-xs text-slate-500 uppercase tracking-wide">
                        <Thermometer className="w-3 h-3 text-orange-500" /> Temp (°F)
                    </Label>
                    <Input
                        id="temp"
                        value={vitals.temp || ''}
                        onChange={(e) => handleVitalChange('temp', e.target.value)}
                        placeholder="98.6"
                        className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus-visible:ring-emerald-500 font-medium"
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="bp" className="flex items-center gap-1.5 text-xs text-slate-500 uppercase tracking-wide">
                        <Gauge className="w-3 h-3 text-red-500" /> BP (mmHg)
                    </Label>
                    <Input
                        id="bp"
                        value={vitals.bp || ''}
                        onChange={(e) => handleVitalChange('bp', e.target.value)}
                        placeholder="120/80"
                        className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus-visible:ring-emerald-500 font-medium"
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="hr" className="flex items-center gap-1.5 text-xs text-slate-500 uppercase tracking-wide">
                        <Heart className="w-3 h-3 text-rose-500" /> Heart Rate
                    </Label>
                    <Input
                        id="hr"
                        value={vitals.hr || ''}
                        onChange={(e) => handleVitalChange('hr', e.target.value)}
                        placeholder="72"
                        className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus-visible:ring-emerald-500 font-medium"
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="spo2" className="flex items-center gap-1.5 text-xs text-slate-500 uppercase tracking-wide">
                        <Activity className="w-3 h-3 text-blue-500" /> SpO2 (%)
                    </Label>
                    <Input
                        id="spo2"
                        value={vitals.spo2 || ''}
                        onChange={(e) => handleVitalChange('spo2', e.target.value)}
                        placeholder="98"
                        className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus-visible:ring-emerald-500 font-medium"
                    />
                </div>

                <div className="col-span-2 mt-2">
                    <Button type="submit" variant="secondary" size="sm" className="w-full gap-2 text-xs font-semibold h-8">
                        <Save className="w-3 h-3" /> Update Vitals
                    </Button>
                </div>
            </form>

            <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

            {/* Notes Section */}
            <div className="flex-1 flex flex-col gap-3 min-h-0">
                <Label className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    Clinical Findings
                </Label>
                <div className="flex-1 relative">
                    <Textarea
                        className="w-full h-full min-h-[200px] resize-none focus-visible:ring-emerald-500 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 leading-relaxed p-4"
                        placeholder="• Chief Complaint: ...&#10;• History of Present Illness: ...&#10;• Examination Findings: ..."
                        value={notes}
                        onChange={(e) => {
                            setNotes(e.target.value);
                            onSaveNotes(e.target.value);
                        }}
                    />
                    <div className="absolute bottom-3 right-3 text-[10px] text-slate-400 font-medium bg-white/50 px-2 py-1 rounded backdrop-blur">
                        Auto-saving active
                    </div>
                </div>
            </div>
        </div>
    );
}

// Added missing icon import for FileText
import { FileText } from 'lucide-react';
