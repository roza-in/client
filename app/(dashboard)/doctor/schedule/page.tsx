'use client';

import { Calendar, Clock, CalendarOff, AlertTriangle } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared';
import { useAuth } from '@/hooks/use-auth';
import { useDoctorSchedule, useScheduleOverrides, type DayOfWeek } from '@/features/schedules';
import { format } from 'date-fns';

const DAYS: { key: DayOfWeek; label: string }[] = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
];

export default function DoctorSchedulePage() {
    const { user } = useAuth();
    const doctorId = user?.doctor?.id;

    // Data fetching
    const { data: scheduleData, isLoading: isLoadingSchedule } = useDoctorSchedule(doctorId || null);
    const { data: overrides, isLoading: isLoadingOverrides } = useScheduleOverrides(doctorId || null);

    if (isLoadingSchedule || isLoadingOverrides) {
        return (
            <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!doctorId) {
        return (
            <div className="p-6 text-center">
                <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
                <h1 className="text-xl font-bold">Doctor Profile Not Found</h1>
                <p className="text-muted-foreground mt-2">Your account does not seem to have a doctor profile attached.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">My Schedule</h1>
                <p className="text-muted-foreground">Your weekly consultation timings managed by the hospital</p>
            </div>

            {/* Weekly Schedule Grid */}
            <div className="rounded-xl border overflow-hidden bg-card shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-muted/50">
                            <th className="px-6 py-4 text-left text-sm font-semibold tracking-wide">Day</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold tracking-wide">Consultation Timings</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold tracking-wide">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {DAYS.map((day) => {
                            const daySchedules = (scheduleData as any)?.[day.key]?.schedules || [];
                            const isAvailable = daySchedules.length > 0;

                            return (
                                <tr key={day.key} className="hover:bg-muted/5 transition-colors">
                                    <td className="px-6 py-5">
                                        <span className="font-bold text-slate-800">{day.label}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        {isAvailable ? (
                                            <div className="flex flex-wrap gap-2">
                                                {daySchedules.map((slot: any) => (
                                                    <span
                                                        key={slot.id}
                                                        className="inline-flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/20 px-3 py-1.5 text-sm font-medium text-primary shadow-sm"
                                                    >
                                                        <Clock className="h-3.5 w-3.5" />
                                                        {slot.startTime} - {slot.endTime}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-sm text-muted-foreground italic">No consultation slots</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${isAvailable
                                            ? 'bg-green-100 text-green-700 ring-1 ring-inset ring-green-600/20'
                                            : 'bg-slate-100 text-slate-500 ring-1 ring-inset ring-slate-600/10'
                                            }`}>
                                            {isAvailable ? 'Available' : 'Off'}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center gap-2 text-sm text-primary font-medium bg-primary/5 p-4 rounded-xl border border-primary/10">
                <AlertTriangle className="h-4 w-4" />
                <span>Please contact your hospital administrator to modify your recurring weekly schedule.</span>
            </div>

            {/* Overrides Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <CalendarOff className="h-5 w-5 text-primary" />
                    Upcoming Leaves & Holidays
                </h2>

                {overrides && overrides.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {overrides.map((override: any) => (
                            <div key={override.id} className="p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${override.overrideType === 'holiday' ? 'bg-purple-100 text-purple-700' :
                                        override.overrideType === 'leave' ? 'bg-orange-100 text-orange-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                        {override.overrideType}
                                    </span>
                                    <span className="text-[10px] font-bold text-muted-foreground">
                                        {format(new Date(override.overrideDate), 'MMM d, yyyy')}
                                    </span>
                                </div>
                                <p className="font-bold text-slate-900 mb-1">{override.reason || 'No reason provided'}</p>
                                <p className="text-xs text-muted-foreground">
                                    {format(new Date(override.overrideDate), 'EEEE')}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 rounded-xl border border-dashed bg-muted/20">
                        <Calendar className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-muted-foreground font-medium">No upcoming leaves or holidays scheduled</p>
                    </div>
                )}
            </div>
        </div>
    );
}
