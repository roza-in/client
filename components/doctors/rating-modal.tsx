'use client';

import { useState } from 'react';
import { X, Loader2, Star, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StarRatingInput } from '@/components/shared/rating-stars';

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: RatingFormData) => Promise<void>;
    doctorName: string;
    appointmentId: string;
    className?: string;
}

export interface RatingFormData {
    appointment_id: string;
    overall_rating: number;
    doctor_rating?: number;
    wait_time_rating?: number;
    consultation_quality_rating?: number;
    review?: string;
    is_anonymous: boolean;
}

export function RatingModal({
    isOpen,
    onClose,
    onSubmit,
    doctorName,
    appointmentId,
    className,
}: RatingModalProps) {
    const [formData, setFormData] = useState<RatingFormData>({
        appointment_id: appointmentId,
        overall_rating: 0,
        doctor_rating: 0,
        wait_time_rating: 0,
        consultation_quality_rating: 0,
        review: '',
        is_anonymous: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.overall_rating === 0) {
            setError('Please provide an overall rating');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to submit rating');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={cn(
                    'relative z-10 w-full max-w-lg mx-4 bg-background rounded-2xl shadow-2xl overflow-hidden',
                    className
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary/10 to-primary/5">
                    <div>
                        <h2 className="text-xl font-semibold">Rate Your Experience</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            How was your consultation with Dr. {doctorName}?
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-muted transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Overall Rating */}
                    <div className="text-center pb-4 border-b">
                        <p className="text-sm font-medium mb-3">Overall Rating *</p>
                        <div className="flex justify-center">
                            <StarRatingInput
                                value={formData.overall_rating}
                                onChange={(value) =>
                                    setFormData((prev) => ({ ...prev, overall_rating: value }))
                                }
                                size="lg"
                            />
                        </div>
                    </div>

                    {/* Category Ratings */}
                    <div className="space-y-4">
                        <p className="text-sm font-medium text-muted-foreground">
                            Rate specific aspects (optional)
                        </p>

                        <div className="grid gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Doctor's Care</span>
                                <StarRatingInput
                                    value={formData.doctor_rating || 0}
                                    onChange={(value) =>
                                        setFormData((prev) => ({ ...prev, doctor_rating: value }))
                                    }
                                    size="sm"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm">Wait Time</span>
                                <StarRatingInput
                                    value={formData.wait_time_rating || 0}
                                    onChange={(value) =>
                                        setFormData((prev) => ({ ...prev, wait_time_rating: value }))
                                    }
                                    size="sm"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm">Consultation Quality</span>
                                <StarRatingInput
                                    value={formData.consultation_quality_rating || 0}
                                    onChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            consultation_quality_rating: value,
                                        }))
                                    }
                                    size="sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Review Text */}
                    <div>
                        <label className="text-sm font-medium" htmlFor="review">
                            Share your experience (optional)
                        </label>
                        <textarea
                            id="review"
                            rows={4}
                            value={formData.review}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, review: e.target.value }))
                            }
                            placeholder="Tell others about your experience..."
                            className="mt-2 w-full rounded-lg border bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Anonymous Toggle */}
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.is_anonymous}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    is_anonymous: e.target.checked,
                                }))
                            }
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm">Post anonymously</span>
                    </label>

                    {/* Error */}
                    {error && (
                        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 px-4 rounded-lg border hover:bg-muted transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || formData.overall_rating === 0}
                            className="flex-1 py-2.5 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Submit Rating
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RatingModal;
