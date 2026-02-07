'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, FileText, Download, Send, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Medication {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    timing: 'Before Meals' | 'After Meals';
    instructions?: string;
}

interface PrescriptionFormProps {
    onSave: (data: any) => void;
    isSubmitting?: boolean;
}

export function PrescriptionForm({ onSave, isSubmitting }: PrescriptionFormProps) {
    const [diagnosis, setDiagnosis] = useState('');
    const [medications, setMedications] = useState<Medication[]>([
        { name: '', dosage: '', frequency: '', duration: '', timing: 'After Meals' }
    ]);
    const [labTests, setLabTests] = useState<string[]>([]);
    const [advice, setAdvice] = useState('');

    const addMedication = () => {
        setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '', timing: 'After Meals' }]);
    };

    const removeMedication = (index: number) => {
        setMedications(medications.filter((_, i) => i !== index));
    };

    const updateMedication = (index: number, field: keyof Medication, value: string) => {
        const newMeds = [...medications];
        newMeds[index] = { ...newMeds[index], [field]: value };
        setMedications(newMeds);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            diagnosis,
            medications,
            labTests,
            advice,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    e-Prescription
                </h2>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        type="submit"
                        className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                        {isSubmitting ? 'Sending...' : 'Issue Rx'}
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                {/* Diagnosis Section */}
                <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Diagnosis</Label>
                    <Input
                        id="diagnosis"
                        placeholder="e.g. Acute Viral Pharyngitis"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        required
                        className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 font-medium"
                    />
                </div>

                <Separator className="bg-slate-100 dark:bg-slate-800" />

                {/* Medications List */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Medications</Label>
                        <Button type="button" variant="ghost" size="sm" onClick={addMedication} className="h-6 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2">
                            <Plus className="w-3 h-3 mr-1" /> Add Drug
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {medications.map((med, index) => (
                            <div key={index} className="p-3 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 relative group">
                                <div className="grid grid-cols-12 gap-3">
                                    <div className="col-span-8 space-y-1">
                                        <Label className="text-[10px] text-slate-400">Drug Name</Label>
                                        <Input
                                            placeholder="Drug Name"
                                            value={med.name}
                                            onChange={(e) => updateMedication(index, 'name', e.target.value)}
                                            className="h-8 text-sm bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                                        />
                                    </div>
                                    <div className="col-span-4 space-y-1">
                                        <Label className="text-[10px] text-slate-400">Dosage</Label>
                                        <Input
                                            placeholder="e.g. 500mg"
                                            value={med.dosage}
                                            onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                                            className="h-8 text-sm bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-slate-400">Freq.</Label>
                                        <Input
                                            placeholder="1-0-1"
                                            value={med.frequency}
                                            onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                                            className="h-8 text-sm bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-slate-400">Dur.</Label>
                                        <Input
                                            placeholder="5 days"
                                            value={med.duration}
                                            onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                                            className="h-8 text-sm bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        {medications.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="w-full h-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                                                onClick={() => removeMedication(index)}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2 pb-4">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Instructions / Advice</Label>
                    <Textarea
                        className="min-h-[80px] bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 resize-none"
                        placeholder="Additional instructions for the patient..."
                        value={advice}
                        onChange={(e) => setAdvice(e.target.value)}
                    />
                </div>
            </div>
        </form>
    );
}
