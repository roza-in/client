import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Building2, Star, MapPin, Users, ChevronRight, Shield, Phone, Mail, Globe, Clock, Ambulance, Pill, Activity } from 'lucide-react';
import { fetchHospital, type PublicHospital } from '@/lib/api/public';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const hospital = await fetchHospital(slug);

    if (!hospital) {
        return {
            title: 'Hospital Not Found | ROZX Healthcare',
            description: 'The requested hospital could not be found.',
        };
    }

    return {
        title: `${hospital.name} | ${hospital.type} Hospital | ROZX Healthcare`,
        description: hospital.description || `Book appointments with top doctors at ${hospital.name}. View facilities, specializations, and ratings.`,
        openGraph: {
            title: `${hospital.name} - ${hospital.type}`,
            description: hospital.description || `${hospital.total_doctors}+ doctors available at ${hospital.name}`,
            type: 'website',
            siteName: 'ROZX Healthcare',
        },
    };
}

export default async function HospitalDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const hospital = await fetchHospital(slug);

    if (!hospital) {
        notFound();
    }

    const typeLabels: Record<string, string> = {
        clinic: 'Clinic',
        multi_specialty: 'Multi-Specialty Hospital',
        super_specialty: 'Super-Specialty Hospital',
        diagnostic_center: 'Diagnostic Center',
        hospital: 'Hospital',
    };

    const formatOperatingHours = (hours: PublicHospital['operating_hours']) => {
        if (!hours) return null;
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
        const weekdays = days.slice(0, 5);
        const weekends = days.slice(5);

        const getTimeRange = (dayHours: { is_open: boolean; open_time?: string; close_time?: string } | undefined) => {
            if (!dayHours || !dayHours.is_open) return 'Closed';
            return `${dayHours.open_time || '9:00 AM'} - ${dayHours.close_time || '6:00 PM'}`;
        };

        const weekdayHours = hours.monday ? getTimeRange(hours.monday) : '9:00 AM - 6:00 PM';
        const weekendHours = hours.saturday ? getTimeRange(hours.saturday) : 'Closed';

        return { weekdays: weekdayHours, weekends: weekendHours };
    };

    const operatingHours = formatOperatingHours(hospital.operating_hours);

    return (
        <div className="container py-8">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-primary">Home</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/hospitals" className="hover:text-primary">Hospitals</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">{hospital.name}</span>
            </nav>

            {/* Header */}
            <div className="rounded-xl border p-6 mb-6">
                <div className="flex flex-col gap-6 md:flex-row">
                    <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-primary/10 overflow-hidden">
                        {hospital.logo_url ? (
                            <img src={hospital.logo_url} alt={hospital.name} className="h-full w-full object-cover" />
                        ) : (
                            <Building2 className="h-16 w-16 text-primary" />
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl font-bold">{hospital.name}</h1>
                                    {hospital.verification_status === 'verified' && (
                                        <Shield className="h-5 w-5 text-green-500" />
                                    )}
                                </div>
                                <p className="text-primary font-medium">{typeLabels[hospital.type] || hospital.type}</p>
                                {hospital.tagline && (
                                    <p className="text-sm text-muted-foreground mt-1">{hospital.tagline}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                <span className="font-bold">{hospital.rating?.toFixed(1) || 'N/A'}</span>
                                <span className="text-sm text-muted-foreground">({hospital.total_ratings || 0} reviews)</span>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>
                                {[hospital.address, hospital.landmark, hospital.city, hospital.state, hospital.pincode]
                                    .filter(Boolean)
                                    .join(', ') || 'Address not specified'}
                            </span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-primary" />
                                <span>{hospital.total_doctors || 0} Doctors</span>
                            </div>
                            {hospital.total_beds && (
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-primary" />
                                    <span>{hospital.total_beds} Beds</span>
                                </div>
                            )}
                            {hospital.emergency_24x7 && (
                                <div className="flex items-center gap-2 text-red-600">
                                    <Ambulance className="h-4 w-4" />
                                    <span>24/7 Emergency</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    {/* About */}
                    {hospital.description && (
                        <div className="rounded-xl border p-6">
                            <h2 className="font-semibold mb-4">About</h2>
                            <p className="text-muted-foreground">{hospital.description}</p>
                        </div>
                    )}

                    {/* Specializations */}
                    {hospital.specializations && hospital.specializations.length > 0 && (
                        <div className="rounded-xl border p-6">
                            <h2 className="font-semibold mb-4">Specializations</h2>
                            <div className="flex flex-wrap gap-2">
                                {hospital.specializations.map((spec) => (
                                    <span key={spec} className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                                        {spec}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Top Doctors - Link to doctors page */}
                    <div className="rounded-xl border p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold">Our Doctors</h2>
                            <Link
                                href={`/hospitals/${slug}/doctors`}
                                className="text-sm text-primary hover:underline flex items-center gap-1"
                            >
                                View all <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="text-center py-8 text-muted-foreground">
                            <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                            <p>{hospital.total_doctors || 0}+ doctors available</p>
                            <Link
                                href={`/hospitals/${slug}/doctors`}
                                className="mt-4 inline-block px-6 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90"
                            >
                                Browse Doctors
                            </Link>
                        </div>
                    </div>

                    {/* Facilities */}
                    {hospital.facilities && hospital.facilities.length > 0 && (
                        <div className="rounded-xl border p-6">
                            <h2 className="font-semibold mb-4">Facilities</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {hospital.facilities.map((facility) => (
                                    <div key={facility} className="flex items-center gap-2 text-sm">
                                        <span className="h-2 w-2 rounded-full bg-green-500" />
                                        {facility}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Services */}
                    <div className="rounded-xl border p-6">
                        <h2 className="font-semibold mb-4">Services</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {hospital.emergency_24x7 && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Ambulance className="h-4 w-4 text-red-500" />
                                    <span>24/7 Emergency</span>
                                </div>
                            )}
                            {hospital.pharmacy_24x7 && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Pill className="h-4 w-4 text-green-500" />
                                    <span>24/7 Pharmacy</span>
                                </div>
                            )}
                            {hospital.ambulance_service && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Activity className="h-4 w-4 text-blue-500" />
                                    <span>Ambulance Service</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Timings */}
                    {operatingHours && (
                        <div className="rounded-xl border p-6">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                Timings
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Mon - Fri</span>
                                    <span>{operatingHours.weekdays}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Sat - Sun</span>
                                    <span>{operatingHours.weekends}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contact */}
                    <div className="rounded-xl border p-6">
                        <h3 className="font-semibold mb-4">Contact</h3>
                        <div className="space-y-3 text-sm">
                            {hospital.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <a href={`tel:${hospital.phone}`} className="hover:text-primary">{hospital.phone}</a>
                                </div>
                            )}
                            {hospital.email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <a href={`mailto:${hospital.email}`} className="hover:text-primary truncate">{hospital.email}</a>
                                </div>
                            )}
                            {hospital.website_url && (
                                <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                    <a href={hospital.website_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary truncate">
                                        {hospital.website_url.replace(/^https?:\/\//, '')}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="rounded-xl bg-linear-to-br from-teal-500 to-teal-600 p-6 text-white">
                        <h3 className="font-semibold">Book Appointment</h3>
                        <p className="mt-2 text-sm text-white/80">
                            Choose from {hospital.total_doctors || 0}+ verified doctors
                        </p>
                        <Link
                            href={`/hospitals/${slug}/doctors`}
                            className="mt-4 block w-full rounded-lg bg-white py-2 text-center text-sm font-medium text-teal-600 hover:bg-white/90"
                        >
                            Find Doctors
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
