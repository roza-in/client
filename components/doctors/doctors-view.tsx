'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { DoctorList, DoctorFilters } from '@/components/doctors';
import { SearchInput } from '@/components/shared';
import type { Specialization, DoctorListItem } from '@/types';

interface DoctorsViewProps {
    specializations: Specialization[];
    initialDoctors: DoctorListItem[];
    initialFilters: {
        specialty?: string;
        gender?: string;
        type?: string;
        experience?: number;
        maxFee?: number;
        sortBy?: string;
        availableToday?: boolean;
        search?: string;
    };
    totalPages?: number;
    currentPage?: number;
    totalDoctors?: number;
}

export function DoctorsView({
    specializations,
    initialDoctors,
    initialFilters,
    totalPages = 1,
    currentPage = 1,
    totalDoctors = 0,
}: DoctorsViewProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [doctors, setDoctors] = useState(initialDoctors);
    const [filters, setFilters] = useState(initialFilters);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set('search', value);
        } else {
            params.delete('search');
        }
        params.delete('page');
        router.push(`/doctors?${params.toString()}`);
    };

    const handleFilterChange = (newFilters: any) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);

        const params = new URLSearchParams(searchParams.toString());

        // Map internal state keys to URL params
        if (newFilters.search !== undefined) {
            if (newFilters.search) params.set('search', newFilters.search);
            else params.delete('search');
        }

        // Handle direct filter updates
        Object.entries(newFilters).forEach(([key, value]) => {
            if (key === 'search') return; // Handled above
            if (value !== undefined && value !== '' && value !== false) {
                params.set(key, String(value));
            } else {
                params.delete(key);
            }
        });

        params.delete('page');
        router.push(`/doctors?${params.toString()}`);
    };

    const handleClear = () => {
        setFilters({});
        router.push('/doctors');
    };

    return (
        <div className="grid gap-6 lg:grid-cols-4">
            {/* Filters */}
            <aside className="lg:col-span-1">
                <DoctorFilters
                    specializations={specializations}
                    selectedSpecialization={filters.specialty}
                    selectedGender={filters.gender}
                    selectedConsultationType={filters.type as any}
                    selectedExperience={filters.experience}
                    maxFee={filters.maxFee}
                    sortBy={filters.sortBy}
                    availableToday={filters.availableToday}
                    searchTerm={filters.search}
                    onFilterChange={handleFilterChange}
                    onClear={handleClear}
                />
            </aside>

            {/* List */}
            <div className="lg:col-span-3">
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {totalDoctors} verified doctors available
                    </p>
                </div>

                {doctors.length > 0 ? (
                    <DoctorList doctors={doctors} />
                ) : (
                    <div className="text-center py-16 border rounded-xl bg-card">
                        <p className="text-muted-foreground mb-2">
                            No doctors match your criteria.
                        </p>
                        <button
                            onClick={handleClear}
                            className="text-primary hover:underline text-sm"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = i + 1;
                            const params = new URLSearchParams(searchParams.toString());
                            params.set('page', String(page));

                            return (
                                <Link
                                    key={page}
                                    href={`/doctors?${params.toString()}`}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                        ? 'bg-primary text-primary-foreground'
                                        : 'border hover:bg-muted'
                                        }`}
                                >
                                    {page}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
