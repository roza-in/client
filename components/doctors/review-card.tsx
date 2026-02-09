'use client';

import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, ThumbsUp, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RatingStars } from '@/components/shared/rating-stars';

export interface Review {
    id: string;
    overall_rating: number;
    review: string | null;
    is_anonymous: boolean;
    patient_name: string | null;
    created_at: string;
    doctor_response: string | null;
    doctor_responded_at?: string | null;
    helpful_count?: number;
    is_verified?: boolean;
}

interface ReviewCardProps {
    review: Review;
    onMarkHelpful?: (reviewId: string) => void;
    isHelpfulLoading?: boolean;
    className?: string;
}

export function ReviewCard({
    review,
    onMarkHelpful,
    isHelpfulLoading = false,
    className,
}: ReviewCardProps) {
    const displayName = review.is_anonymous
        ? 'Anonymous Patient'
        : review.patient_name || 'Patient';

    const timeAgo = formatDistanceToNow(new Date(review.created_at), {
        addSuffix: true,
    });

    return (
        <div
            className={cn(
                'rounded-xl border bg-card p-5 transition-shadow hover:shadow-sm',
                className
            )}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <User className="h-5 w-5 text-muted-foreground" />
                    </div>

                    {/* Name & Date */}
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">{displayName}</span>
                            {review.is_verified && (
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                    Verified
                                </span>
                            )}
                        </div>
                        <span className="text-sm text-muted-foreground">{timeAgo}</span>
                    </div>
                </div>

                {/* Rating */}
                <RatingStars rating={review.overall_rating} size="sm" showNumber />
            </div>

            {/* Review Text */}
            {review.review && (
                <p className="mt-4 text-muted-foreground leading-relaxed">
                    {review.review}
                </p>
            )}

            {/* Doctor Response */}
            {review.doctor_response && (
                <div className="mt-4 rounded-lg bg-primary/5 border border-primary/10 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
                        <MessageCircle className="h-4 w-4" />
                        Doctor's Response
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {review.doctor_response}
                    </p>
                </div>
            )}

            {/* Actions */}
            <div className="mt-4 flex items-center gap-4 pt-3 border-t">
                <button
                    type="button"
                    onClick={() => onMarkHelpful?.(review.id)}
                    disabled={isHelpfulLoading}
                    className={cn(
                        'flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors',
                        isHelpfulLoading && 'opacity-50 cursor-not-allowed'
                    )}
                >
                    <ThumbsUp className="h-4 w-4" />
                    <span>Helpful</span>
                    {(review.helpful_count ?? 0) > 0 && (
                        <span className="text-xs">({review.helpful_count})</span>
                    )}
                </button>
            </div>
        </div>
    );
}

export default ReviewCard;
