/**
 * ROZX Healthcare Platform - Slot Picker Component
 * A clean, modern date and time slot selector
 */

'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Clock, Sun, Sunrise, Moon, CalendarDays, AlertCircle } from 'lucide-react';
import { format, addDays, isSameDay, startOfDay, isToday } from 'date-fns';
import { useAvailableSlots } from '@/features/appointments';
import { LoadingSpinner } from '@/components/shared';
import type { TimeSlot } from '@/types';

interface SlotPickerProps {
    doctorId: string;
    hospitalId?: string;
    consultationType?: 'in_person' | 'online' | 'video';
    selectedDate: Date | null;
    selectedSlot: TimeSlot | null;
    onDateChange: (date: Date) => void;
    onSlotChange: (slot: TimeSlot) => void;
    className?: string;
}

export function SlotPicker({
    doctorId,
    hospitalId,
    consultationType = 'in_person',
    selectedDate,
    selectedSlot,
    onDateChange,
    onSlotChange,
    className,
}: SlotPickerProps) {
    const [weekOffset, setWeekOffset] = useState(0);
    const today = startOfDay(new Date());

    // Generate week days
    const weekDays = useMemo(() => {
        const start = addDays(today, weekOffset * 7);
        return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    }, [today, weekOffset]);

    // Map consultation type for API (video -> online)
    const apiConsultationType = consultationType === 'video' ? 'online' : consultationType;

    // Fetch slots for selected date
    const { data: slotsData, isLoading } = useAvailableSlots(
        selectedDate
            ? {
                doctorId,
                date: format(selectedDate, 'yyyy-MM-dd'),
                hospitalId,
                consultationType: apiConsultationType as 'in_person' | 'online',
            }
            : null
    );

    // Filter slots by time of day
    const morningSlots = slotsData?.slots.filter((slot) => {
        const hour = parseInt(slot.time.split(':')[0]);
        return hour < 12;
    }) || [];

    const afternoonSlots = slotsData?.slots.filter((slot) => {
        const hour = parseInt(slot.time.split(':')[0]);
        return hour >= 12 && hour < 17;
    }) || [];

    const eveningSlots = slotsData?.slots.filter((slot) => {
        const hour = parseInt(slot.time.split(':')[0]);
        return hour >= 17;
    }) || [];

    const formatSlotTime = (time: string) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const h = parseInt(hours);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const hour = h % 12 || 12;
        return `${hour}:${minutes} ${ampm}`;
    };

    const totalAvailable = (slotsData?.slots || []).filter(s => s.available).length;

    return (
        <div className={cn('space-y-4', className)}>
            {/* Date Selector */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">
                            {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d')}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
                            disabled={weekOffset === 0}
                            className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label="Previous week"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setWeekOffset(weekOffset + 1)}
                            disabled={weekOffset >= 4}
                            className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label="Next week"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                    {weekDays.map((day) => {
                        const isSelected = selectedDate && isSameDay(day, selectedDate);
                        const isPast = day < today;
                        const isTodayDate = isToday(day);

                        return (
                            <button
                                key={day.toISOString()}
                                onClick={() => !isPast && onDateChange(day)}
                                disabled={isPast}
                                className={cn(
                                    'flex flex-col items-center rounded-xl py-2.5 px-1 transition-all',
                                    isSelected
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : isPast
                                            ? 'opacity-40 cursor-not-allowed'
                                            : 'hover:bg-muted'
                                )}
                            >
                                <span className={cn(
                                    'text-[10px] uppercase tracking-wide',
                                    isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'
                                )}>
                                    {format(day, 'EEE')}
                                </span>
                                <span className={cn(
                                    'text-lg font-semibold leading-tight',
                                    isTodayDate && !isSelected && 'text-primary'
                                )}>
                                    {format(day, 'd')}
                                </span>
                                {isTodayDate && (
                                    <span className={cn(
                                        'text-[9px] mt-0.5',
                                        isSelected ? 'text-primary-foreground/70' : 'text-primary'
                                    )}>
                                        Today
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Time Slots */}
            <div className="min-h-[120px]">
                {!selectedDate ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <CalendarDays className="h-10 w-10 text-muted-foreground/50 mb-2" />
                        <p className="text-sm text-muted-foreground">
                            Select a date to see available slots
                        </p>
                    </div>
                ) : isLoading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <LoadingSpinner size="md" />
                        <p className="text-sm text-muted-foreground mt-2">Loading slots...</p>
                    </div>
                ) : !slotsData?.slots.length ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <AlertCircle className="h-10 w-10 text-muted-foreground/50 mb-2" />
                        <p className="text-sm text-muted-foreground">
                            No slots available on {format(selectedDate, 'MMM d')}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                            Try selecting a different date
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Availability Summary */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full dark:bg-emerald-900/20 dark:text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                {totalAvailable} slots available
                            </span>
                        </div>

                        {/* Morning Slots */}
                        {morningSlots.length > 0 && (
                            <TimeSection
                                icon={<Sunrise className="h-4 w-4" />}
                                title="Morning"
                                slots={morningSlots}
                                selectedSlot={selectedSlot}
                                onSlotChange={onSlotChange}
                                formatTime={formatSlotTime}
                            />
                        )}

                        {/* Afternoon Slots */}
                        {afternoonSlots.length > 0 && (
                            <TimeSection
                                icon={<Sun className="h-4 w-4" />}
                                title="Afternoon"
                                slots={afternoonSlots}
                                selectedSlot={selectedSlot}
                                onSlotChange={onSlotChange}
                                formatTime={formatSlotTime}
                            />
                        )}

                        {/* Evening Slots */}
                        {eveningSlots.length > 0 && (
                            <TimeSection
                                icon={<Moon className="h-4 w-4" />}
                                title="Evening"
                                slots={eveningSlots}
                                selectedSlot={selectedSlot}
                                onSlotChange={onSlotChange}
                                formatTime={formatSlotTime}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// Time Section Component
interface TimeSectionProps {
    icon: React.ReactNode;
    title: string;
    slots: TimeSlot[];
    selectedSlot: TimeSlot | null;
    onSlotChange: (slot: TimeSlot) => void;
    formatTime: (time: string) => string;
}

function TimeSection({ icon, title, slots, selectedSlot, onSlotChange, formatTime }: TimeSectionProps) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="text-muted-foreground">{icon}</span>
                <span className="text-sm font-medium">{title}</span>
                <span className="text-xs text-muted-foreground">
                    ({slots.filter(s => s.available).length} available)
                </span>
            </div>
            <div className="flex flex-wrap gap-2">
                {slots.map((slot) => (
                    <SlotButton
                        key={slot.time}
                        slot={slot}
                        isSelected={selectedSlot?.time === slot.time}
                        onClick={() => onSlotChange(slot)}
                        formatTime={formatTime}
                    />
                ))}
            </div>
        </div>
    );
}

// Slot Button Component
interface SlotButtonProps {
    slot: TimeSlot;
    isSelected: boolean;
    onClick: () => void;
    formatTime: (time: string) => string;
}

function SlotButton({ slot, isSelected, onClick, formatTime }: SlotButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={!slot.available}
            className={cn(
                'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                isSelected
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : slot.available
                        ? 'bg-muted/50 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20'
                        : 'bg-muted/30 text-muted-foreground/50 cursor-not-allowed line-through'
            )}
        >
            <Clock className="h-3.5 w-3.5" />
            {formatTime(slot.time)}
        </button>
    );
}

export default SlotPicker;
