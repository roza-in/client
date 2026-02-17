'use client';

import { useState } from 'react';
import { Package, Search, Pill } from 'lucide-react';
import { LoadingSpinner, EmptyState, Pagination } from '@/components/shared';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useMedicineSearch } from '@/features/pharmacy';
import type { MedicineSearchFilters } from '@/types';

const CATEGORIES = [
    { value: 'all', label: 'All Categories' },
    { value: 'tablet', label: 'Tablets' },
    { value: 'capsule', label: 'Capsules' },
    { value: 'syrup', label: 'Syrups' },
    { value: 'injection', label: 'Injections' },
    { value: 'cream', label: 'Creams' },
    { value: 'drops', label: 'Drops' },
    { value: 'inhaler', label: 'Inhalers' },
    { value: 'other', label: 'Other' },
];

export default function PharmacyInventoryPage() {
    const [filters, setFilters] = useState<MedicineSearchFilters>({
        page: 1,
        limit: 20,
    });
    const [searchTerm, setSearchTerm] = useState('');

    const { data, isLoading } = useMedicineSearch({
        ...filters,
        search: searchTerm || undefined,
    });

    const medicines = data?.medicines ?? [];
    const pagination = data?.pagination;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Medicine Inventory</h1>
                <p className="text-muted-foreground">Search and manage medicine stock</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search medicines by name, brand, or generic name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select
                    value={(filters.category as string) ?? 'all'}
                    onValueChange={(value: string) =>
                        setFilters((prev) => ({
                            ...prev,
                            category: value === 'all' ? undefined : (value as MedicineSearchFilters['category']),
                            page: 1,
                        }))
                    }
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        {CATEGORIES.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                                {c.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Results */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner />
                </div>
            ) : medicines.length === 0 ? (
                <EmptyState
                    title="No medicines found"
                    description="Try adjusting your search or filters."
                    icon={Pill}
                />
            ) : (
                <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {medicines.map((med) => (
                            <div
                                key={med.id}
                                className="rounded-xl border p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Pill className="h-5 w-5" />
                                    </div>
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs ${
                                            med.isInStock
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        }`}
                                    >
                                        {med.isInStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>
                                <h3 className="font-medium truncate">{med.name}</h3>
                                {med.genericName && (
                                    <p className="text-sm text-muted-foreground truncate">{med.genericName}</p>
                                )}
                                {med.brand && (
                                    <p className="text-xs text-muted-foreground">{med.brand}</p>
                                )}
                                <div className="mt-3 flex items-baseline gap-2">
                                    <span className="text-lg font-bold">₹{med.sellingPrice}</span>
                                    {med.discountPercent > 0 && (
                                        <>
                                            <span className="text-sm text-muted-foreground line-through">
                                                ₹{med.mrp}
                                            </span>
                                            <span className="text-xs text-green-600 font-medium">
                                                {med.discountPercent}% off
                                            </span>
                                        </>
                                    )}
                                </div>
                                <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                                    <span className="capitalize">{med.category}</span>
                                    {med.isPrescriptionRequired && (
                                        <span className="text-orange-600">Rx Required</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {pagination && pagination.totalPages > 1 && (
                        <Pagination
                            currentPage={filters.page ?? 1}
                            totalPages={pagination.totalPages}
                            onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
                        />
                    )}
                </>
            )}
        </div>
    );
}
