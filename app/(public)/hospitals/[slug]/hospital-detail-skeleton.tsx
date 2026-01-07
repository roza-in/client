import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function HospitalDetailSkeleton() {
  return (
    <>
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </div>
      </header>

      {/* Hospital Header Skeleton */}
      <section className="bg-muted/30 py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <Skeleton className="w-full lg:w-80 h-48 lg:h-56 rounded-xl" />
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-20 w-full max-w-2xl" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-32 rounded-lg" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-28" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-full max-w-md mb-8" />
          
          <div className="flex gap-4 mb-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-[200px]" />
          </div>

          <div className="grid gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <DoctorCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function DoctorCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex gap-4 flex-1">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-64" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="text-right space-y-1">
              <Skeleton className="h-4 w-24 ml-auto" />
              <Skeleton className="h-6 w-16 ml-auto" />
            </div>
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
