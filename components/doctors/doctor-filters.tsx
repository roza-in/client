'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X, ChevronDown, Filter, SlidersHorizontal, Search, ArrowUpDown } from 'lucide-react';
import type { Specialization } from '@/types';
import { SearchInput } from '@/components/shared/search-input';

interface DoctorFiltersProps {
    specializations: Specialization[];
    selectedSpecialization?: string;
    selectedGender?: string;
    selectedConsultationType?: 'in_person' | 'video' | 'audio';
    selectedExperience?: number;
    maxFee?: number;
    sortBy?: string;
    availableToday?: boolean;
    searchTerm?: string;
    onFilterChange: (filters: Record<string, unknown>) => void;
    onClear: () => void;
    className?: string;
}

export function DoctorFilters({
    specializations,
    selectedSpecialization,
    selectedGender,
    selectedConsultationType,
    selectedExperience,
    maxFee,
    sortBy,
    availableToday,
    searchTerm,
    onFilterChange,
    onClear,
    className,
}: DoctorFiltersProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Sort options
    const sortOptions = [
        { value: 'rating', label: 'Rating: High to Low' },
        { value: 'experience', label: 'Experience: High to Low' },
        { value: 'price_asc', label: 'Fee: Low to High' },
        { value: 'price_desc', label: 'Fee: High to Low' },
    ];

    const hasActiveFilters =
        selectedSpecialization ||
        selectedGender ||
        selectedConsultationType ||
        selectedExperience ||
        (maxFee && maxFee < 5000) ||
        availableToday ||
        searchTerm ||
        (sortBy && sortBy !== 'rating');

    const experienceOptions = [
        { value: 0, label: 'Any' },
        { value: 5, label: '5+ years' },
        { value: 10, label: '10+ years' },
        { value: 15, label: '15+ years' },
        { value: 20, label: '20+ years' },
    ];

    const genderOptions = [
        { value: '', label: 'Any' },
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
    ];

    const consultationOptions = [
        { value: '', label: 'All' },
        { value: 'in_person', label: 'In-Person' },
        { value: 'online', label: 'Video Consult' },
    ];

    return (
        <div className={cn('rounded-lg border bg-background p-4 space-y-4', className)}>
            {/* Search & Sort Header - Visible mainly on mobile/tablet or top of desktop */}
            <div className="flex flex-col gap-4">
                <SearchInput
                    placeholder="Search doctor or specialty..."
                    // defaultValue={searchTerm}
                    onSearch={(value) => onFilterChange({ search: value })}
                    className="w-full"
                />
            </div>

            <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="font-medium">Filters & Sort</span>
                    {hasActiveFilters && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            !
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                        <button
                            onClick={onClear}
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            Clear all
                        </button>
                    )}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="md:hidden"
                    >
                        <ChevronDown
                            className={cn('h-5 w-5 transition-transform', isExpanded && 'rotate-180')}
                        />
                    </button>
                </div>
            </div>

            {/* Filter Content */}
            <div className={cn('space-y-6 pt-2', !isExpanded && 'hidden md:block')}>

                {/* Sort By */}
                <div>
                    <label className="text-sm font-medium mb-2 flex items-center gap-2">
                        <ArrowUpDown className="h-3.5 w-3.5" />
                        Sort By
                    </label>
                    <select
                        value={sortBy || 'rating'}
                        onChange={(e) => onFilterChange({ sortBy: e.target.value })}
                        className="w-full rounded-md border bg-background p-2 text-sm focus:ring-2 focus:ring-primary/20"
                    >
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="h-px bg-border" />

                {/* Availability */}
                <div>
                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm font-medium">Available Today</span>
                        <div className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={availableToday || false}
                                onChange={(e) => onFilterChange({ availableToday: e.target.checked })}
                            />
                            <div className="w-9 h-5 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                        </div>
                    </label>
                </div>

                <div className="h-px bg-border" />

                {/* Specialization */}
                <div>
                    <label className="block text-sm font-medium mb-2">Specialization</label>
                    <select
                        value={selectedSpecialization || ''}
                        onChange={(e) => onFilterChange({ specialization: e.target.value || undefined })}
                        className="w-full rounded-md border bg-background p-2 text-sm"
                    >
                        <option value="">All Specializations</option>
                        {specializations.map((spec) => (
                            <option key={spec.id} value={spec.slug || spec.id}>
                                {spec.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Consultation Type */}
                <div>
                    <label className="block text-sm font-medium mb-2">Consultation Type</label>
                    <div className="flex flex-wrap gap-2">
                        {consultationOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() =>
                                    onFilterChange({
                                        consultationType: option.value || undefined,
                                    })
                                }
                                className={cn(
                                    'rounded-full px-3 py-1.5 text-xs font-medium border transition-colors',
                                    selectedConsultationType === option.value ||
                                        (!selectedConsultationType && option.value === '')
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'hover:bg-muted bg-background'
                                )}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Experience */}
                <div>
                    <label className="block text-sm font-medium mb-2">Experience</label>
                    <select
                        value={selectedExperience || 0}
                        onChange={(e) =>
                            onFilterChange({ minExperience: Number(e.target.value) || undefined })
                        }
                        className="w-full rounded-md border bg-background p-2 text-sm"
                    >
                        {experienceOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Gender */}
                <div>
                    <label className="block text-sm font-medium mb-2">Gender</label>
                    <div className="flex gap-2">
                        {genderOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() =>
                                    onFilterChange({
                                        gender: option.value || undefined,
                                    })
                                }
                                className={cn(
                                    'flex-1 rounded-md px-3 py-2 text-xs border transition-colors',
                                    selectedGender === option.value ||
                                        (!selectedGender && option.value === '')
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'hover:bg-muted bg-background'
                                )}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Max Fee */}
                <div>
                    <label className="text-sm font-medium mb-2 flex justify-between">
                        <span>Max Fee</span>
                        <span className="text-muted-foreground">₹{maxFee || 5000}</span>
                    </label>
                    <input
                        type="range"
                        min={100}
                        max={5000}
                        step={100}
                        value={maxFee || 5000}
                        onChange={(e) => onFilterChange({ maxFee: Number(e.target.value) })}
                        className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                        <span>₹100</span>
                        <span>₹5000</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorFilters;

