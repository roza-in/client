'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, User, Calendar, Phone, Mail, ArrowRight } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared';
import { usePatientSearch, PatientHistoryDrawer } from '@/features/reception';
import { routes } from '@/config';

export default function ReceptionPatientsPage() {
    const { query, setQuery, patients, isLoading } = usePatientSearch('');
    const [selectedPatient, setSelectedPatient] = useState<{ id: string; name: string } | null>(null);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const handleViewHistory = (patient: any) => {
        setSelectedPatient({ id: patient.id, name: patient.name });
        setIsHistoryOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Patient Lookup</h1>
                <p className="text-muted-foreground">
                    Search for existing patients by phone or name
                </p>
            </div>

            {/* Search */}
            <div className="relative max-w-lg">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search by phone number or name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full rounded-lg border bg-background pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                />
            </div>

            {/* Results */}
            {query.length < 2 ? (
                <div className="rounded-xl border p-12 text-center">
                    <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">Search for patients</h3>
                    <p className="text-sm text-muted-foreground">
                        Enter at least 2 characters to search
                    </p>
                </div>
            ) : isLoading ? (
                <div className="flex h-48 items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : patients.length === 0 ? (
                <div className="rounded-xl border p-12 text-center">
                    <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No patients found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        No patients match "{query}"
                    </p>
                    <Link
                        href={routes.reception?.walkinBooking || '/reception/book'}
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                        Register new patient →
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {patients.map((patient: any) => (
                        <div key={patient.id} className="rounded-xl border p-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                                    {patient.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'P'}
                                </div>
                                <div>
                                    <p className="font-medium">{patient.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {patient.totalVisits} visit{patient.totalVisits !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-1 text-sm">
                                {patient.phone && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Phone className="h-4 w-4" />
                                        {patient.phone}
                                    </div>
                                )}
                                {patient.email && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Mail className="h-4 w-4" />
                                        {patient.email}
                                    </div>
                                )}
                                {patient.lastVisit && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        Last visit: {new Date(patient.lastVisit).toLocaleDateString('en-IN')}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Link
                                    href={`${routes.reception?.walkinBooking || '/reception/book'}?patientId=${patient.id}&patientName=${encodeURIComponent(patient.name)}&patientPhone=${patient.phone || ''}`}
                                    className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-center text-primary-foreground hover:bg-primary/90"
                                >
                                    Book Appointment
                                </Link>
                                <button
                                    onClick={() => handleViewHistory(patient)}
                                    className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted"
                                >
                                    View History
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Patient History Drawer */}
            <PatientHistoryDrawer
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                patient={selectedPatient}
            />
        </div>
    );
}
