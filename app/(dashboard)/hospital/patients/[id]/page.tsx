import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    return {
        title: 'Patient Details',
        description: 'View patient details.',
    };
}

export default async function HospitalPatientDetailPage({ params }: PageProps) {
    const { id } = await params;

    const patient = {
        id,
        name: 'John Doe',
        age: 35,
        gender: 'Male',
        phone: '+91 98765 43210',
        email: 'john@example.com',
        bloodGroup: 'O+',
        visits: 5,
    };

    const visitHistory = [
        { id: '1', date: '2026-01-15', doctor: 'Dr. Rajesh Kumar', diagnosis: 'Viral Fever' },
        { id: '2', date: '2026-01-01', doctor: 'Dr. Priya Sharma', diagnosis: 'Skin Allergy' },
        { id: '3', date: '2025-12-15', doctor: 'Dr. Rajesh Kumar', diagnosis: 'Routine Checkup' },
    ];

    return (
        <>
            <div className="rounded-xl border p-6 mb-6">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">{patient.name}</h1>
                        <p className="text-muted-foreground">
                            {patient.age} yrs • {patient.gender} • Blood: {patient.bloodGroup}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">{patient.phone} • {patient.email}</p>
                    </div>
                </div>
            </div>

            <h2 className="text-lg font-semibold mb-4">Visit History ({patient.visits} visits)</h2>
            <div className="space-y-4">
                {visitHistory.map((visit) => (
                    <div key={visit.id} className="rounded-xl border p-4">
                        <div className="flex justify-between">
                            <div>
                                <p className="font-medium">{visit.diagnosis}</p>
                                <p className="text-sm text-muted-foreground">{visit.doctor}</p>
                            </div>
                            <span className="text-sm text-muted-foreground">{visit.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
