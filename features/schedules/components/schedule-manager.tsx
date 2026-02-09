'use client';

import { useState, useMemo } from 'react';
import { Calendar, Clock, Plus, Trash2, Edit2, X, Save, AlertTriangle, CalendarOff } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared';
import {
    useDoctorSchedule,
    useScheduleOverrides,
    useCreateSchedule,
    useDeleteSchedule,
    useCreateOverride,
    useDeleteOverride,
    type DayOfWeek,
    type CreateOverrideInput,
} from '@/features/schedules';
import { useDoctor } from '@/features/doctors/hooks/use-doctors';
import { format, addDays } from 'date-fns';

interface ScheduleManagerProps {
    doctorId: string;
    doctorName: string;
}

const DAYS: { key: DayOfWeek; label: string }[] = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
];

export function ScheduleManager({ doctorId, doctorName }: ScheduleManagerProps) {
    const [showOverrideModal, setShowOverrideModal] = useState(false);
    const [addingDay, setAddingDay] = useState<DayOfWeek | null>(null);

    // Data fetching
    const { data: scheduleData, isLoading } = useDoctorSchedule(doctorId);
    const { data: overrides, isLoading: isLoadingOverrides } = useScheduleOverrides(doctorId);
    const { data: doctorProfile } = useDoctor(doctorId);

    // Mutations
    const createScheduleMutation = useCreateSchedule();
    const deleteScheduleMutation = useDeleteSchedule();
    const createOverrideMutation = useCreateOverride();
    const deleteOverrideMutation = useDeleteOverride();

    // Duration from profile or default
    const profileDuration = doctorProfile?.slotDurationMinutes || (doctorProfile as any)?.slot_duration_minutes || 15;

    // Form state for new inline schedule
    const [newSlot, setNewSlot] = useState({
        startTime: '09:00',
        endTime: '17:00',
    });

    // Form state for new override
    const [newOverride, setNewOverride] = useState<CreateOverrideInput>({
        overrideDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        overrideType: 'leave',
        reason: '',
    });

    // Group schedule by day
    const groupedSchedule = useMemo(() => {
        if (!scheduleData) return {};
        return scheduleData;
    }, [scheduleData]);

    const handleCreateSchedule = async (day: DayOfWeek) => {
        try {
            await createScheduleMutation.mutateAsync({
                doctorId,
                data: {
                    dayOfWeek: day,
                    startTime: newSlot.startTime,
                    endTime: newSlot.endTime,
                    slotDurationMinutes: profileDuration,
                }
            });
            setAddingDay(null);
            setNewSlot({
                startTime: '09:00',
                endTime: '17:00',
            });
        } catch {
            // Error handled by mutation
        }
    };

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteMode, setDeleteMode] = useState<'schedule' | 'override' | null>(null);

    const handleDeleteSchedule = async (scheduleId: string) => {
        setDeleteId(scheduleId);
        setDeleteMode('schedule');
    };

    const confirmDeleteSchedule = async () => {
        if (!deleteId) return;
        try {
            await deleteScheduleMutation.mutateAsync(deleteId);
            setDeleteId(null);
            setDeleteMode(null);
        } catch {
            // Error handled by mutation
        }
    };

    const handleCreateOverride = async () => {
        try {
            await createOverrideMutation.mutateAsync({ doctorId, data: newOverride });
            setShowOverrideModal(false);
            setNewOverride({
                overrideDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
                overrideType: 'leave',
                reason: '',
            });
        } catch {
            // Error handled by mutation
        }
    };

    const handleDeleteOverride = async (overrideId: string) => {
        setDeleteId(overrideId);
        setDeleteMode('override');
    };

    const confirmDeleteOverride = async () => {
        if (!deleteId) return;
        try {
            await deleteOverrideMutation.mutateAsync(deleteId);
            setDeleteId(null);
            setDeleteMode(null);
        } catch {
            // Error handled by mutation
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
                    <Calendar className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold text-lg">Schedule Management</h2>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowOverrideModal(true)}
                        className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                    >
                        <CalendarOff className="h-4 w-4" />
                        Add Leave/Holiday
                    </button>
                </div>
            </div>

            {/* Weekly Schedule Grid */}
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <div className="bg-muted/40 px-6 py-4 border-b">
                    <h3 className="font-medium">Weekly Schedule for Dr. {doctorName}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        Manage consultation timings for each day of the week
                    </p>
                </div>

                <div className="divide-y">
                    {DAYS.map((day) => {
                        const daySchedules = (groupedSchedule as any)[day.key]?.schedules || [];
                        const hasSchedules = daySchedules.length > 0;

                        return (
                            <div key={day.key} className="flex items-start p-4 gap-4 hover:bg-muted/10 transition-colors">
                                <div className="w-28 shrink-0">
                                    <span className="font-medium text-sm">{day.label}</span>
                                </div>
                                <div className="flex-1 space-y-3">
                                    {hasSchedules && (
                                        <div className="flex flex-wrap gap-2">
                                            {daySchedules.map((slot: any, idx: number) => (
                                                <div
                                                    key={slot.id || idx}
                                                    className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2"
                                                >
                                                    <Clock className="h-3.5 w-3.5 text-primary" />
                                                    <span className="text-sm font-medium">
                                                        {slot.startTime} - {slot.endTime}
                                                    </span>
                                                    {slot.id && (
                                                        <button
                                                            onClick={() => handleDeleteSchedule(slot.id)}
                                                            className="ml-1 p-1 rounded hover:bg-red-100 text-red-500 transition-colors"
                                                            disabled={deleteScheduleMutation.isPending}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {addingDay === day.key ? (
                                        <div className="w-fit flex items-center gap-3 bg-muted/30 p-3 rounded-lg border border-dashed border-primary/30 animate-in fade-in slide-in-from-top-1">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="time"
                                                    value={newSlot.startTime}
                                                    onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                                                    className="rounded border px-2 py-1 text-sm focus:ring-1 focus:ring-primary outline-none"
                                                />
                                                <span className="text-xs text-muted-foreground">to</span>
                                                <input
                                                    type="time"
                                                    value={newSlot.endTime}
                                                    onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                                                    className="rounded border px-2 py-1 text-sm focus:ring-1 focus:ring-primary outline-none"
                                                />
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={() => handleCreateSchedule(day.key)}
                                                    disabled={createScheduleMutation.isPending}
                                                    className="bg-primary text-primary-foreground p-1.5 rounded hover:bg-primary/90 disabled:opacity-50"
                                                >
                                                    {createScheduleMutation.isPending ? <LoadingSpinner size="sm" /> : <Save className="h-3.5 w-3.5" />}
                                                </button>
                                                <button
                                                    onClick={() => setAddingDay(null)}
                                                    className="bg-muted p-1.5 rounded hover:bg-muted/80"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setAddingDay(day.key);
                                                setNewSlot({ startTime: '09:00', endTime: '17:00' });
                                            }}
                                            className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                                        >
                                            <Plus className="h-3 w-3" />
                                            Add {hasSchedules ? 'Another' : ''} Slot
                                        </button>
                                    )}
                                </div>
                                <div className="shrink-0 mt-1">
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${hasSchedules
                                            ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
                                            : 'bg-gray-100 text-gray-500'
                                            }`}
                                    >
                                        {hasSchedules ? 'Available' : 'Off'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Overrides Section */}
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <div className="bg-muted/40 px-6 py-4 border-b flex items-center justify-between">
                    <div>
                        <h3 className="font-medium flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            Schedule Overrides
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            Holidays, leaves, and special hours for specific dates
                        </p>
                    </div>
                </div>

                {isLoadingOverrides ? (
                    <div className="p-8 text-center">
                        <LoadingSpinner />
                    </div>
                ) : overrides && overrides.length > 0 ? (
                    <div className="divide-y">
                        {overrides.map((override: any) => (
                            <div key={override.id} className="flex items-center justify-between p-4 hover:bg-muted/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${override.overrideType === 'holiday'
                                        ? 'bg-purple-50 text-purple-600'
                                        : override.overrideType === 'leave'
                                            ? 'bg-orange-50 text-orange-600'
                                            : override.overrideType === 'emergency'
                                                ? 'bg-red-50 text-red-600'
                                                : 'bg-blue-50 text-blue-600'
                                        }`}>
                                        <CalendarOff className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm capitalize">
                                            {override.overrideType.replace('_', ' ')}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {format(new Date(override.overrideDate), 'EEEE, MMMM d, yyyy')}
                                        </p>
                                        {override.reason && (
                                            <p className="text-xs text-muted-foreground mt-1 italic">
                                                "{override.reason}"
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteOverride(override.id)}
                                    className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                                    disabled={deleteOverrideMutation.isPending}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center text-muted-foreground">
                        <CalendarOff className="h-10 w-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No schedule overrides configured</p>
                    </div>
                )}
            </div>



            {/* Add Override Modal */}
            {showOverrideModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-background rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="font-semibold">Add Leave / Holiday</h3>
                            <button onClick={() => setShowOverrideModal(false)} className="p-1 rounded hover:bg-muted">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Date</label>
                                <input
                                    type="date"
                                    value={newOverride.overrideDate}
                                    onChange={(e) => setNewOverride({ ...newOverride, overrideDate: e.target.value })}
                                    min={format(new Date(), 'yyyy-MM-dd')}
                                    className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                                />
                            </div>

                            {/* Override Type */}
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Type</label>
                                <select
                                    value={newOverride.overrideType}
                                    onChange={(e) => setNewOverride({ ...newOverride, overrideType: e.target.value as any })}
                                    className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                                >
                                    <option value="leave">Leave</option>
                                    <option value="holiday">Holiday</option>
                                    <option value="emergency">Emergency</option>
                                    <option value="special_hours">Special Hours</option>
                                </select>
                            </div>

                            {/* Reason */}
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Reason (Optional)</label>
                                <input
                                    type="text"
                                    value={newOverride.reason || ''}
                                    onChange={(e) => setNewOverride({ ...newOverride, reason: e.target.value })}
                                    placeholder="e.g., Annual leave, Republic Day"
                                    className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                                />
                            </div>

                            {/* Special Hours (conditional) */}
                            {newOverride.overrideType === 'special_hours' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Start Time</label>
                                        <input
                                            type="time"
                                            value={newOverride.startTime || '09:00'}
                                            onChange={(e) => setNewOverride({ ...newOverride, startTime: e.target.value })}
                                            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">End Time</label>
                                        <input
                                            type="time"
                                            value={newOverride.endTime || '13:00'}
                                            onChange={(e) => setNewOverride({ ...newOverride, endTime: e.target.value })}
                                            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 p-4 border-t bg-muted/20">
                            <button
                                onClick={() => setShowOverrideModal(false)}
                                className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateOverride}
                                disabled={createOverrideMutation.isPending}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                                {createOverrideMutation.isPending ? (
                                    <LoadingSpinner size="sm" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                Save Override
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-background rounded-xl shadow-xl w-full max-w-sm mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-600 mb-4">
                                <Trash2 className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
                            <p className="text-sm text-muted-foreground mb-6">
                                Are you sure you want to delete this {deleteMode === 'schedule' ? 'schedule slot' : 'override'}? This action cannot be undone.
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => {
                                        setDeleteId(null);
                                        setDeleteMode(null);
                                    }}
                                    className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={deleteMode === 'schedule' ? confirmDeleteSchedule : confirmDeleteOverride}
                                    disabled={deleteScheduleMutation.isPending || deleteOverrideMutation.isPending}
                                    className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {(deleteScheduleMutation.isPending || deleteOverrideMutation.isPending) ? (
                                        <LoadingSpinner size="sm" />
                                    ) : (
                                        'Delete'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
