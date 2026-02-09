'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { SearchInput, Pagination, LoadingSpinner } from '@/components/shared';
import { Users, ChevronRight, Phone, Mail, Calendar, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { useAuthStore } from '@/store/slices/auth.slice';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface Patient {
    id: string;
    name: string;
    email: string;
    phone: string;
    gender: string;
    date_of_birth: string;
    avatar_url?: string;
    appointment_count?: number;
    last_visit?: string;
}

interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function HospitalPatientsPage() {
    const { user } = useAuthStore();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 10, total: 0, totalPages: 1 });
    const [searchQuery, setSearchQuery] = useState('');

    const hospitalId = user?.hospital?.id;

    const fetchPatients = useCallback(async () => {
        if (!hospitalId) return;

        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', pagination.page.toString());
            params.append('limit', pagination.limit.toString());
            if (searchQuery) params.append('search', searchQuery);

            // Using the appointments endpoint to get unique patients from hospital
            const response = await api.get<{ data: any[], pagination: PaginationInfo }>(
                `${endpoints.hospitals.appointments(hospitalId)}?${params.toString()}`
            );

            // Extract unique patients from appointments
            const appointmentsData = Array.isArray(response) ? response : response?.data || [];
            const uniquePatients = new Map<string, Patient>();

            appointmentsData.forEach((apt: any) => {
                if (apt.patient && !uniquePatients.has(apt.patient.id)) {
                    uniquePatients.set(apt.patient.id, {
                        id: apt.patient.id,
                        name: apt.patient.name || 'Unknown',
                        email: apt.patient.email || '',
                        phone: apt.patient.phone || '',
                        gender: apt.patient.gender || '',
                        date_of_birth: apt.patient.date_of_birth || '',
                        avatar_url: apt.patient.avatar_url,
                        last_visit: apt.scheduled_date,
                    });
                }
            });

            setPatients(Array.from(uniquePatients.values()));
            if (response?.pagination) {
                setPagination(response.pagination);
            }
        } catch (error) {
            console.error('Failed to fetch patients:', error);
            toast.error('Failed to load patients');
        } finally {
            setLoading(false);
        }
    }, [hospitalId, pagination.page, pagination.limit, searchQuery]);

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setPagination(prev => ({ ...prev, page }));
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const calculateAge = (dob: string) => {
        if (!dob) return 'N/A';
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return `${age} yrs`;
    };

    if (!hospitalId) {
        return (
            <div className="p-6">
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
                    <h2 className="text-lg font-semibold">Access Error</h2>
                    <p>Could not load hospital information. Please try logging in again.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Patients</h1>
                    <p className="text-muted-foreground">All patients who visited the hospital</p>
                </div>
                <button
                    onClick={() => fetchPatients()}
                    className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted transition-colors"
                >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </button>
            </div>

            <SearchInput
                placeholder="Search patients by name..."
                onSearch={handleSearch}
                className="mb-6 max-w-md"
            />

            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : patients.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No patients found</h3>
                        <p className="text-muted-foreground">
                            {searchQuery ? 'Try adjusting your search' : 'No patients have visited yet'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="rounded-xl border overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-muted/40">
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Patient Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Visit</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y bg-background">
                            {patients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                                                {patient.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'P'}
                                            </div>
                                            <p className="font-medium text-sm">{patient.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            {patient.phone && (
                                                <div className="flex items-center gap-1.5 text-sm">
                                                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                                    <span>{patient.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            {patient.date_of_birth && (
                                                <span className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium">
                                                    {calculateAge(patient.date_of_birth)}
                                                </span>
                                            )}
                                            {patient.gender && (
                                                <span className="capitalize">{patient.gender}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {patient.last_visit ? (
                                            <div className="flex items-center gap-1.5 text-sm">
                                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                                <span>{formatDate(patient.last_visit)}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/hospital/patients/${patient.id}`}
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
            )}

            {pagination.totalPages > 1 && (
                <div className="mt-6">
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </>
    );
}
