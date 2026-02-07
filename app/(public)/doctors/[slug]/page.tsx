
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    Star,
    MapPin,
    Clock,
    Video,
    Building2,
    GraduationCap,
    Languages,
    Calendar,
    ChevronRight,
    ThumbsUp,
    IndianRupee,
    Stethoscope,
    Phone,
    Award,
    FileText,
    Shield,
    Users,
    CheckCircle,
    Activity,
} from 'lucide-react';
import { fetchDoctor } from '@/lib/api/public';
import { DoctorCard, QuickSlotPicker, ReviewsSection } from '@/components/doctors';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const doctor = await fetchDoctor(slug);

    if (!doctor) {
        return {
            title: 'Doctor Not Found - ROZX',
            description: 'The requested doctor profile could not be found.',
        };
    }

    const specializationName = !doctor.specialization
        ? 'General Physician'
        : typeof doctor.specialization === 'string'
            ? doctor.specialization
            : doctor.specialization.name;

    return {
        title: `Dr. ${doctor.name} - ${specializationName} in ${doctor.hospital?.city || 'India'} | ROZX`,
        description: `Book an appointment with Dr. ${doctor.name}, a verified ${specializationName} at ${doctor.hospital?.name}. ${doctor.experience_years}+ years of experience. ${doctor.bio || ''}`.substring(0, 160),
    };
}

export default async function DoctorProfilePage({ params }: PageProps) {
    const { slug } = await params;
    const doctor = await fetchDoctor(slug);

    if (!doctor) {
        notFound();
    }

    // Transform API data for display
    const qualifications = doctor.qualifications || [];
    const languages = doctor.languages_spoken || ['English', 'Hindi'];

    // Fallback for missing hospital address
    const hospitalAddress = doctor.hospital?.city
        ? `${doctor.hospital.city}`
        : 'Address available on booking';

    return (
        <div className="container py-8">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/doctors" className="hover:text-primary transition-colors">Doctors</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground font-medium truncate max-w-[200px]">Dr. {doctor.name}</span>
            </nav>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Header */}
                    <div className="rounded-xl border bg-card p-6 shadow-xs">
                        <div className="flex flex-col gap-6 md:flex-row">
                            <div className="shrink-0 flex justify-center md:block">
                                {doctor.avatar_url ? (
                                    <img
                                        src={doctor.avatar_url}
                                        alt={`Dr. ${doctor.name}`}
                                        className="h-32 w-32 rounded-xl object-cover border"
                                    />
                                ) : (
                                    <div className="h-32 w-32 rounded-xl bg-primary/10 flex items-center justify-center text-4xl font-bold text-primary border border-primary/20">
                                        {doctor.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-2 text-center md:text-left">
                                <div>
                                    <h1 className="text-2xl font-bold flex items-center justify-center md:justify-start gap-2">
                                        Dr. {doctor.name}
                                        {doctor.verification_status === 'verified' && (
                                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white" title="Verified">
                                                ✓
                                            </span>
                                        )}
                                    </h1>
                                    <p className="text-lg text-primary font-medium">
                                        {!doctor.specialization
                                            ? 'General Physician'
                                            : typeof doctor.specialization === 'string'
                                                ? doctor.specialization
                                                : doctor.specialization.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{qualifications.join(', ')}</p>
                                </div>

                                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm pt-2">
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/50">
                                        <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                                        <strong>{doctor.rating.toFixed(1)}</strong>
                                        <span className="opacity-80">({doctor.total_ratings} reviews)</span>
                                    </span>
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50">
                                        <Clock className="h-3.5 w-3.5" />
                                        {doctor.experience_years}+ years exp.
                                    </span>
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50">
                                        <ThumbsUp className="h-3.5 w-3.5" />
                                        98% recommended
                                    </span>
                                </div>

                                <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                                    {doctor.online_consultation_enabled && (
                                        <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50">
                                            <Video className="h-3.5 w-3.5" />
                                            Video Consult
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 border border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-900/50">
                                        <Building2 className="h-3.5 w-3.5" />
                                        In-Clinic
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hospital Info */}
                    {doctor.hospital && (
                        <div className="rounded-xl border bg-card p-6 shadow-xs">
                            <h2 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                                <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                    <Building2 className="h-5 w-5" />
                                </span>
                                Clinic / Hospital
                            </h2>
                            <div className="flex gap-4">
                                {doctor.hospital.logo_url && (
                                    <img
                                        src={doctor.hospital.logo_url}
                                        alt={doctor.hospital.name}
                                        className="h-16 w-16 rounded-lg object-contain border p-1"
                                    />
                                )}
                                <div>
                                    <Link href={`/hospitals/${doctor.hospital.id}`} className="font-medium text-lg hover:underline text-primary">
                                        {doctor.hospital.name}
                                    </Link>
                                    <p className="text-muted-foreground flex items-start gap-1 mt-1">
                                        <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                                        {hospitalAddress}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* About */}
                    <div className="rounded-xl border bg-card p-6 shadow-xs">
                        <h2 className="font-semibold mb-4 text-lg">About Dr. {doctor.name}</h2>
                        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                            {doctor.bio ? (
                                <p>{doctor.bio}</p>
                            ) : (
                                <p>Dr. {doctor.name} is a specialist in {!doctor.specialization ? 'General Medicine' : (typeof doctor.specialization === 'string' ? doctor.specialization : doctor.specialization.name)} with {doctor.experience_years} years of experience.</p>
                            )}
                        </div>
                    </div>

                    {/* Services & Treatments */}
                    {doctor.services && doctor.services.length > 0 && (
                        <div className="rounded-xl border bg-card p-6 shadow-xs">
                            <h2 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                                <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                    <Activity className="h-5 w-5" />
                                </span>
                                Services & Treatments
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {doctor.services.map((service, index) => (
                                    <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                        {service}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Awards & Certifications */}
                    {(doctor.awards && doctor.awards.length > 0 || doctor.certifications && doctor.certifications.length > 0) && (
                        <div className="rounded-xl border bg-card p-6 shadow-xs">
                            <h2 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                                <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                    <Award className="h-5 w-5" />
                                </span>
                                Awards & Certifications
                            </h2>
                            <div className="space-y-4">
                                {doctor.awards?.map((award, index) => (
                                    <div key={`award-${index}`} className="flex gap-3">
                                        <div className="mt-1 shrink-0">
                                            <Award className="h-4 w-4 text-yellow-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{award}</p>
                                        </div>
                                    </div>
                                ))}
                                {doctor.certifications?.map((cert, index) => (
                                    <div key={`cert-${index}`} className="flex gap-3">
                                        <div className="mt-1 shrink-0">
                                            <FileText className="h-4 w-4 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{cert}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Awards & Certifications */}
                    {(doctor.awards && doctor.awards.length > 0 || doctor.certifications && doctor.certifications.length > 0) && (
                        <div className="rounded-xl border bg-card p-6 shadow-xs">
                            <h2 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                                <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                    <Award className="h-5 w-5" />
                                </span>
                                Awards & Certifications
                            </h2>
                            <div className="space-y-4">
                                {doctor.awards?.map((award, index) => (
                                    <div key={`award-${index}`} className="flex gap-3">
                                        <div className="mt-1 shrink-0">
                                            <Award className="h-4 w-4 text-yellow-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{award}</p>
                                        </div>
                                    </div>
                                ))}
                                {doctor.certifications?.map((cert, index) => (
                                    <div key={`cert-${index}`} className="flex gap-3">
                                        <div className="mt-1 shrink-0">
                                            <FileText className="h-4 w-4 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{cert}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Additional Details Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Services */}
                        <div className="rounded-xl border bg-card p-6 shadow-xs">
                            <h2 className="font-semibold mb-4 flex items-center gap-2">
                                <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                    <Stethoscope className="h-4 w-4" />
                                </span>
                                Specialization
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                <span className="rounded-md bg-muted px-3 py-1.5 text-sm font-medium">
                                    {!doctor.specialization
                                        ? 'General Physician'
                                        : typeof doctor.specialization === 'string'
                                            ? doctor.specialization
                                            : doctor.specialization.name}
                                </span>
                            </div>
                        </div>

                        {/* Languages */}
                        <div className="rounded-xl border bg-card p-6 shadow-xs">
                            <h2 className="font-semibold mb-4 flex items-center gap-2">
                                <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                    <Languages className="h-4 w-4" />
                                </span>
                                Languages
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {languages.map((lang: string) => (
                                    <span key={lang} className="rounded-md bg-muted px-3 py-1.5 text-sm">
                                        {lang}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Ratings & Reviews */}
                    <ReviewsSection doctorId={doctor.id} />
                </div>

                {/* Sidebar - Booking */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        {/* Fee Card */}
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <IndianRupee className="h-5 w-5 text-primary" />
                                Consultation Fee
                            </h3>

                            <div className="space-y-3">
                                {doctor.consultation_fee_in_person > 0 && (
                                    <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                                        <span className="text-sm font-medium flex items-center gap-2">
                                            <Building2 className="h-4 w-4 text-muted-foreground" />
                                            In-Clinic
                                        </span>
                                        <span className="font-bold text-primary">₹{doctor.consultation_fee_in_person}</span>
                                    </div>
                                )}

                                {doctor.consultation_fee_online > 0 && (
                                    <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                                        <span className="text-sm font-medium flex items-center gap-2">
                                            <Video className="h-4 w-4 text-muted-foreground" />
                                            Video Consult
                                        </span>
                                        <span className="font-bold text-primary">₹{doctor.consultation_fee_online}</span>
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* Booking CTA */}
                        <div className="rounded-xl border bg-card p-6 shadow-sm ring-2 ring-primary/5">
                            <QuickSlotPicker
                                doctorId={doctor.id}
                                doctorSlug={slug}
                            />

                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                Available Today
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="rounded-xl border bg-card p-6 shadow-sm text-center">
                            <div className="mx-auto w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <h3 className="font-semibold text-sm mb-1">Need Help Booking?</h3>
                            <p className="text-xs text-muted-foreground mb-3">
                                Our support team is here to assist you
                            </p>
                            <a href="tel:1800123456" className="text-primary font-bold hover:underline">
                                1800-123-456
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
