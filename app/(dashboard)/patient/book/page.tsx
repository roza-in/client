'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Star, Video, Building2, Clock, ChevronLeft, ChevronRight, UserRound, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/shared';
import { fetchDoctors, fetchSpecializations, type PublicDoctor, type DoctorFilters, type Specialization } from '@/lib/api/public';

export default function BookAppointmentPage() {
    const searchParams = useSearchParams();

    const [doctors, setDoctors] = useState<PublicDoctor[]>([]);
    const [specializations, setSpecializations] = useState<Specialization[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [selectedSpecialization, setSelectedSpecialization] = useState(searchParams.get('specialization') || '');
    const [consultationType, setConsultationType] = useState<'online' | 'in_person' | ''>('');
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch specializations on mount
    useEffect(() => {
        async function loadSpecializations() {
            try {
                const specs = await fetchSpecializations();
                setSpecializations(specs);
            } catch (err) {
                console.error('Failed to fetch specializations:', err);
            }
        }
        loadSpecializations();
    }, []);

    // Fetch doctors when filters change
    useEffect(() => {
        async function loadDoctors() {
            setLoading(true);
            setError(null);

            try {
                const filters: DoctorFilters = {
                    page: currentPage,
                    limit: 9,
                    search: searchQuery || undefined,
                    specialization: selectedSpecialization || undefined,
                    consultation_type: consultationType || undefined,
                    sort_by: 'rating',
                };

                const response = await fetchDoctors(filters);
                setDoctors(response.data || []);
                setTotalPages(response.meta?.totalPages || 1);
            } catch (err) {
                console.error('Failed to fetch doctors:', err);
                setError('Failed to load doctors. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        loadDoctors();
    }, [currentPage, searchQuery, selectedSpecialization, consultationType]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedSpecialization('');
        setConsultationType('');
        setCurrentPage(1);
    };

    const hasActiveFilters = searchQuery || selectedSpecialization || consultationType;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Find a Doctor</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Browse our network of verified healthcare professionals
                </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search by doctor name or specialization..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
            </form>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Consultation Type Toggle */}
                <div className="flex items-center bg-muted rounded-lg p-1">
                    <button
                        onClick={() => { setConsultationType(''); setCurrentPage(1); }}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                            consultationType === '' ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        All
                    </button>
                    <button
                        onClick={() => { setConsultationType('in_person'); setCurrentPage(1); }}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5",
                            consultationType === 'in_person' ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Building2 className="h-3.5 w-3.5" />
                        In-Clinic
                    </button>
                    <button
                        onClick={() => { setConsultationType('online'); setCurrentPage(1); }}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5",
                            consultationType === 'online' ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Video className="h-3.5 w-3.5" />
                        Video
                    </button>
                </div>

                {/* Specialization Select */}
                <select
                    value={selectedSpecialization}
                    onChange={(e) => { setSelectedSpecialization(e.target.value); setCurrentPage(1); }}
                    className="h-9 px-3 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                    <option value="">All Specializations</option>
                    {specializations.map((spec) => (
                        <option key={spec.id} value={spec.slug || spec.name}>
                            {spec.name}
                        </option>
                    ))}
                </select>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="h-9 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                        Clear all
                    </button>
                )}

                {/* Results Count */}
                {!loading && (
                    <span className="text-sm text-muted-foreground ml-auto">
                        {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} found
                    </span>
                )}
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <LoadingSpinner size="lg" />
                    <p className="text-sm text-muted-foreground mt-3">Finding doctors...</p>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <p className="text-destructive mb-3">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-sm text-primary hover:underline"
                    >
                        Try again
                    </button>
                </div>
            ) : doctors.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <UserRound className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-1">No doctors found</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-sm">
                        Try adjusting your search or filters to find more doctors
                    </p>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="mt-4 text-sm text-primary hover:underline"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            ) : (
                <>
                    {/* Doctor List */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {doctors.map((doctor) => (
                            <DoctorCard key={doctor.id} doctor={doctor} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-4">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="h-9 w-9 rounded-lg border flex items-center justify-center hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const page = i + 1;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={cn(
                                                "h-9 w-9 rounded-lg text-sm font-medium transition-colors",
                                                currentPage === page
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-muted"
                                            )}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="h-9 w-9 rounded-lg border flex items-center justify-center hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

// Doctor Card Component
function DoctorCard({ doctor }: { doctor: PublicDoctor }) {
    const specialization = typeof doctor.specialization === 'object'
        ? doctor.specialization?.name
        : doctor.specialization || 'General Physician';

    const fee = doctor.consultation_fee_in_person || doctor.consultation_fee_online || 500;
    const hasOnline = doctor.consultation_types?.includes('online');
    const hasInPerson = doctor.consultation_types?.includes('in_person');

    return (
        <Link
            href={`/patient/book/${doctor.id}`}
            className="group relative bg-card rounded-xl border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-200"
        >
            {/* Top Section - Doctor Info */}
            <div className="p-4">
                <div className="flex gap-3">
                    {/* Avatar */}
                    {doctor.avatar_url ? (
                        <img
                            src={doctor.avatar_url}
                            alt={doctor.name}
                            className="h-14 w-14 rounded-xl object-cover"
                        />
                    ) : (
                        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xl font-bold text-primary">
                            {doctor.name?.charAt(0) || 'D'}
                        </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                            Dr. {doctor.name}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                            {specialization}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                                <Star className="h-3 w-3 fill-current" />
                                {doctor.rating?.toFixed(1) || '4.5'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                • {doctor.experience_years || 5}+ yrs
                            </span>
                        </div>
                    </div>
                </div>

                {/* Hospital */}
                {doctor.hospital?.name && (
                    <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        <span className="truncate">{doctor.hospital.name}</span>
                    </div>
                )}
            </div>

            {/* Bottom Section - Fee & CTA */}
            <div className="px-4 py-3 bg-muted/30 border-t flex items-center justify-between">
                <div>
                    <p className="text-xs text-muted-foreground">Consultation</p>
                    <p className="text-lg font-semibold text-primary">₹{fee}</p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Availability Badges */}
                    <div className="flex gap-1">
                        {hasInPerson && (
                            <span className="h-7 w-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center" title="In-clinic available">
                                <Building2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                            </span>
                        )}
                        {hasOnline && (
                            <span className="h-7 w-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center" title="Video consultation available">
                                <Video className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            </span>
                        )}
                    </div>
                    {/* Book Button */}
                    <span className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium group-hover:bg-primary/90 transition-colors">
                        Book
                    </span>
                </div>
            </div>
        </Link>
    );
}
