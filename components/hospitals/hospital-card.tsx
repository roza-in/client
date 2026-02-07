/**
 * Hospital Components - Hospital Card
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Star, MapPin, Building2, Users, Phone, ChevronRight } from 'lucide-react';
import { routes } from '@/config';
import type { HospitalListItem } from '@/types';

interface HospitalCardProps {
    hospital: any; // Using any to bridge the gap between UI and API models
    variant?: 'default' | 'compact';
    className?: string;
}

export function HospitalCard({ hospital, variant = 'default', className }: HospitalCardProps) {
    const slug = hospital.slug || hospital.id;
    const name = hospital.name;
    const location = `${hospital.city}, ${hospital.state}`;
    const image = hospital.coverImageUrl || hospital.logoUrl || hospital.image;
    const rating = hospital.rating || 0;
    const totalRatings = hospital.totalRatings || 0;
    const doctorCount = hospital.totalDoctors || hospital.doctorCount || 0;

    if (variant === 'compact') {
        return (
            <Link
                href={routes.public.hospitalBySlug(slug)}
                className={cn(
                    'flex items-center gap-3 rounded-lg border p-3 hover:bg-muted transition-colors',
                    className
                )}
            >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                        {location}
                    </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
        );
    }

    return (
        <Link
            href={routes.public.hospitalBySlug(slug)}
            className={cn(
                'group block rounded-xl border overflow-hidden hover:shadow-lg transition-all',
                className
            )}
        >
            {/* Image */}
            <div className="relative h-40 bg-linear-to-br from-primary/20 to-primary/5">
                {image ? (
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <Building2 className="h-16 w-16 text-primary/50" />
                    </div>
                )}
                {hospital.verificationStatus === 'verified' && (
                    <span className="absolute top-3 right-3 rounded-full bg-green-500 px-2 py-1 text-xs text-white">
                        Verified
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">
                    {name}
                </h3>
                <p className="text-sm text-primary font-medium capitalize">
                    {hospital.type?.replace('_', ' ')}
                </p>

                {/* Location */}
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{location}</span>
                </div>

                {/* Stats */}
                <div className="mt-4 flex items-center gap-4 text-sm">
                    {rating > 0 && (
                        <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{rating.toFixed(1)}</span>
                            {totalRatings > 0 && <span className="text-muted-foreground">({totalRatings})</span>}
                        </span>
                    )}
                    {doctorCount > 0 && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            {doctorCount} Doctors
                        </span>
                    )}
                </div>

                {/* Specialties */}
                {hospital.specialties && hospital.specialties.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                        {hospital.specialties.slice(0, 3).map((spec: string) => (
                            <span
                                key={spec}
                                className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                            >
                                {spec}
                            </span>
                        ))}
                        {hospital.specialties.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                                +{hospital.specialties.length - 3} more
                            </span>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
}

export default HospitalCard;

