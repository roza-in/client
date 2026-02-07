'use client';

import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
    rating: number;
    maxRating?: number;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    showNumber?: boolean;
    showCount?: boolean;
    count?: number;
    className?: string;
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
}

const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
};

const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
};

export function RatingStars({
    rating,
    maxRating = 5,
    size = 'md',
    showNumber = false,
    showCount = false,
    count = 0,
    className,
    interactive = false,
    onRatingChange,
}: RatingStarsProps) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

    const handleClick = (index: number) => {
        if (interactive && onRatingChange) {
            onRatingChange(index + 1);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (interactive && onRatingChange && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onRatingChange(index + 1);
        }
    };

    return (
        <div className={cn('flex items-center gap-1', className)}>
            <div className="flex items-center">
                {/* Full stars */}
                {Array.from({ length: fullStars }).map((_, i) => (
                    <Star
                        key={`full-${i}`}
                        className={cn(
                            sizeClasses[size],
                            'fill-yellow-400 text-yellow-400 transition-transform',
                            interactive && 'cursor-pointer hover:scale-110'
                        )}
                        onClick={() => handleClick(i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        tabIndex={interactive ? 0 : undefined}
                        role={interactive ? 'button' : undefined}
                        aria-label={interactive ? `Rate ${i + 1} star${i !== 0 ? 's' : ''}` : undefined}
                    />
                ))}

                {/* Half star */}
                {hasHalfStar && (
                    <div className="relative">
                        <Star
                            className={cn(sizeClasses[size], 'text-gray-300 dark:text-gray-600')}
                        />
                        <div className="absolute inset-0 overflow-hidden w-1/2">
                            <Star
                                className={cn(sizeClasses[size], 'fill-yellow-400 text-yellow-400')}
                            />
                        </div>
                    </div>
                )}

                {/* Empty stars */}
                {Array.from({ length: emptyStars }).map((_, i) => (
                    <Star
                        key={`empty-${i}`}
                        className={cn(
                            sizeClasses[size],
                            'text-gray-300 dark:text-gray-600 transition-transform',
                            interactive && 'cursor-pointer hover:scale-110 hover:text-yellow-400'
                        )}
                        onClick={() => handleClick(fullStars + (hasHalfStar ? 1 : 0) + i)}
                        onKeyDown={(e) => handleKeyDown(e, fullStars + (hasHalfStar ? 1 : 0) + i)}
                        tabIndex={interactive ? 0 : undefined}
                        role={interactive ? 'button' : undefined}
                        aria-label={
                            interactive
                                ? `Rate ${fullStars + (hasHalfStar ? 1 : 0) + i + 1} stars`
                                : undefined
                        }
                    />
                ))}
            </div>

            {/* Rating number */}
            {showNumber && (
                <span className={cn('font-medium', textSizeClasses[size])}>
                    {rating.toFixed(1)}
                </span>
            )}

            {/* Review count */}
            {showCount && count > 0 && (
                <span className={cn('text-muted-foreground', textSizeClasses[size])}>
                    ({count.toLocaleString()})
                </span>
            )}
        </div>
    );
}

// Interactive star rating input component
interface StarRatingInputProps {
    value: number;
    onChange: (value: number) => void;
    size?: 'sm' | 'md' | 'lg';
    label?: string;
    required?: boolean;
    className?: string;
}

export function StarRatingInput({
    value,
    onChange,
    size = 'lg',
    label,
    required = false,
    className,
}: StarRatingInputProps) {
    return (
        <div className={cn('space-y-2', className)}>
            {label && (
                <label className="text-sm font-medium">
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </label>
            )}
            <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        className={cn(
                            'transition-all duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded',
                            sizeClasses[size]
                        )}
                        aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                    >
                        <Star
                            className={cn(
                                size === 'lg' ? 'h-8 w-8' : sizeClasses[size],
                                star <= value
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
                            )}
                        />
                    </button>
                ))}
                {value > 0 && (
                    <span className="ml-2 text-sm text-muted-foreground">
                        {value === 1 && 'Poor'}
                        {value === 2 && 'Fair'}
                        {value === 3 && 'Good'}
                        {value === 4 && 'Very Good'}
                        {value === 5 && 'Excellent'}
                    </span>
                )}
            </div>
        </div>
    );
}

export default RatingStars;
