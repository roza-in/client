/**
 * Appointment Components - Booking Form
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { User, Users, Phone, FileText, AlertCircle } from 'lucide-react';
import { useFamilyMembers } from '@/features/patients';
import { formatCurrency } from '@/lib/utils';
import { LoadingSpinner } from '@/components/shared';
import type { TimeSlot, Doctor, FamilyMember } from '@/types';

// =============================================================================
// Schema
// =============================================================================

const bookingSchema = z.object({
    patientType: z.enum(['self', 'family']),
    familyMemberId: z.string().optional(),
    chiefComplaint: z.string().min(10, 'Please describe your symptoms (min 10 characters)'),
    symptoms: z.string().optional(),
});

type BookingData = z.infer<typeof bookingSchema>;

// =============================================================================
// Types
// =============================================================================

interface BookingFormProps {
    doctor: Doctor;
    selectedDate: Date;
    selectedSlot: TimeSlot;
    consultationType: 'in_person' | 'video' | 'audio';
    consultationFee: number;
    platformFee: number;
    totalFee: number;
    onSubmit: (data: BookingData) => void;
    isSubmitting?: boolean;
    className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function BookingForm({
    doctor,
    selectedDate,
    selectedSlot,
    consultationType,
    consultationFee,
    platformFee,
    totalFee,
    onSubmit,
    isSubmitting = false,
    className,
}: BookingFormProps) {
    const [patientType, setPatientType] = useState<'self' | 'family'>('self');
    const { data: familyMembers = [], isLoading: loadingFamily } = useFamilyMembers();

    const form = useForm<BookingData>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            patientType: 'self',
            chiefComplaint: '',
            symptoms: '',
        },
    });

    const handlePatientTypeChange = (type: 'self' | 'family') => {
        setPatientType(type);
        form.setValue('patientType', type);
        if (type === 'self') {
            form.setValue('familyMemberId', undefined);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-6', className)}>
            {/* Patient Selection */}
            <div>
                <label className="block text-sm font-medium mb-3">Booking for</label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => handlePatientTypeChange('self')}
                        className={cn(
                            'flex items-center gap-3 rounded-lg border p-4 transition-colors',
                            patientType === 'self'
                                ? 'border-primary bg-primary/5'
                                : 'hover:bg-muted'
                        )}
                    >
                        <User className={cn('h-5 w-5', patientType === 'self' && 'text-primary')} />
                        <span className="font-medium">Myself</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handlePatientTypeChange('family')}
                        className={cn(
                            'flex items-center gap-3 rounded-lg border p-4 transition-colors',
                            patientType === 'family'
                                ? 'border-primary bg-primary/5'
                                : 'hover:bg-muted'
                        )}
                    >
                        <Users className={cn('h-5 w-5', patientType === 'family' && 'text-primary')} />
                        <span className="font-medium">Family Member</span>
                    </button>
                </div>
            </div>

            {/* Family Member Selection */}
            {patientType === 'family' && (
                <div>
                    <label className="block text-sm font-medium mb-2">Select Family Member</label>
                    {loadingFamily ? (
                        <div className="flex justify-center py-4">
                            <LoadingSpinner size="sm" />
                        </div>
                    ) : familyMembers.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-4 text-center">
                            <p className="text-sm text-muted-foreground">No family members added</p>
                            <a href="/family-members" className="text-sm text-primary hover:underline">
                                Add family member
                            </a>
                        </div>
                    ) : (
                        <select
                            {...form.register('familyMemberId')}
                            className={cn(
                                'w-full rounded-md border bg-background p-3 text-sm',
                                'focus:outline-none focus:ring-2 focus:ring-ring',
                                form.formState.errors.familyMemberId && 'border-destructive'
                            )}
                        >
                            <option value="">Select a family member</option>
                            {familyMembers.map((member) => (
                                <option key={member.id} value={member.id}>
                                    {member.name}  ({member.relationship})
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            )}

            {/* Chief Complaint */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    Chief Complaint <span className="text-destructive">*</span>
                </label>
                <textarea
                    {...form.register('chiefComplaint')}
                    placeholder="Describe your main health concern or reason for visit..."
                    rows={3}
                    className={cn(
                        'w-full rounded-md border bg-background p-3 text-sm resize-none',
                        'focus:outline-none focus:ring-2 focus:ring-ring',
                        form.formState.errors.chiefComplaint && 'border-destructive'
                    )}
                />
                {form.formState.errors.chiefComplaint && (
                    <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {form.formState.errors.chiefComplaint.message}
                    </p>
                )}
            </div>

            {/* Additional Symptoms */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    Additional Symptoms (Optional)
                </label>
                <input
                    {...form.register('symptoms')}
                    type="text"
                    placeholder="e.g., fever, headache, fatigue"
                    className="w-full rounded-md border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                    Separate multiple symptoms with commas
                </p>
            </div>

            {/* Fee Breakdown */}
            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Consultation Fee</span>
                    <span>{formatCurrency(consultationFee)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(consultationFee)}</span>
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                    'w-full rounded-md bg-primary py-3 text-sm font-medium text-primary-foreground',
                    'hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'flex items-center justify-center gap-2'
                )}
            >
                {isSubmitting ? (
                    <>
                        <LoadingSpinner size="sm" />
                        Processing...
                    </>
                ) : (
                    `Pay ${formatCurrency(consultationFee)} & Book`
                )}
            </button>

            {/* Cancellation Policy */}
            <p className="text-xs text-center text-muted-foreground">
                By booking, you agree to our{' '}
                <a href="/cancellation-policy" className="text-primary hover:underline">
                    cancellation policy
                </a>
            </p>
        </form>
    );
}

export default BookingForm;
