import { Metadata } from 'next';
import Link from 'next/link';
import {
    Stethoscope, Heart, Activity, Baby, Bone, Brain, Eye,
    ChevronRight, Zap, Target, Search, Thermometer,
    Syringe, ShieldAlert, Dna, Microscope
} from 'lucide-react';
import { fetchSpecializations } from '@/lib/api/public';

export const metadata: Metadata = {
    title: 'Medical Specialties | Rozx Healthcare',
    description: 'Explore all medical specialties and find the right doctor for your healthcare needs on Rozx Healthcare.',
};

// Fallback icons mapping based on slug
const iconMap: Record<string, any> = {
    'general-physician': Stethoscope,
    'cardiologist': Heart,
    'pediatrician': Baby,
    'orthopedic': Bone,
    'dermatologist': Activity,
    'neurologist': Brain,
    'ophthalmologist': Eye,
    'dentist': Zap, // Placeholder
    'gynecologist': Target, // Placeholder
    'ent': Thermometer, // Ear, Nose, Throat
    'urologist': Syringe,
    'psychiatrist': ShieldAlert,
    'endocrinologist': Dna,
    'gastroenterologist': Microscope,
};

export default async function SpecialtiesPage() {
    const apiSpecialties = await fetchSpecializations();

    return (
        <div className="space-y-0">
            {/* Hero Section */}
            <section className="py-16 bg-linear-to-br from-primary/5 via-transparent to-primary/10">
                <div className="container">
                    <div className="max-w-2xl mx-auto text-center">
                        <h1 className="text-4xl font-bold">Browse by Specialty</h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Find the right specialist for your healthcare needs. We have verified doctors across 50+ medical fields.
                        </p>
                    </div>
                </div>
            </section>

            {/* Specialties Grid */}
            <section className="py-16">
                <div className="container">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {apiSpecialties.map((specialty) => {
                            const Icon = iconMap[specialty.slug] || Stethoscope;
                            return (
                                <Link
                                    key={specialty.id}
                                    href={`/doctors?specialty=${specialty.slug}`}
                                    className="group rounded-2xl border bg-background p-6 hover:shadow-lg hover:border-primary/30 transition-all flex flex-col items-center text-center"
                                >
                                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Icon className="h-8 w-8 text-primary group-hover:text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{specialty.name}</h3>
                                    {specialty.description && (
                                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                            {specialty.description}
                                        </p>
                                    )}
                                    <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                                        Find Doctors <ChevronRight className="h-4 w-4" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Support section */}
            <section className="py-16 border-t">
                <div className="container">
                    <div className="bg-primary/5 rounded-3xl p-8 md:p-12 text-center">
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-2xl font-bold">Not sure which specialty you need?</h2>
                            <p className="mt-4 text-muted-foreground">
                                Our support team is here to help you find the right doctor based on your symptoms and history.
                            </p>
                            <div className="mt-8 flex flex-wrap justify-center gap-4">
                                <Link
                                    href="/contact"
                                    className="rounded-lg bg-primary px-8 py-3 font-medium text-white hover:bg-primary/90 transition-colors"
                                >
                                    Contact for Help
                                </Link>
                                <Link
                                    href="/doctors"
                                    className="rounded-lg border-2 border-primary/20 px-8 py-3 font-medium text-primary hover:bg-primary/5 transition-colors"
                                >
                                    View All Doctors
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
