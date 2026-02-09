'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { SearchInput, Pagination, LoadingSpinner } from '@/components/shared';
import { Calendar, ChevronRight, Video, Users, Filter, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { useAuthStore } from '@/store/slices/auth.slice';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface Appointment {
    id: string;
    appointment_number: string;
    scheduled_date: string;
    scheduled_start: string;
    scheduled_end: string;
    status: string;
    consultation_type: string;
    consultation_fee: number;
    total_amount: number;
    patient: {
        id: string;
        name: string;
        phone: string;
        avatar_url?: string;
    };
    doctor: {
        id: string;
        users: {
            name: string;
            avatar_url?: string;
        };
        qualifications?: string[];
    };
}

interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function HospitalAppointmentsPage() {
    const { user } = useAuthStore();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 10, total: 0, totalPages: 1 });
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');

    const hospitalId = user?.hospital?.id;

    const fetchAppointments = useCallback(async () => {
        if (!hospitalId) return;

        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', pagination.page.toString());
            params.append('limit', pagination.limit.toString());

            if (searchQuery) params.append('search', searchQuery);
            if (statusFilter !== 'all') params.append('status', statusFilter);
            if (dateFilter === 'today') {
                params.append('date', new Date().toISOString().split('T')[0]);
            } else if (dateFilter === 'week') {
                const today = new Date();
                const weekEnd = new Date(today);
                weekEnd.setDate(today.getDate() + 7);
                params.append('startDate', today.toISOString().split('T')[0]);
                params.append('endDate', weekEnd.toISOString().split('T')[0]);
            }

            const response = await api.get<{ data: Appointment[], pagination: PaginationInfo }>(
                `${endpoints.hospitals.appointments(hospitalId)}?${params.toString()}`
            );

            // Handle response structure
            if (Array.isArray(response)) {
                setAppointments(response);
            } else if (response?.data) {
                setAppointments(response.data);
                if (response.pagination) {
                    setPagination(response.pagination);
                }
            } else {
                setAppointments([]);
            }
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
            toast.error('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    }, [hospitalId, pagination.page, pagination.limit, searchQuery, statusFilter, dateFilter]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setPagination(prev => ({ ...prev, page }));
    };

    // Format date/time
    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Get status styles
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-blue-100 text-blue-700';
            case 'checked_in': return 'bg-green-100 text-green-700';
            case 'in_progress': return 'bg-purple-100 text-purple-700';
            case 'completed': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            case 'pending_payment': return 'bg-yellow-100 text-yellow-700';
            case 'scheduled': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
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
                    <h1 className="text-2xl font-bold">Appointments</h1>
                    <p className="text-muted-foreground">View and manage all hospital appointments</p>
                </div>
                <button
                    onClick={() => fetchAppointments()}
                    className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted transition-colors"
                >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <SearchInput
                    placeholder="Search by patient or doctor..."
                    onSearch={handleSearch}
                    className="flex-1 min-w-[250px] max-w-md"
                />
                <select
                    value={dateFilter}
                    onChange={(e) => {
                        setDateFilter(e.target.value);
                        setPagination(prev => ({ ...prev, page: 1 }));
                    }}
                    className="rounded-lg border bg-background px-3 py-2 text-sm"
                >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPagination(prev => ({ ...prev, page: 1 }));
                    }}
                    className="rounded-lg border bg-background px-3 py-2 text-sm"
                >
                    <option value="all">All Status</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending_payment">Pending Payment</option>
                    <option value="checked_in">Checked In</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Appointments List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : appointments.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No appointments found</h3>
                        <p className="text-muted-foreground">
                            {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                                ? 'Try adjusting your filters'
                                : 'No appointments have been booked yet'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="rounded-xl border overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-muted/40">
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Doctor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date & Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y bg-background">
                            {appointments.map((apt) => (
                                <tr key={apt.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                                                {apt.patient?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'P'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{apt.patient?.name || 'Unknown'}</p>
                                                <p className="text-xs text-muted-foreground">#{apt.appointment_number}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium">Dr. {apt.doctor?.users?.name || 'Unknown'}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{formatDate(apt.scheduled_date)}</span>
                                            <span className="text-xs text-muted-foreground">{formatTime(apt.scheduled_start)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {apt.consultation_type === 'online' ? (
                                                <Video className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            <span className="text-sm capitalize">{apt.consultation_type?.replace('_', ' ')}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="secondary" className={getStatusStyle(apt.status)}>
                                            {apt.status?.replace(/_/g, ' ')}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/hospital/appointments/${apt.id}`}
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

            {/* Pagination */}
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
