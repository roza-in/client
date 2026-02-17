/**
 * Prescription Components - Prescription Viewer
 */

'use client';

import { cn } from '@/lib/utils';
import {
    Calendar,
    User,
    Stethoscope,
    Pill,
    TestTube,
    Clock,
    Download,
    Send,
    Printer,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface PrescriptionViewerProps {
    prescription: any;
    className?: string;
}

export function PrescriptionViewer({ prescription, className }: PrescriptionViewerProps) {
    const handleDownload = async () => {
        // TODO: PDF download endpoint not yet available on server
        toast.error('PDF download is not available yet');
    };

    const handleSend = async (via: 'whatsapp' | 'email') => {
        // TODO: Send prescription endpoint not yet available on server
        toast.error('Send prescription is not available yet');
    };

    return (
        <div className={cn('rounded-xl border bg-background', className)}>
            {/* Header */}
            <div className="border-b p-4 md:p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Prescription</h2>
                        <p className="text-sm text-muted-foreground">
                            Date: {format(parseISO(prescription.createdAt), 'MMM d, yyyy')}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                        >
                            <Download className="h-4 w-4" />
                            Download
                        </button>
                        <button
                            onClick={() => handleSend('whatsapp')}
                            className="flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
                        >
                            <Send className="h-4 w-4" />
                            WhatsApp
                        </button>
                    </div>
                </div>

                {/* Doctor & Patient Info */}
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Stethoscope className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="font-medium">Dr. {prescription.doctorName}</p>
                            <p className="text-sm text-muted-foreground">{prescription.specialization}</p>
                            {prescription.hospitalName && (
                                <p className="text-sm text-muted-foreground">{prescription.hospitalName}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="font-medium">{prescription.patientName}</p>
                            <p className="text-sm text-muted-foreground">
                                {prescription.patientAge && `${prescription.patientAge} yrs, `}
                                {prescription.patientGender}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Diagnosis */}
            <div className="border-b p-4 md:p-6">
                <h3 className="font-semibold mb-2">Diagnosis</h3>
                <p className="text-muted-foreground">{prescription.diagnosis}</p>
                {prescription.symptoms && prescription.symptoms.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {prescription.symptoms.map((symptom: any, i: number) => (
                            <span key={i} className="rounded-full bg-muted px-2 py-0.5 text-xs">
                                {symptom}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Medications */}
            {prescription.medications && prescription.medications.length > 0 && (
                <div className="border-b p-4 md:p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Pill className="h-4 w-4 text-primary" />
                        Medications ({prescription.medications.length})
                    </h3>
                    <div className="space-y-4">
                        {prescription.medications.map((med: any, index: number) => (
                            <div key={index} className="rounded-lg border p-4">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="font-medium">{med.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {med.dosage} • {med.frequency}
                                        </p>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        {med.duration} days
                                    </span>
                                </div>
                                {med.instructions && (
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        📝 {med.instructions}
                                    </p>
                                )}
                                {med.timing && (
                                    <div className="mt-2 flex gap-2">
                                        {med.timing.beforeFood && (
                                            <span className="rounded bg-orange-100 px-2 py-0.5 text-xs text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                                                Before Food
                                            </span>
                                        )}
                                        {med.timing.afterFood && (
                                            <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                After Food
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Lab Tests */}
            {prescription.labTests && prescription.labTests.length > 0 && (
                <div className="border-b p-4 md:p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <TestTube className="h-4 w-4 text-primary" />
                        Lab Tests ({prescription.labTests.length})
                    </h3>
                    <div className="space-y-2">
                        {prescription.labTests.map((test: any, index: number) => (
                            <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                                <div>
                                    <p className="font-medium">{test.name}</p>
                                    {test.instructions && (
                                        <p className="text-sm text-muted-foreground">{test.instructions}</p>
                                    )}
                                </div>
                                <span className={cn(
                                    'rounded-full px-2 py-0.5 text-xs',
                                    test.priority === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-muted text-muted-foreground'
                                )}>
                                    {test.priority}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Advice & Follow-up */}
            <div className="p-4 md:p-6">
                {prescription.advice && (
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">Advice</h3>
                        <p className="text-muted-foreground whitespace-pre-line">{prescription.advice}</p>
                    </div>
                )}

                {prescription.followUpDays && (
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>Follow-up in {prescription.followUpDays} days</span>
                    </div>
                )}

                <p className="mt-4 text-xs text-muted-foreground">
                    Valid until: {format(parseISO(prescription.validUntil), 'MMM d, yyyy')}
                </p>
            </div>
        </div>
    );
}

export default PrescriptionViewer;
