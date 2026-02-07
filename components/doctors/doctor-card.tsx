/**
 * Doctor Components - Doctor Card
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Star, MapPin, Clock, Video, Building2, ChevronRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { routes } from '@/config';
import type { DoctorListItem, DoctorCard as DoctorCardType } from '@/types';

interface DoctorCardProps {
    doctor: any; // Using any temporarily to bridge the gap between UI and API models
    variant?: 'default' | 'compact' | 'horizontal';
    className?: string;
}

export function DoctorCard({ doctor, variant = 'default', className }: DoctorCardProps) {
    const name = doctor.name || 'Unknown Doctor';
    const avatar = doctor.profilePictureUrl || doctor.avatar_url || doctor.avatar;
    // Handle specialization as either object {id, name, slug} or string
    const specialization = typeof doctor.specialization === 'object'
        ? doctor.specialization?.name
        : doctor.specialization;
    const qualification = doctor.qualification || doctor.qualifications?.join(', ');
    const rating = doctor.rating || 0;
    const experience = doctor.experienceYears || doctor.experience_years || doctor.experience || 0;
    const fee = doctor.consultationFee || doctor.consultation_fee_online || doctor.consultation_fee_in_person || 0;
    const slug = doctor.slug || doctor.id;

    const initials = name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase();

    if (variant === 'compact') {
        return (
            <Link
                href={routes.public.doctorBySlug(slug)}
                className={cn(
                    'flex items-center gap-3 rounded-lg border p-3 hover:bg-muted transition-colors',
                    className
                )}
            >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-primary/10">
                    {avatar ? (
                        <Image src={avatar} alt={name} fill className="object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-medium text-primary">
                            {initials}
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">Dr. {name}</p>
                    <p className="text-sm text-muted-foreground truncate">{specialization}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
        );
    }

    if (variant === 'horizontal') {
        return (
            <Link
                href={routes.public.doctorBySlug(slug)}
                className={cn(
                    'flex gap-4 rounded-xl border p-4 hover:shadow-md transition-shadow',
                    className
                )}
            >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-primary/10">
                    {avatar ? (
                        <Image src={avatar} alt={name} fill className="object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-2xl font-medium text-primary">
                            {initials}
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg">Dr. {name}</h3>
                    <p className="text-sm text-primary">{specialization}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{qualification}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                        <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {rating?.toFixed(1) || 'New'}
                        </span>
                        <span className="text-muted-foreground">
                            {experience}+ yrs exp
                        </span>
                        <span className="font-medium text-primary">
                            {formatCurrency(fee)}
                        </span>
                    </div>
                </div>
            </Link>
        );
    }

    // Default card
    return (
        <Link
            href={routes.public.doctorBySlug(slug)}
            className={cn(
                'group block rounded-xl border p-4 hover:shadow-lg transition-all',
                className
            )}
        >
            {/* Header */}
            <div className="flex items-start gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-linear-to-br from-primary/20 to-primary/10">
                    {avatar ? (
                        <Image src={avatar} alt={name} fill className="object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-2xl font-medium text-primary">
                            {initials}
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        Dr. {name}
                    </h3>
                    <p className="text-sm text-primary font-medium">{specialization}</p>
                    <p className="text-sm text-muted-foreground truncate">{qualification}</p>
                </div>
            </div>

            {/* Stats */}
            <div className="mt-4 flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{rating?.toFixed(1) || 'New'}</span>
                    {doctor.totalRatings && (
                        <span className="text-muted-foreground">({doctor.totalRatings})</span>
                    )}
                </span>
                <span className="text-muted-foreground">
                    {experience}+ years experience
                </span>
            </div>

            {/* Location */}
            {(doctor.hospitalName || doctor.hospital?.name) && (
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span className="truncate">{doctor.hospitalName || doctor.hospital?.name}</span>
                </div>
            )}

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                    {doctor.availableForVideo && (
                        <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            <Video className="h-3 w-3" />
                            Video
                        </span>
                    )}
                    <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                        <Clock className="h-3 w-3" />
                        Available
                    </span>
                </div>
                <span className="font-semibold text-lg">
                    {formatCurrency(fee)}
                </span>
            </div>
        </Link>
    );
}

export default DoctorCard;

