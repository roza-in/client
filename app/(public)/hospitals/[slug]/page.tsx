import { Suspense } from 'react';
import { HospitalDetail } from './hospital-detail';
import { HospitalDetailSkeleton } from './hospital-detail-skeleton';

export const metadata = {
  title: 'Hospital Details | ROZX',
  description: 'View hospital details and book appointments with top doctors.',
};

interface HospitalDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function HospitalDetailPage({ params }: HospitalDetailPageProps) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<HospitalDetailSkeleton />}>
        <HospitalDetail slug={slug} />
      </Suspense>
    </div>
  );
}
