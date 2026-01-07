import { Suspense } from "react";
import { DoctorsHero } from "./doctors-hero";
import { DoctorsListing } from "./doctors-listing";
import { DoctorsSkeleton } from "./doctors-skeleton";

export default function DoctorsPage() {
   return (
    <div className="min-h-screen bg-background">
      <DoctorsHero />
      <Suspense fallback={<DoctorsSkeleton />}>
        <DoctorsListing />
      </Suspense>
    </div>
   );
 }