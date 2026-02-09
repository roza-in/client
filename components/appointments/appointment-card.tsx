/**
 * Appointment Components - Appointment Card
 */

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Calendar, Clock, Video, Building2, User, ChevronRight, MoreVertical } from 'lucide-react';
import { format, parseISO, isToday, isTomorrow, isPast } from 'date-fns';
import { APPOINTMENT_STATUS_COLORS, getAppointmentStatusLabel } from '@/lib/constants';
import type { AppointmentListItem } from '@/types';

interface AppointmentCardProps {
    appointment: AppointmentListItem;
    variant?: 'default' | 'compact';
    showActions?: boolean;
    onCancel?: () => void;
    onReschedule?: () => void;
    className?: string;
}

export function AppointmentCard({
    appointment,
    variant = 'default',
    showActions = true,
    onCancel,
    onReschedule,
    className,
}: AppointmentCardProps) {
    const appointmentDate = parseISO(appointment.appointmentDate);
    const statusColors = APPOINTMENT_STATUS_COLORS[appointment.status];
    const isPastAppointment = isPast(appointmentDate) && appointment.status === 'confirmed';

    const getDateLabel = () => {
        if (isToday(appointmentDate)) return 'Today';
        if (isTomorrow(appointmentDate)) return 'Tomorrow';
        return format(appointmentDate, 'MMM d, yyyy');
    };

    const getConsultationIcon = () => {
        switch (appointment.consultationType) {
            case 'online':
                return <Video className="h-4 w-4" />;
            case 'phone':
                return <Video className="h-4 w-4" />;
            default:
                return <Building2 className="h-4 w-4" />;
        }
    };

    if (variant === 'compact') {
        return (
            <Link
                href={`/appointments/${appointment.id}`}
                className={cn(
                    'flex items-center gap-3 rounded-lg border p-3 hover:bg-muted transition-colors',
                    className
                )}
            >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {getConsultationIcon()}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">Dr. {appointment.doctorName || 'Unknown Doctor'}</p>
                    <p className="text-sm text-muted-foreground">
                        {getDateLabel()} • {appointment.startTime}
                    </p>
                </div>
                <span
                    className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        statusColors?.bg,
                        statusColors?.text
                    )}
                >
                    {getAppointmentStatusLabel(appointment.status)}
                </span>
            </Link>
        );
    }

    return (
        <div
            className={cn(
                'rounded-xl border overflow-hidden',
                isPastAppointment && 'opacity-75',
                className
            )}
        >
            {/* Status Bar */}
            <div className={cn('px-4 py-2', statusColors?.bg, statusColors?.text)}>
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                        {getAppointmentStatusLabel(appointment.status)}
                    </span>
                    <span className="text-xs opacity-80">
                        #{appointment.bookingId}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex gap-4">
                    {/* Doctor Avatar */}
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary text-lg font-semibold">
                        {appointment.doctorName ? appointment.doctorName.charAt(0) : 'D'}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">Dr. {appointment.doctorName || 'Unknown Doctor'}</h3>
                        <p className="text-sm text-primary">{appointment.doctorSpecialization}</p>
                        {appointment.hospitalName && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Building2 className="h-3.5 w-3.5" />
                                {appointment.hospitalName}
                            </p>
                        )}
                    </div>
                </div>

                {/* Date & Time */}
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{getDateLabel()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.startTime} - {appointment.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 capitalize">
                        {getConsultationIcon()}
                        <span>{appointment.consultationType.replace('_', '-')}</span>
                    </div>
                </div>

                {/* Patient Info */}
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Patient: {appointment.patientName}</span>
                </div>

                {/* Actions */}
                {showActions && (
                    <div className="mt-4 flex gap-2 border-t pt-4">
                        <Link
                            href={`/appointments/${appointment.id}`}
                            className="flex-1 rounded-md border py-2 text-center text-sm font-medium hover:bg-muted"
                        >
                            View Details
                        </Link>
                        {appointment.status === 'confirmed' || appointment.status === 'pending' ? (
                            <>
                                {appointment.consultationType === 'online' && (
                                    <Link
                                        href={`/consultation/${appointment.id}`}
                                        className="flex-1 rounded-md bg-primary py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
                                    >
                                        Join Call
                                    </Link>
                                )}
                            </>
                        ) : appointment.status === 'completed' ? (
                            <Link
                                href={`/prescriptions?appointmentId=${appointment.id}`}
                                className="flex-1 rounded-md bg-primary py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
                            >
                                View Prescription
                            </Link>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AppointmentCard;
