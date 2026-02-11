import Link from 'next/link';
import { Metadata } from 'next';
import {
    Stethoscope, Video, Shield, Clock, ChevronRight,
    Calendar, BadgeCheck, Star, MapPin, Building2,
    Activity, Baby, Bone, Brain, Heart, Eye,
    Users, Briefcase, Zap, Pill
} from 'lucide-react';
import { fetchFeaturedDoctors, fetchFeaturedHospitals, type PublicDoctor, type PublicHospital } from '@/lib/api/public';

// =============================================================================
// SEO Metadata
// =============================================================================

export const metadata: Metadata = {
    title: 'Rozx Healthcare | Book Doctor Appointments Online | India',
    description: 'Book appointments with 10,000+ verified doctors. Video consultations and in-person visits. ABDM compliant healthcare platform.',
    keywords: ['doctor appointment', 'online consultation', 'healthcare India', 'video consultation'],
    openGraph: {
        title: 'Rozx Healthcare | Book Doctor Appointments Online',
        description: 'Book appointments with verified doctors. Video & in-person consultations available.',
        type: 'website',
        locale: 'en_IN',
        siteName: 'Rozx Healthcare',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Rozx Healthcare | Book Doctor Appointments',
        description: 'India\'s trusted healthcare platform. 10,000+ verified doctors.',
    },
    alternates: {
        canonical: 'https://rozx.in',
    },
};

// =============================================================================
// Static Data
// =============================================================================

const stats = [
    { value: '10,000+', label: 'Verified Doctors' },
    { value: '500+', label: 'Hospitals' },
    { value: '1M+', label: 'Patients' },
    { value: '4.8', label: 'Rating' },
];

const features = [
    { icon: Video, title: 'Video Consultations', description: 'Consult from home via secure video calls.' },
    { icon: Calendar, title: 'Easy Booking', description: 'Book appointments with real-time availability.' },
    { icon: Shield, title: 'Verified Doctors', description: 'All doctors verified with valid credentials.' },
    { icon: Clock, title: '24/7 Support', description: 'Round-the-clock customer support.' },
];

const specialties = [
    { name: 'General Physician', icon: Stethoscope, slug: 'general-physician' },
    { name: 'Cardiologist', icon: Heart, slug: 'cardiologist' },
    { name: 'Pediatrician', icon: Baby, slug: 'pediatrician' },
    { name: 'Orthopedic', icon: Bone, slug: 'orthopedic' },
    { name: 'Dermatologist', icon: Activity, slug: 'dermatologist' },
    { name: 'Neurologist', icon: Brain, slug: 'neurologist' },
    { name: 'Ophthalmologist', icon: Eye, slug: 'ophthalmologist' },
    { name: 'Gynecologist', icon: Building2, slug: 'gynecologist' },
];

// =============================================================================
// Page Component
// =============================================================================

export default async function HomePage() {
    const [featuredDoctors, featuredHospitals] = await Promise.all([
        fetchFeaturedDoctors(8),
        fetchFeaturedHospitals(6),
    ]);

    return (
        <main className="space-y-12">
            {/* Hero Section */}
            <section className="py-12 md:py-16">
                <div className="container">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-sm font-medium text-primary">
                            <BadgeCheck className="h-4 w-4" />
                            Trusted by 1M+ patients
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Modern Healthcare <br />
                            <span className="text-primary">Infrastructure for India</span>
                        </h1>

                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Find top-rated doctors, book appointments instantly, and manage your health records securely.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link
                                href="/doctors"
                                className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
                            >
                                Find Doctors
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                            <Link
                                href="/hospitals"
                                className="inline-flex items-center justify-center px-8 py-3 rounded-lg border font-medium hover:bg-muted transition-colors"
                            >
                                View Hospitals
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 border-y bg-muted/30">
                <div className="container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Doctors */}
            {featuredDoctors.length > 0 && (
                <section className="py-12 bg-muted/30">
                    <div className="container">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured Doctors</h2>
                            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">Book appointments with top-rated, verified specialists across various fields.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredDoctors.slice(0, 8).map((doctor) => (
                                <DoctorCard key={doctor.id} doctor={doctor} />
                            ))}
                        </div>

                        <div className="mt-12 text-center">
                            <Link
                                href="/doctors"
                                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                            >
                                View All Doctors <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Specialties */}
            <section className="py-20">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight">Popular Specialties</h2>
                        <p className="mt-3 text-muted-foreground">Find specialized care for your health needs</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        {specialties.map((specialty) => (
                            <Link
                                key={specialty.slug}
                                href={`/doctors?specialty=${specialty.slug}`}
                                className="flex flex-col items-center gap-3 p-4 rounded-xl border bg-background hover:border-primary/50 hover:shadow-md transition-all group"
                            >
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-all">
                                    <specialty.icon className="h-6 w-6 text-primary group-hover:text-white" />
                                </div>
                                <span className="text-xs font-semibold text-center">{specialty.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Hospitals */}
            {featuredHospitals.length > 0 && (
                <section className="py-20 border-t">
                    <div className="container">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tight">Public Favorite Hospitals</h2>
                            <p className="mt-3 text-muted-foreground">Premier healthcare facilities with 24/7 services and world-class infrastructure.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredHospitals.slice(0, 6).map((hospital) => (
                                <HospitalCard key={hospital.id} hospital={hospital} />
                            ))}
                        </div>

                        <div className="mt-12 text-center">
                            <Link
                                href="/hospitals"
                                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                            >
                                View All Hospitals <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Features */}
            <section className="py-20 bg-muted/30 border-y">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight">Why Choose ROZX?</h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">Experience a new standard of healthcare infrastructure with modern tools and verified providers.</p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="rounded-2xl border p-8 bg-background hover:shadow-lg transition-all border-primary/5 hover:border-primary/20"
                            >
                                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                                    <feature.icon className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold">{feature.title}</h3>
                                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20">
                <div className="container">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Patient CTA */}
                        <div className="rounded-3xl bg-slate-900 p-8 md:p-12 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                <Stethoscope className="h-32 w-32" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-primary">For Patients</span>
                            <h3 className="mt-6 text-3xl md:text-4xl font-bold leading-tight">Your health in <br /> your pocket</h3>
                            <ul className="mt-8 space-y-4">
                                <li className="flex items-center gap-3 text-slate-300">
                                    <BadgeCheck className="h-5 w-5 text-primary" />
                                    Digital Health Records (ABHA ID)
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <BadgeCheck className="h-5 w-5 text-primary" />
                                    Home Sample Collection
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <BadgeCheck className="h-5 w-5 text-primary" />
                                    24/7 Online Consultations
                                </li>
                            </ul>
                            <Link
                                href="/register"
                                className="mt-10 inline-flex items-center px-10 py-4 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition-all shadow-xl active:scale-95"
                            >
                                Sign Up as Patient
                            </Link>
                        </div>

                        {/* Hospital CTA */}
                        <div className="rounded-3xl bg-primary p-8 md:p-12 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform">
                                <Building2 className="h-32 w-32" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-white/70">For Hospitals</span>
                            <h3 className="mt-6 text-3xl md:text-4xl font-bold leading-tight">Elevate your <br /> medical facility</h3>
                            <ul className="mt-8 space-y-4">
                                <li className="flex items-center gap-3 text-white/90">
                                    <BadgeCheck className="h-5 w-5" />
                                    Integrated HMS & Pharmacy
                                </li>
                                <li className="flex items-center gap-3 text-white/90">
                                    <BadgeCheck className="h-5 w-5" />
                                    Patient Queue Management
                                </li>
                                <li className="flex items-center gap-3 text-white/90">
                                    <BadgeCheck className="h-5 w-5" />
                                    Automated Billing & Claims
                                </li>
                            </ul>
                            <Link
                                href="/register?type=hospital"
                                className="mt-10 inline-flex items-center px-10 py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-xl active:scale-95"
                            >
                                Join as Provider
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

// =============================================================================
// Components
// =============================================================================

function DoctorCard({ doctor }: { doctor: PublicDoctor }) {
    const name = doctor.name?.startsWith('Dr.') ? doctor.name : `Dr. ${doctor.name}`;
    const fee = doctor.consultation_fee_online || doctor.consultation_fee_in_person || 0;
    const specialty = typeof doctor.specialization === 'object'
        ? doctor.specialization?.name
        : doctor.specialization;

    return (
        <div className="group relative bg-background rounded-2xl border hover:border-primary/50 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
            <div className="p-5 flex-1">
                {/* Doctor Header */}
                <div className="flex gap-4">
                    <div className="relative shrink-0">
                        <div className="h-16 w-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center overflow-hidden">
                            {doctor.avatar_url ? (
                                <img
                                    src={doctor.avatar_url}
                                    alt={name}
                                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <Stethoscope className="h-7 w-7 text-primary/40" />
                            )}
                        </div>
                        {doctor.is_available && (
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background" title="Available Today" />
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-lg leading-tight truncate group-hover:text-primary transition-colors">
                            {name}
                        </h3>
                        <p className="text-sm font-medium text-primary mt-1">{specialty || 'General Physician'}</p>
                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                            <Briefcase className="h-3 w-3" />
                            <span>{doctor.experience_years || 5}+ Years Exp.</span>
                        </div>
                    </div>
                </div>

                {/* Tags & Fees */}
                <div className="mt-5 flex flex-wrap gap-2">
                    {doctor.online_consultation_enabled && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-500/5 text-blue-600 text-[10px] font-semibold border border-blue-500/10">
                            <Video className="h-3 w-3" />
                            Online
                        </span>
                    )}
                    {doctor.walk_in_enabled && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-orange-500/5 text-orange-600 text-[10px] font-semibold border border-orange-500/10">
                            <Building2 className="h-3 w-3" />
                            In-Clinic
                        </span>
                    )}
                </div>

                {/* Rating & Location */}
                <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1.5">
                            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-yellow-400/10 text-yellow-700 font-bold text-xs">
                                <Star className="h-3 w-3 fill-yellow-400" />
                                {doctor.rating?.toFixed(1) || '4.5'}
                            </div>
                            <span className="text-xs text-muted-foreground">({doctor.total_ratings || 120}+ reviews)</span>
                        </div>
                        <div className="font-bold text-foreground">₹{fee}</div>
                    </div>

                    <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/60" />
                        <span className="line-clamp-1">{doctor.hospital?.name || 'Private Clinic, Delhi'}</span>
                    </div>
                </div>
            </div>

            {/* CTAs */}
            <div className="p-4 pt-0 mt-auto grid grid-cols-2 gap-2">
                <Link
                    href={`/doctors/${doctor.id}`}
                    className="flex items-center justify-center py-2.5 rounded-xl border text-xs font-bold hover:bg-muted transition-colors"
                >
                    View Profile
                </Link>
                <Link
                    href={`/patient/book/${doctor.id}`}
                    className="flex items-center justify-center py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-sm active:scale-95"
                >
                    Book Now
                </Link>
            </div>
        </div>
    );
}

function HospitalCard({ hospital }: { hospital: PublicHospital }) {
    const typeLabels: Record<string, string> = {
        clinic: 'Clinic',
        multi_specialty: 'Multi-Specialty',
        super_specialty: 'Super-Specialty',
        diagnostic_center: 'Diagnostic',
        hospital: 'General Hospital',
    };

    return (
        <div className="group bg-background rounded-2xl border hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden">
            {/* Image/Banner Container */}
            <div className="relative h-40 w-full bg-muted overflow-hidden">
                {hospital.banner_url || hospital.cover_image_url ? (
                    <img
                        src={hospital.banner_url || hospital.cover_image_url}
                        alt={hospital.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center bg-primary/5">
                        <Building2 className="h-10 w-10 text-primary/20" />
                    </div>
                )}

                {/* Logo Overlay */}
                <div className="absolute -bottom-6 left-5 h-16 w-16 rounded-2xl bg-background p-1.5 shadow-lg border">
                    <div className="h-full w-full rounded-xl bg-primary/5 flex items-center justify-center overflow-hidden">
                        {hospital.logo_url ? (
                            <img src={hospital.logo_url} alt={hospital.name} className="h-full w-full object-contain" />
                        ) : (
                            <Building2 className="h-6 w-6 text-primary" />
                        )}
                    </div>
                </div>

                {/* Status Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 scale-90 origin-top-right">
                    {hospital.emergency_24x7 && (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-600 text-white text-[10px] font-bold uppercase tracking-tight shadow-md">
                            <Zap className="h-3 w-3 fill-white" />
                            24/7 Emergency
                        </div>
                    )}
                    {hospital.pharmacy_24x7 && (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-600 text-white text-[10px] font-bold uppercase tracking-tight shadow-md">
                            <Pill className="h-3 w-3" />
                            24/7 Pharmacy
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6 pt-10 flex-1 flex flex-col">
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-xl truncate group-hover:text-primary transition-colors">
                            {hospital.name}
                        </h3>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-primary uppercase tracking-wide text-[11px]">
                            {typeLabels[hospital.type] || hospital.type}
                        </p>
                        <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-500" />
                            <span className="text-sm font-bold">{hospital.rating?.toFixed(1) || '4.5'}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 mt-auto">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0 text-primary/60 mt-0.5" />
                        <span className="line-clamp-2">
                            {[hospital.landmark, hospital.city, hospital.state].filter(Boolean).join(', ') || 'Delhi, India'}
                        </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-medium py-3 border-y border-dashed">
                        <div className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-primary" />
                            <span>{hospital.total_doctors || 0}+ Doctors</span>
                        </div>
                        <div className="h-3 w-px bg-border" />
                        <div className="flex items-center gap-1.5">
                            <Activity className="h-3.5 w-3.5 text-primary" />
                            <span>{hospital.total_beds || 50}+ Beds</span>
                        </div>
                    </div>

                    <Link
                        href={`/hospitals/${hospital.id}`}
                        className="w-full flex items-center justify-center gap-2 py-3 mt-4 rounded-xl bg-primary/5 text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all group/btn"
                    >
                        View Hospital Details
                        <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

