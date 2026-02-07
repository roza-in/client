import { Metadata } from 'next';
import Link from 'next/link';
import { DoctorCard } from '@/components/doctors';
import { ChevronRight, Search } from 'lucide-react';

interface PageProps {
    params: Promise<{ slug: string; doctorId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    return {
        title: 'Dr. Rajesh Kumar - Apollo Hospitals',
        description: 'Book appointment with Dr. Rajesh Kumar at Apollo Hospitals.',
    };
}

export default async function HospitalDoctorPage({ params }: PageProps) {
    const { slug, doctorId } = await params;

    // Mock doctor data
    const doctor = {
        id: doctorId,
        name: 'Rajesh Kumar',
        specialization: 'Cardiologist',
        qualification: 'MBBS, MD (Cardiology), DM',
        experience: 15,
        rating: 4.9,
        reviewCount: 245,
        consultationFee: 800,
        languages: ['English', 'Hindi', 'Telugu'],
        about: 'Dr. Rajesh Kumar is a renowned cardiologist with over 15 years of experience in treating heart conditions.',
        timings: [
            { day: 'Monday', time: '10:00 AM - 2:00 PM' },
            { day: 'Wednesday', time: '10:00 AM - 2:00 PM' },
            { day: 'Friday', time: '3:00 PM - 7:00 PM' },
        ],
    };

    return (
        <div className="container py-8">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                <Link href="/" className="hover:text-primary">Home</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/hospitals" className="hover:text-primary">Hospitals</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href={`/hospitals/${slug}`} className="hover:text-primary">Apollo Hospitals</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">Dr. {doctor.name}</span>
            </nav>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile */}
                    <div className="rounded-xl border p-6">
                        <div className="flex gap-6">
                            <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-primary/10 text-3xl font-bold text-primary">
                                {doctor.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Dr. {doctor.name}</h1>
                                <p className="text-primary">{doctor.specialization}</p>
                                <p className="text-sm text-muted-foreground">{doctor.qualification}</p>
                                <p className="mt-2 text-sm text-muted-foreground">{doctor.experience} years experience</p>
                            </div>
                        </div>
                    </div>

                    {/* About */}
                    <div className="rounded-xl border p-6">
                        <h2 className="font-semibold mb-4">About</h2>
                        <p className="text-muted-foreground">{doctor.about}</p>
                    </div>

                    {/* Availability */}
                    <div className="rounded-xl border p-6">
                        <h2 className="font-semibold mb-4">Availability at this Hospital</h2>
                        <div className="space-y-2">
                            {doctor.timings.map((timing) => (
                                <div key={timing.day} className="flex justify-between text-sm">
                                    <span>{timing.day}</span>
                                    <span className="text-muted-foreground">{timing.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="rounded-xl border p-6">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-muted-foreground">Consultation Fee</span>
                            <span className="text-2xl font-bold text-primary">₹{doctor.consultationFee}</span>
                        </div>
                        <Link
                            href={`/patient/appointments/book?doctor=${doctorId}&hospital=${slug}`}
                            className="block w-full rounded-lg bg-primary py-3 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
                        >
                            Book Appointment
                        </Link>
                    </div>

                    <div className="rounded-xl border p-6">
                        <h3 className="font-semibold mb-3">Languages</h3>
                        <div className="flex flex-wrap gap-2">
                            {doctor.languages.map((lang) => (
                                <span key={lang} className="rounded-full bg-muted px-3 py-1 text-sm">
                                    {lang}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
