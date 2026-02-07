'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format, addDays, isSameDay, startOfDay } from 'date-fns';
import { Calendar, Clock, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAvailableSlots } from '@/features/appointments';
import { LoadingSpinner } from '@/components/shared';
import type { TimeSlot } from '@/types';

interface QuickSlotPickerProps {
    doctorId: string;
    doctorSlug: string;
    className?: string;
}

export function QuickSlotPicker({ doctorId, doctorSlug, className }: QuickSlotPickerProps) {
    const router = useRouter();
    const today = startOfDay(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(today);
    const [consultationType, setConsultationType] = useState<'in_person' | 'online'>('in_person');

    // Generate next 7 days
    const dates = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => addDays(today, i));
    }, [today]);

    const { data: slotsData, isLoading } = useAvailableSlots({
        doctorId,
        date: format(selectedDate, 'yyyy-MM-dd'),
        consultationType,
    });

    const handleSlotClick = (slot: TimeSlot) => {
        const queryParams = new URLSearchParams({
            date: format(selectedDate, 'yyyy-MM-dd'),
            time: slot.time,
            type: consultationType
        }).toString();

        router.push(`/patient/book/${doctorId}?${queryParams}`);
    };

    return (
        <div className={cn("space-y-4", className)}>
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
                    Quick Book
                </h3>
            </div>

            {/* Consultation Type Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                    onClick={() => setConsultationType('in_person')}
                    className={cn(
                        "flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                        consultationType === 'in_person'
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    In-Clinic
                </button>
                <button
                    onClick={() => setConsultationType('online')}
                    className={cn(
                        "flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                        consultationType === 'online'
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    Online
                </button>
            </div>

            {/* Date Scroller */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {dates.map((date) => {
                    const isSelected = isSameDay(date, selectedDate);
                    return (
                        <button
                            key={date.toISOString()}
                            onClick={() => setSelectedDate(date)}
                            className={cn(
                                "flex flex-col items-center justify-center min-w-[60px] py-3 rounded-xl border transition-all active:scale-95",
                                isSelected
                                    ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20"
                                    : "bg-card border-border text-muted-foreground hover:border-primary/50"
                            )}
                        >
                            <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70">
                                {format(date, 'EEE')}
                            </span>
                            <span className="text-sm font-black">
                                {format(date, 'd')}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Slots Grid */}
            <div className="min-h-[120px] relative">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <LoadingSpinner size="sm" />
                    </div>
                ) : slotsData?.slots && slotsData.slots.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                        {slotsData.slots.slice(0, 6).map((slot: TimeSlot) => (
                            <button
                                key={slot.time}
                                onClick={() => handleSlotClick(slot)}
                                disabled={!slot.available}
                                className={cn(
                                    "flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-bold transition-all active:scale-95",
                                    slot.available
                                        ? "bg-slate-50 border-slate-200 text-slate-700 hover:border-primary hover:bg-primary/5 hover:text-primary"
                                        : "bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed line-through"
                                )}
                            >
                                <Clock className="h-3 w-3" />
                                {slot.time}
                            </button>
                        ))}
                        {slotsData.slots.length > 6 && (
                            <button
                                onClick={() => router.push(`/patient/book/${doctorId}`)}
                                className="col-span-2 text-center text-[10px] font-black uppercase tracking-widest text-primary pt-2 hover:underline"
                            >
                                + {slotsData.slots.length - 6} more slots
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <Calendar className="h-6 w-6 text-slate-300 mb-2" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            No slots available
                        </p>
                    </div>
                )}
            </div>

            <button
                onClick={() => router.push(`/patient/book/${doctorId}`)}
                className="w-full bg-slate-900 text-white py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 transition-all active:scale-[0.98]"
            >
                View Full Calendar
            </button>
        </div>
    );
}
