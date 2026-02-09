import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PrescriptionViewer } from '@/components/prescriptions';

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    return {
        title: 'Prescription Details',
        description: 'View your prescription details.',
    };
}

export default async function PrescriptionDetailPage({ params }: PageProps) {
    const { id } = await params;

    // Mock prescription data
    const prescription = {
        id,
        doctorName: 'Rajesh Kumar',
        specialization: 'General Physician',
        hospitalName: 'Apollo Hospitals',
        patientName: 'John Doe',
        patientAge: 35,
        patientGender: 'Male',
        diagnosis: 'Viral Fever with Upper Respiratory Tract Infection',
        symptoms: ['Fever', 'Headache', 'Body ache', 'Sore throat'],
        medications: [
            {
                name: 'Paracetamol 500mg',
                dosage: '1 tablet',
                frequency: '3 times a day',
                duration: 5,
                instructions: 'Take after meals',
                timing: { afterFood: true },
            },
            {
                name: 'Cetirizine 10mg',
                dosage: '1 tablet',
                frequency: 'Once daily',
                duration: 5,
                instructions: 'Take at night before bed',
                timing: { afterFood: false },
            },
            {
                name: 'Vitamin C 500mg',
                dosage: '1 tablet',
                frequency: 'Once daily',
                duration: 10,
                instructions: 'Take after breakfast',
                timing: { afterFood: true },
            },
        ],
        labTests: [
            { name: 'Complete Blood Count (CBC)', instructions: 'Fasting not required', priority: 'normal' },
        ],
        advice: 'Take complete rest for 2-3 days. Drink plenty of fluids. Avoid cold beverages. If fever persists for more than 3 days, visit the clinic.',
        followUpDays: 7,
        createdAt: '2026-01-15T10:00:00',
        validUntil: '2026-02-15T10:00:00',
    } as any;

    return (
        <div className="p-6 max-w-4xl">
            <Link
                href="/patient/prescriptions"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to prescriptions
            </Link>

            <PrescriptionViewer prescription={prescription} />
        </div>
    );
}
