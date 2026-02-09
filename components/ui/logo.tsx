import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
    variant?: 'default' | 'icon';
    className?: string;
    width?: number;
    height?: number;
}

export function Logo({ variant = 'default', className, width, height }: LogoProps) {
    const lightLogo = variant === 'icon' ? '/logo/rozx-light-small-logo.svg' : '/logo/rozx-light-logo.svg';
    const darkLogo = variant === 'icon' ? '/logo/rozx-dark-small-logo.svg' : '/logo/rozx-dark-logo.svg';

    // Default dimensions if not provided
    const defaultWidth = variant === 'icon' ? 32 : 120;
    const defaultHeight = variant === 'icon' ? 32 : 40;

    const w = width || defaultWidth;
    const h = height || defaultHeight;

    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            <Image
                src={lightLogo}
                alt="Rozx Logo"
                width={w}
                height={h}
                className="dark:hidden h-full w-auto object-contain"
                priority
            />
            <Image
                src={darkLogo}
                alt="Rozx Logo"
                width={w}
                height={h}
                className="hidden dark:block h-full w-auto object-contain"
                priority
            />
        </div>
    );
}
