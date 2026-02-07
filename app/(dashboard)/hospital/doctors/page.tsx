'use client';

import Link from 'next/link';
import { LoadingSpinner } from '@/components/shared';
import { Plus, Star, UserPlus } from 'lucide-react';
import { useHospitalDoctors } from '@/features/hospitals/hooks/use-hospital-doctors';

export default function HospitalDoctorsPage() {
    const { data, isLoading, error } = useHospitalDoctors();
    const doctors = data?.doctors || [];

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
                <h2 className="font-semibold">Error loading doctors</h2>
                <p className="text-sm">Please try refreshing the page.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Doctor Management</h1>
                    <p className="text-sm text-muted-foreground">Manage your doctors and their profiles</p>
                </div>
                <Link
                    href="/hospital/doctors/add"
                    className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Doctor
                </Link>
            </div>

            {/* Content */}
            {doctors.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed p-12 text-center">
                    <UserPlus className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="font-semibold text-lg mb-1">No doctors yet</h3>
                    <p className="text-muted-foreground text-sm mb-4">Add your first doctor to start accepting appointments</p>
                    <Link
                        href="/hospital/doctors/add"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4" />
                        Add Doctor
                    </Link>
                </div>
            ) : (
                <>
                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3">
                        {doctors.map((doctor: any) => (
                            <Link
                                key={doctor.id}
                                href={`/hospital/doctors/${doctor.id}`}
                                className="block rounded-xl border p-4 hover:bg-muted/20 transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    {doctor.og_image_url ? (
                                        <img
                                            src={doctor.og_image_url}
                                            alt=""
                                            className="h-12 w-12 rounded-full object-cover ring-2 ring-background shrink-0"
                                        />
                                    ) : (
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold shrink-0">
                                            {(doctor.users?.name || 'D').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="font-medium">Dr. {doctor.users?.name || 'Unknown'}</p>
                                                <p className="text-sm text-muted-foreground">{doctor.specializations?.name || 'General'}</p>
                                            </div>
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${doctor.is_active
                                                ? 'bg-green-50 text-green-700'
                                                : doctor.verification_status === 'pending'
                                                    ? 'bg-yellow-50 text-yellow-700'
                                                    : 'bg-gray-50 text-gray-600'
                                                }`}>
                                                {doctor.is_active ? 'Active' : doctor.verification_status === 'pending' ? 'Pending' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-2 text-sm">
                                            <span className="font-semibold">₹{doctor.consultation_fee_in_person || 0}</span>
                                            <span className="flex items-center gap-1 text-muted-foreground">
                                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                                {doctor.rating?.toFixed(1) || '0.0'}
                                            </span>
                                            <span className="text-muted-foreground">{doctor.experience_years || 0}y exp</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block rounded-xl border overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/40">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Doctor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Specialization</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Fee</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Rating</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y bg-background">
                                {doctors.map((doctor: any) => (
                                    <tr key={doctor.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {doctor.og_image_url ? (
                                                    <img
                                                        src={doctor.og_image_url}
                                                        alt=""
                                                        className="h-10 w-10 rounded-full object-cover ring-2 ring-background"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-sm">
                                                        {(doctor.users?.name || 'D').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-sm">Dr. {doctor.users?.name || 'Unknown'}</p>
                                                    <p className="text-xs text-muted-foreground">{doctor.experience_years || 0} yrs experience</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium">{doctor.specializations?.name || '—'}</p>
                                            {doctor.qualifications?.[0] && (
                                                <p className="text-xs text-muted-foreground">{doctor.qualifications[0]}</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-semibold">₹{doctor.consultation_fee_in_person || 0}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm font-medium">{doctor.rating?.toFixed(1) || '0.0'}</span>
                                                <span className="text-xs text-muted-foreground">({doctor.total_ratings || 0})</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${doctor.is_active
                                                ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                                                : doctor.verification_status === 'pending'
                                                    ? 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20'
                                                    : 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10'
                                                }`}>
                                                {doctor.is_active ? 'Active' : doctor.verification_status === 'pending' ? 'Pending' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/hospital/doctors/${doctor.id}`}
                                                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                            >
                                                View →
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
