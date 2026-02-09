'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { RatingModal, type RatingFormData } from '@/components/doctors';
import { PageLoader } from '@/components/shared';

// This would typically come from an API call based on the appointment ID
const MOCK_DOCTOR_NAME = 'Sarah Wilson';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function AppointmentRatingPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);

    const handleSubmit = async (data: RatingFormData) => {
        try {
            const res = await fetch('/api/ratings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to submit rating');
            }

            // Redirect to appointment details or dashboard on success
            router.push(`/patient/appointments/${id}`);
        } catch (error) {
            console.error('Rating submission error:', error);
            throw error;
        }
    };

    const handleClose = () => {
        // If user cancels rating, go back to appointment details
        router.push(`/patient/appointments/${id}`);
    };

    if (!isOpen) return <PageLoader />;

    return (
        <div className="container py-8">
            <RatingModal
                isOpen={isOpen}
                onClose={handleClose}
                onSubmit={handleSubmit}
                doctorName={MOCK_DOCTOR_NAME} // TODO: Fetch real doctor name
                appointmentId={id}
            />
        </div>
    );
}
