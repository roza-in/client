'use client';

import { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared';
import { useDoctors } from '@/features/doctors/hooks/use-doctors';
import { useAvailableSlots } from '@/features/appointments/hooks/use-available-slots';

export default function ReceptionSchedulePage() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

    const { data: doctorsData, isLoading: loadingDoctors } = useDoctors({});
    const { data: slotsData, isLoading: loadingSlots } = useAvailableSlots(
        selectedDoctorId ? { doctorId: selectedDoctorId, date: selectedDate, consultationType: 'in_person' } : null
    );

    const doctors = doctorsData?.doctors || [];
    const slots = slotsData?.slots || [];

    const changeDate = (days: number) => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + days);
        setSelectedDate(date.toISOString().split('T')[0]);
    };

    const isToday = selectedDate === new Date().toISOString().split('T')[0];

    // Format slots into morning/afternoon sessions
    const { morningSlots, afternoonSlots } = useMemo(() => {
        const morning: any[] = [];
        const afternoon: any[] = [];

        slots.forEach((slot: any, idx: number) => {
            // TimeSlot.time is a formatted time string like "09:00" or "14:30"
            const timeStr = slot.time || '';
            // Parse hour from time string (e.g., "09:00" -> 9, "14:30" -> 14)
            const hourMatch = timeStr.match(/^(\d{1,2})/);
            const hour = hourMatch ? parseInt(hourMatch[1], 10) : 12;

            const formatted = {
                id: slot.id || `slot-${idx}`,
                time: timeStr || 'N/A',
                available: slot.available !== false,
                booked: 0, // Not tracking bookings on this display
                max: 1,
            };

            if (hour < 12) {
                morning.push(formatted);
            } else {
                afternoon.push(formatted);
            }
        });

        return { morningSlots: morning, afternoonSlots: afternoon };
    }, [slots]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Doctor Schedules</h1>
                        <p className="text-muted-foreground">
                            View doctor availability and slot status
                        </p>
                    </div>
                </div>

                {/* Date Navigation */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => changeDate(-1)}
                        disabled={isToday}
                        className="rounded-lg border p-2 hover:bg-muted disabled:opacity-50"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="rounded-lg border px-3 py-2 text-sm"
                        />
                        <span className="text-sm text-muted-foreground">
                            {isToday ? '(Today)' : ''}
                        </span>
                    </div>
                    <button
                        onClick={() => changeDate(1)}
                        className="rounded-lg border p-2 hover:bg-muted"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Doctor List */}
                <div className="lg:col-span-1">
                    <h2 className="font-semibold mb-3">Doctors</h2>
                    {loadingDoctors ? (
                        <div className="flex h-24 items-center justify-center">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {doctors.map((doctor: any) => (
                                <button
                                    key={doctor.id}
                                    onClick={() => setSelectedDoctorId(doctor.id)}
                                    className={`w-full rounded-lg border p-3 text-left transition-colors ${selectedDoctorId === doctor.id
                                        ? 'border-primary bg-primary/5'
                                        : 'hover:border-primary/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-sm">
                                            {doctor.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'D'}
                                        </div>
                                        <div>
                                            <p className="font-medium">Dr. {doctor.name}</p>
                                            <p className="text-sm text-muted-foreground">{typeof doctor.specialization === 'string' ? doctor.specialization : doctor.specialization?.name || 'General'}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Schedule View */}
                <div className="lg:col-span-2">
                    {!selectedDoctorId ? (
                        <div className="rounded-xl border p-12 text-center">
                            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="font-semibold mb-2">Select a doctor</h3>
                            <p className="text-sm text-muted-foreground">
                                Choose a doctor from the list to view their schedule
                            </p>
                        </div>
                    ) : loadingSlots ? (
                        <div className="flex h-48 items-center justify-center">
                            <LoadingSpinner />
                        </div>
                    ) : slots.length === 0 ? (
                        <div className="rounded-xl border p-12 text-center">
                            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="font-semibold mb-2">No slots available</h3>
                            <p className="text-sm text-muted-foreground">
                                No schedule configured for this date
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Morning Session */}
                            {morningSlots.length > 0 && (
                                <div>
                                    <h3 className="font-medium mb-3 flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                        Morning Session
                                    </h3>
                                    <div className="grid gap-2 grid-cols-4 md:grid-cols-6">
                                        {morningSlots.map((slot) => (
                                            <div
                                                key={slot.id}
                                                className={`rounded-lg border p-3 text-center text-sm ${slot.available
                                                    ? 'bg-green-50 border-green-200'
                                                    : 'bg-red-50 border-red-200'
                                                    }`}
                                            >
                                                <p className="font-medium">{slot.time}</p>
                                                <p className="text-[10px] uppercase font-semibold mt-1">
                                                    {slot.available ? 'Available' : 'Full'}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Afternoon Session */}
                            {afternoonSlots.length > 0 && (
                                <div>
                                    <h3 className="font-medium mb-3 flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-orange-500" />
                                        Afternoon Session
                                    </h3>
                                    <div className="grid gap-2 grid-cols-4 md:grid-cols-6">
                                        {afternoonSlots.map((slot) => (
                                            <div
                                                key={slot.id}
                                                className={`rounded-lg border p-3 text-center text-sm ${slot.available
                                                    ? 'bg-green-50 border-green-200'
                                                    : 'bg-red-50 border-red-200'
                                                    }`}
                                            >
                                                <p className="font-medium">{slot.time}</p>
                                                <p className="text-[10px] uppercase font-semibold mt-1">
                                                    {slot.available ? 'Available' : 'Full'}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
