'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RatingStars } from '@/components/shared/rating-stars';
import { ReviewCard, type Review } from './review-card';

export interface RatingStats {
    average_rating: number;
    total_ratings: number;
    rating_distribution: Record<number, number>;
}

interface ReviewsSectionProps {
    doctorId: string;
    initialStats?: RatingStats;
    initialReviews?: Review[];
    className?: string;
}

// Rating distribution bar component
function RatingBar({
    stars,
    count,
    total,
}: {
    stars: number;
    count: number;
    total: number;
}) {
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
        <div className="flex items-center gap-2 text-sm">
            <span className="w-3 text-muted-foreground">{stars}</span>
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span className="w-8 text-right text-muted-foreground">{count}</span>
        </div>
    );
}

export function ReviewsSection({
    doctorId,
    initialStats,
    initialReviews,
    className,
}: ReviewsSectionProps) {
    const [stats, setStats] = useState<RatingStats | null>(initialStats || null);
    const [reviews, setReviews] = useState<Review[]>(initialReviews || []);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(!initialStats);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent');

    // Fetch stats and initial reviews
    useEffect(() => {
        if (initialStats && initialReviews) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch stats
                const statsRes = await fetch(`/api/ratings/doctors/${doctorId}/stats`);
                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    setStats(statsData.data);
                }

                // Fetch reviews
                const reviewsRes = await fetch(
                    `/api/ratings/doctors/${doctorId}?page=1&limit=5`
                );
                if (reviewsRes.ok) {
                    const reviewsData = await reviewsRes.json();
                    setReviews(reviewsData.data?.ratings || []);
                    setHasMore((reviewsData.data?.ratings?.length || 0) >= 5);
                }
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [doctorId, initialStats, initialReviews]);

    // Load more reviews
    const loadMore = async () => {
        if (isLoadingMore || !hasMore) return;

        setIsLoadingMore(true);
        try {
            const nextPage = page + 1;
            const res = await fetch(
                `/api/ratings/doctors/${doctorId}?page=${nextPage}&limit=5`
            );
            if (res.ok) {
                const data = await res.json();
                const newReviews = data.data?.ratings || [];
                setReviews((prev) => [...prev, ...newReviews]);
                setPage(nextPage);
                setHasMore(newReviews.length >= 5);
            }
        } catch (error) {
            console.error('Failed to load more reviews:', error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    // Mark review as helpful
    const handleMarkHelpful = async (reviewId: string) => {
        try {
            const res = await fetch(`/api/ratings/${reviewId}/helpful`, {
                method: 'POST',
            });
            if (res.ok) {
                setReviews((prev) =>
                    prev.map((r) =>
                        r.id === reviewId
                            ? { ...r, helpful_count: (r.helpful_count || 0) + 1 }
                            : r
                    )
                );
            }
        } catch (error) {
            console.error('Failed to mark as helpful:', error);
        }
    };

    // Sort reviews
    const sortedReviews = [...reviews].sort((a, b) => {
        if (sortBy === 'highest') return b.overall_rating - a.overall_rating;
        if (sortBy === 'lowest') return a.overall_rating - b.overall_rating;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    if (isLoading) {
        return (
            <div className={cn('rounded-xl border bg-card p-6', className)}>
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </div>
        );
    }

    if (!stats || stats.total_ratings === 0) {
        return (
            <div className={cn('rounded-xl border bg-card p-6', className)}>
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    Patient Reviews
                </h2>
                <div className="text-center py-8 text-muted-foreground">
                    <Star className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No reviews yet</p>
                    <p className="text-sm mt-1">Be the first to share your experience!</p>
                </div>
            </div>
        );
    }

    return (
        <div className={cn('rounded-xl border bg-card p-6', className)}>
            {/* Header */}
            <h2 className="font-semibold text-lg mb-6 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                Patient Reviews
            </h2>

            {/* Stats Summary */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Overall Rating */}
                <div className="text-center md:text-left">
                    <div className="flex items-baseline justify-center md:justify-start gap-2">
                        <span className="text-5xl font-bold">
                            {stats.average_rating.toFixed(1)}
                        </span>
                        <span className="text-2xl text-muted-foreground">/5</span>
                    </div>
                    <RatingStars
                        rating={stats.average_rating}
                        size="md"
                        className="justify-center md:justify-start mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                        Based on {stats.total_ratings.toLocaleString()} review
                        {stats.total_ratings !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <RatingBar
                            key={star}
                            stars={star}
                            count={stats.rating_distribution[star] || 0}
                            total={stats.total_ratings}
                        />
                    ))}
                </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <span className="text-sm text-muted-foreground">
                    {sortedReviews.length} of {stats.total_ratings} reviews
                </span>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-sm border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="recent">Most Recent</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                </select>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {sortedReviews.map((review) => (
                    <ReviewCard
                        key={review.id}
                        review={review}
                        onMarkHelpful={handleMarkHelpful}
                    />
                ))}
            </div>

            {/* Load More */}
            {hasMore && (
                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={loadMore}
                        disabled={isLoadingMore}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border bg-background hover:bg-muted transition-colors disabled:opacity-50"
                    >
                        {isLoadingMore ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            <>
                                <ChevronDown className="h-4 w-4" />
                                Load More Reviews
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}

export default ReviewsSection;
