import { Metadata } from 'next';
import Link from 'next/link';
import { fetchHospitals, type PublicHospital } from '@/lib/api/public';
import { MapPin, Building2, Star, Users, BadgeCheck, ChevronRight } from 'lucide-react';

// =============================================================================
// Dynamic Metadata for SEO
// =============================================================================

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const params = await searchParams;
    const city = params.city as string | undefined;
    const type = params.type as string | undefined;

    let title = 'Find Hospitals | Top Healthcare Centers | ROZX Healthcare';
    let description = 'Discover top hospitals and healthcare centers near you. Book appointments with verified hospitals. Multi-specialty & super-specialty facilities.';

    if (city) {
        const formattedCity = city.replace(/\b\w/g, l => l.toUpperCase());
        title = `Best Hospitals in ${formattedCity} | ROZX Healthcare`;
        description = `Find the best hospitals in ${formattedCity}. Book appointments with verified healthcare centers. View ratings, doctors, and facilities.`;
    }

    if (type) {
        const formattedType = type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        title = city
            ? `${formattedType} Hospitals in ${city.replace(/\b\w/g, l => l.toUpperCase())} | ROZX`
            : `${formattedType} Hospitals | ROZX Healthcare`;
    }

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            siteName: 'ROZX Healthcare',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    };
}

// =============================================================================
// Page Component
// =============================================================================

export default async function HospitalsPage({ searchParams }: PageProps) {
    const params = await searchParams;

    // Build filters from search params
    const filters = {
        page: params.page ? Number(params.page) : 1,
        limit: 12,
        type: params.type as string | undefined,
        city: params.city as string | undefined,
        search: params.search as string | undefined,
        sort_by: (params.sort as 'rating' | 'name' | 'doctors') || 'rating',
    };

    // Fetch hospitals from API (server-side)
    const hospitalsResponse = await fetchHospitals(filters);

    return (
        <div className="container py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Find Hospitals</h1>
                <p className="mt-2 text-muted-foreground">
                    Discover top hospitals and healthcare centers for quality medical care
                </p>
            </div>

            {/* Search & Filters */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
                <input
                    type="search"
                    name="search"
                    placeholder="Search hospitals by name or specialty..."
                    defaultValue={filters.search}
                    className="flex-1 max-w-xl rounded-md border bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <div className="flex gap-2">
                    <select className="rounded-md border bg-background px-3 py-2 text-sm">
                        <option value="">All Cities</option>
                        <option value="hyderabad">Hyderabad</option>
                        <option value="bangalore">Bangalore</option>
                        <option value="delhi">New Delhi</option>
                        <option value="mumbai">Mumbai</option>
                    </select>
                    <select className="rounded-md border bg-background px-3 py-2 text-sm">
                        <option value="">All Types</option>
                        <option value="multi_specialty">Multi-Specialty</option>
                        <option value="super_specialty">Super-Specialty</option>
                        <option value="clinic">Clinic</option>
                    </select>
                </div>
            </div>

            {/* Results Count */}
            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {hospitalsResponse.meta.total} hospitals found
                </p>
                <select className="rounded-md border bg-background px-3 py-1.5 text-sm">
                    <option value="rating">Rating: High to Low</option>
                    <option value="doctors">Most Doctors</option>
                    <option value="name">Name: A-Z</option>
                </select>
            </div>

            {/* Hospital Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {hospitalsResponse.data.length > 0 ? (
                    hospitalsResponse.data.map((hospital) => (
                        <HospitalCard key={hospital.id} hospital={hospital} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-16">
                        <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-semibold">No hospitals found</h3>
                        <p className="mt-2 text-muted-foreground">
                            Try adjusting your search filters or check back later.
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {hospitalsResponse.meta.totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                    {Array.from({ length: Math.min(5, hospitalsResponse.meta.totalPages) }, (_, i) => (
                        <Link
                            key={i + 1}
                            href={`/hospitals?page=${i + 1}`}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${hospitalsResponse.meta.page === i + 1
                                ? 'bg-primary text-white'
                                : 'border hover:bg-muted'
                                }`}
                        >
                            {i + 1}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

// =============================================================================
// Hospital Card Component
// =============================================================================

function HospitalCard({ hospital }: { hospital: PublicHospital }) {
    const typeLabels: Record<string, string> = {
        clinic: 'Clinic',
        multi_specialty: 'Multi-Specialty',
        super_specialty: 'Super-Specialty',
        diagnostic_center: 'Diagnostic Center',
        hospital: 'Hospital',
    };

    return (
        <Link
            href={`/hospitals/${hospital.id}`}
            className="group relative flex flex-col rounded-[24px] border border-slate-100 bg-white overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:border-primary/20 hover:-translate-y-1 transition-all duration-500"
        >
            {/* Banner */}
            <div className="relative h-32 bg-linear-to-br from-primary/10 to-primary/5">
                {hospital.banner_url ? (
                    <img
                        src={hospital.banner_url}
                        alt={hospital.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center">
                        <Building2 className="h-12 w-12 text-primary/30" />
                    </div>
                )}

                {/* Type Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    {typeLabels[hospital.type] || hospital.type}
                </div>

                {/* Verified Badge */}
                {hospital.verification_status === 'verified' && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-primary text-white">
                        <BadgeCheck className="h-3 w-3" />
                        <span className="text-[9px] font-bold uppercase tracking-wider">Verified</span>
                    </div>
                )}
            </div>

            {/* Logo */}
            <div className="absolute top-24 left-5 h-16 w-16 rounded-2xl bg-white border-4 border-white shadow-lg overflow-hidden">
                {hospital.logo_url ? (
                    <img
                        src={hospital.logo_url}
                        alt={hospital.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center bg-primary/10">
                        <Building2 className="h-6 w-6 text-primary/50" />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 pt-10">
                <h3 className="font-black text-lg text-slate-900 group-hover:text-primary transition-colors truncate">
                    {hospital.name}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-1 mt-1 text-slate-400">
                    <MapPin className="h-3.5 w-3.5" />
                    <p className="text-xs font-medium truncate">
                        {[hospital.city, hospital.state].filter(Boolean).join(', ') || 'Location not specified'}
                    </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-black text-slate-700">
                            {hospital.rating?.toFixed(1) || '4.5'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                            ({hospital.total_ratings || 0})
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-xs font-bold text-slate-600">
                            {hospital.total_doctors || 0} Doctors
                        </span>
                    </div>
                </div>

                {/* View Button */}
                <div className="flex items-center justify-between mt-4">
                    <div className="flex gap-1 flex-wrap">
                        {hospital.facilities?.slice(0, 2).map((facility) => (
                            <span
                                key={facility}
                                className="px-2 py-0.5 rounded-full bg-slate-100 text-[9px] font-medium text-slate-500 uppercase tracking-wider"
                            >
                                {facility}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center gap-1 text-primary text-xs font-bold group-hover:gap-2 transition-all">
                        View
                        <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
