/**
 * Reception Feature - Patient History Drawer
 */

'use client';

import { useAppointments } from '@/features/appointments/hooks/use-appointments';
import { useAuth } from '@/hooks/use-auth';
import { X, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared';
import { cn } from '@/lib/utils';

interface PatientHistoryDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    patient: {
        id: string;
        name: string;
    } | null;
}

export function PatientHistoryDrawer({ isOpen, onClose, patient }: PatientHistoryDrawerProps) {
    const { user } = useAuth();
    const hospitalId = user?.hospital?.id;

    const { data: appointmentData, isLoading } = useAppointments(
        patient?.id ? {
            patientId: patient.id,
            hospitalId: hospitalId,
            limit: 50,
            sortBy: 'appointmentDate',
            sortOrder: 'desc'
        } : {}
    );

    const appointments = appointmentData?.appointments || [];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={cn(
                    "relative h-full w-full max-w-md bg-background shadow-2xl transition-transform duration-300 ease-in-out border-l",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <div>
                        <h2 className="text-xl font-bold">Patient History</h2>
                        <p className="text-sm text-muted-foreground">{patient?.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 hover:bg-muted transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="h-[calc(100vh-80px)] overflow-y-auto p-6 scrollbar-hide">
                    {isLoading ? (
                        <div className="flex h-48 items-center justify-center">
                            <LoadingSpinner />
                        </div>
                    ) : appointments.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center text-center text-muted-foreground">
                            <div className="rounded-full bg-muted p-4 mb-4">
                                <Clock className="h-8 w-8 opacity-40" />
                            </div>
                            <h3 className="font-semibold text-foreground">No History Found</h3>
                            <p className="text-sm">This patient hasn't had any appointments yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-2xl border bg-primary/5 p-4 text-center border-primary/10">
                                    <p className="text-2xl font-bold text-primary">{appointments.length}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Visits</p>
                                </div>
                                <div className="rounded-2xl border bg-primary/5 p-4 text-center border-primary/10">
                                    <p className="text-sm font-bold truncate text-primary">
                                        {appointments[0]?.appointmentDate ? new Date(appointments[0].appointmentDate).toLocaleDateString('en-IN') : 'N/A'}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Last Visit</p>
                                </div>
                            </div>

                            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-widest pt-2">Appointment Timeline</h3>

                            <div className="space-y-4">
                                {appointments.map((appointment) => (
                                    <div key={appointment.id} className="group relative rounded-2xl border p-4 space-y-3 hover:border-primary/40 transition-all hover:shadow-sm bg-card">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="rounded-lg bg-primary/10 p-1.5">
                                                    <Calendar className="h-4 w-4 text-primary" />
                                                </div>
                                                <span className="font-semibold text-sm">
                                                    {new Date(appointment.appointmentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className={cn(
                                                    "rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
                                                    appointment.consultationType === 'online' ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                                                )}>
                                                    {appointment.consultationType}
                                                </div>
                                                <div className={cn(
                                                    "flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                                                    appointment.status === 'completed' ? "bg-green-100 text-green-700" :
                                                        appointment.status === 'cancelled' ? "bg-red-100 text-red-700" :
                                                            "bg-gray-100 text-gray-700"
                                                )}>
                                                    {appointment.status === 'completed' && <CheckCircle className="h-3 w-3" />}
                                                    {appointment.status === 'cancelled' && <XCircle className="h-3 w-3" />}
                                                    {appointment.status}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground border-2 border-background ring-2 ring-muted/20 font-bold text-xs">
                                                {appointment.doctorName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'D'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">Dr. {appointment.doctorName}</p>
                                                <p className="text-xs text-muted-foreground font-medium">{appointment.doctorSpecialization}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-dashed pt-3 mt-2">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Paid Amount</span>
                                                <span className="font-bold text-sm text-foreground">₹{appointment.totalAmount}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Mode</span>
                                                <span className="text-xs font-semibold capitalize">{appointment.paymentStatus || 'Cash'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
