'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full bg-muted',
  {
    variants: {
      size: {
        default: 'h-10 w-10',
        xs: 'h-6 w-6',
        sm: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
        '2xl': 'h-20 w-20',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string | null;
  alt?: string;
  fallback?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, alt, fallback, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    const initials = fallback
      ? getInitials(fallback)
      : alt
        ? getInitials(alt)
        : '?';

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt || 'Avatar'}
            className="aspect-square h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-medium">
            <span
              className={cn(
                size === 'xs' && 'text-[10px]',
                size === 'sm' && 'text-xs',
                size === 'default' && 'text-sm',
                size === 'lg' && 'text-base',
                size === 'xl' && 'text-lg',
                size === '2xl' && 'text-xl'
              )}
            >
              {initials}
            </span>
          </div>
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';

export { Avatar, avatarVariants };
