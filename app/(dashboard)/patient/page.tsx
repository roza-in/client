'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format, formatDistanceToNow, isToday, isTomorrow } from 'date-fns';
import { Calendar, Clock, Video, Building2, ArrowRight, Plus, ChevronRight, Loader2, Star, AlertCircle, Sparkles, Heart, Activity, MapPin, ExternalLink } from 'lucide-react';
import { routes } from '@/config';
import { patientsApi, type PatientDashboardData } from '@/lib/api/patients';
import { fetchFeaturedDoctors, type PublicDoctor } from '@/lib/api/public';
import { toast } from 'sonner';

export default function PatientDashboardPage() {
    const [data, setData] = useState<PatientDashboardData | null>(null);
    const [recommendedDoctors, setRecommendedDoctors] = useState<PublicDoctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadDashboard() {
            try {
                setLoading(true);
                const [dashboardResult, doctorsResult] = await Promise.all([
                    patientsApi.fetchPatientDashboard(),
                    fetchFeaturedDoctors(4).catch(() => [])
                ]);
                setData(dashboardResult);
                setRecommendedDoctors(doctorsResult);
            } catch (err: any) {
                console.error('Failed to load dashboard:', err);
                setError(err.message || 'Failed to load dashboard');
                toast.error('Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        }
        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="font-semibold mb-1">Something went wrong</h2>
                <p className="text-sm text-muted-foreground mb-4">{error || 'Could not load dashboard'}</p>
                <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                    Try Again
                </button>
            </div>
        );
    }

    const { upcomingAppointments, activityTimeline, user } = data;
    const nextAppointment = upcomingAppointments?.[0];
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <p className="text-muted-foreground text-sm">{greeting}</p>
                    <h1 className="text-2xl font-bold">{user.name || 'there'} 👋</h1>
                </div>
                <Link
                    href={routes.patient.bookAppointment}
                    className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                >
                    <Plus className="h-4 w-4" />
                    Book Appointment
                </Link>
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Next Appointment */}
                    {nextAppointment ? (
                        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground rounded-2xl p-6">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
                            </div>

                            <div className="relative">
                                <div className="flex items-start justify-between mb-5">
                                    <div>
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-xs font-medium mb-2">
                                            <Calendar className="h-3 w-3" />
                                            Next Appointment
                                        </div>
                                        <p className="text-2xl font-bold">
                                            {getAppointmentDateLabel(nextAppointment.appointmentDate)}
                                        </p>
                                        <p className="text-primary-foreground/70 text-sm mt-1">
                                            at {nextAppointment.startTime || '10:00 AM'}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/patient/appointments/${nextAppointment.id}`}
                                        className="flex items-center text-white gap-1 underline text-sm"
                                    >
                                        View Details
                                        <ChevronRight className="h-4 w-4 text-sm" />
                                    </Link>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                                    <div className="flex items-center gap-4">
                                        {nextAppointment.doctorAvatar ? (
                                            <img src={nextAppointment.doctorAvatar} alt="" className="h-12 w-12 rounded-xl object-cover" />
                                        ) : (
                                            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center text-lg font-bold">
                                                {nextAppointment.doctorName?.charAt(0) || 'D'}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <p className="font-semibold truncate">Dr. {nextAppointment.doctorName}</p>
                                            <p className="text-sm text-primary-foreground/70 truncate">
                                                {nextAppointment.doctorSpecialization || 'Consultation'}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        {nextAppointment.consultationType === 'online' ? (
                                            <Link
                                                href={`/consultation/${nextAppointment.id}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-primary text-sm font-medium hover:bg-white/90 transition-colors"
                                            >
                                                <Video className="h-4 w-4" />
                                                Join Call
                                            </Link>
                                        ) : (
                                            <div className="flex flex-col text-sm">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 shrink-0" />
                                                    <span className="font-medium">{nextAppointment.hospitalName || 'Hospital'}</span>
                                                </div>
                                                {(nextAppointment.hospitalAddress || nextAppointment.hospitalCity || nextAppointment.hospitalState) && (
                                                    <p className="text-xs text-primary-foreground/60 ml-6 mt-0.5">
                                                        {[nextAppointment.hospitalAddress, nextAppointment.hospitalCity, nextAppointment.hospitalState].filter(Boolean).join(', ')}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-card rounded-2xl border-2 border-dashed p-8 text-center">
                            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <Calendar className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">No upcoming appointments</h3>
                            <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
                                Take care of your health. Book an appointment with our trusted doctors.
                            </p>
                            <Link
                                href={routes.patient.bookAppointment}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                Find a Doctor
                            </Link>
                        </div>
                    )}

                    {/* More Appointments */}
                    {upcomingAppointments && upcomingAppointments.length > 1 && (
                        <div className="">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-semibold">Upcoming</h2>
                                <Link href={routes.patient.appointments} className="text-sm text-primary hover:underline flex items-center gap-1">
                                    View all <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {upcomingAppointments.slice(1, 4).map((apt) => (
                                    <Link
                                        key={apt.id}
                                        href={`/patient/appointments/${apt.id}`}
                                        className="flex items-center gap-4 p-3 rounded-lg border border-primary/50 hover:border-primary/20 transition-colors -mx-1"
                                    >
                                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center font-semibold text-sm text-primary">
                                            {apt.doctorName?.charAt(0) || 'D'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">Dr. {apt.doctorName}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span className="truncate">{apt.doctorSpecialization || 'Consultation'}</span>
                                                {apt.consultationType === 'online' ? (
                                                    <span className="inline-flex items-center gap-0.5 text-emerald-600">
                                                        <Video className="h-3 w-3" /> Video
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-0.5 text-blue-600">
                                                        <Building2 className="h-3 w-3" /> Clinic
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-sm font-medium">{formatAppointmentDate(apt.appointmentDate)}</p>
                                            <p className="text-xs text-muted-foreground">{apt.startTime}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recommended Doctors */}
                    {recommendedDoctors.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-primary" />
                                    <h2 className="font-semibold">Recommended for You</h2>
                                </div>
                                <Link href={routes.patient.bookAppointment} className="text-sm text-primary hover:underline flex items-center gap-1">
                                    View all <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {recommendedDoctors.slice(0, 4).map((doctor) => (
                                    <Link
                                        key={doctor.id}
                                        href={`/patient/book/${doctor.id}`}
                                        className="bg-card rounded-xl border p-4 hover:border-primary/30 hover:shadow-sm transition-all group"
                                    >
                                        <div className="flex gap-3">
                                            {doctor.avatar_url ? (
                                                <img src={doctor.avatar_url} alt={doctor.name} className="h-12 w-12 rounded-xl object-cover" />
                                            ) : (
                                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-lg font-bold text-primary">
                                                    {doctor.name?.charAt(0) || 'D'}
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate group-hover:text-primary transition-colors">
                                                    Dr. {doctor.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {typeof doctor.specialization === 'object' ? doctor.specialization?.name : doctor.specialization || 'General'}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="flex items-center gap-0.5 text-xs text-amber-600">
                                                        <Star className="h-3 w-3 fill-current" />
                                                        {doctor.rating?.toFixed(1) || '4.5'}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        ₹{doctor.consultation_fee_in_person || doctor.consultation_fee_online || 500}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-card rounded-xl border p-5">
                        <h3 className="font-semibold mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <Link href={routes.patient.appointments} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">My Appointments</p>
                                    <p className="text-xs text-muted-foreground">View history</p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </Link>
                            <Link href={routes.patient.bookAppointment} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                    <Video className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Video Consult</p>
                                    <p className="text-xs text-muted-foreground">Consult from home</p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </Link>
                        </div>
                    </div>

                    {/* Health Tip */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-5 border border-emerald-100 dark:border-emerald-800/30">
                        <div className="flex items-center gap-2 mb-3">
                            <Heart className="h-5 w-5 text-emerald-600" />
                            <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">Health Tip</h3>
                        </div>
                        <p className="text-sm text-emerald-800 dark:text-emerald-200 leading-relaxed">
                            Regular health check-ups help detect issues early. Consider booking a preventive health screening today!
                        </p>
                    </div>

                    {/* Recent Activity */}
                    {activityTimeline && activityTimeline.length > 0 && (
                        <div className="bg-card rounded-xl border p-5">
                            <h3 className="font-semibold mb-4">Recent Activity</h3>
                            <div className="space-y-3">
                                {activityTimeline.slice(0, 4).map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-3">
                                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                                            <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{activity.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                            </p>
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

function getAppointmentDateLabel(dateStr: string): string {
    try {
        const date = new Date(dateStr);
        if (isToday(date)) return 'Today';
        if (isTomorrow(date)) return 'Tomorrow';
        return format(date, 'EEEE, MMM d');
    } catch {
        return 'Upcoming';
    }
}

function formatAppointmentDate(dateStr: string): string {
    try {
        const date = new Date(dateStr);
        if (isToday(date)) return 'Today';
        if (isTomorrow(date)) return 'Tomorrow';
        return format(date, 'MMM d');
    } catch {
        return 'TBD';
    }
}
