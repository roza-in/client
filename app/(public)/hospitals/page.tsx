import { Suspense } from 'react';
import { HospitalsListing } from './hospitals-listing';
import { HospitalsHero } from './hospitals-hero';
import { HospitalsSkeleton } from './hospitals-skeleton';

export const metadata = {
  title: 'Find Hospitals | ROZX',
  description: 'Search and discover hospitals near you. Book appointments with top doctors in India.',
};

export default function HospitalsPage() {
  return (
    <div className="min-h-screen bg-background">
      <HospitalsHero />
      <Suspense fallback={<HospitalsSkeleton />}>
        <HospitalsListing />
      </Suspense>
    </div>
  );
}
