'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MapPin,
  Star,
  Clock,
  Users,
  Stethoscope,
  Phone,
  ChevronLeft,
  ChevronRight,
  Building2,
  BadgeCheck,
} from 'lucide-react';

// Mock hospital data
const mockHospitals = [
  {
    id: '1',
    name: 'Apollo Hospital',
    slug: 'apollo-hospital-delhi',
    address: 'Sarita Vihar, Delhi',
    city: 'Delhi',
    state: 'Delhi',
    image: '/hospitals/apollo.jpg',
    rating: 4.8,
    reviewCount: 245,
    doctorCount: 45,
    specialties: ['Cardiology', 'Neurology', 'Orthopedics'],
    isVerified: true,
    isOpen: true,
    openTime: '24/7 Emergency',
    consultationFee: 500,
    description: 'Apollo Hospitals is a leading healthcare provider with world-class facilities and expert medical professionals.',
  },
  {
    id: '2',
    name: 'Max Super Speciality Hospital',
    slug: 'max-hospital-saket',
    address: 'Saket, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    image: '/hospitals/max.jpg',
    rating: 4.7,
    reviewCount: 189,
    doctorCount: 38,
    specialties: ['Oncology', 'Gastroenterology', 'Pulmonology'],
    isVerified: true,
    isOpen: true,
    openTime: '24/7 Emergency',
    consultationFee: 600,
    description: 'Max Healthcare is among the largest hospital networks in India providing quality healthcare services.',
  },
  {
    id: '3',
    name: 'Fortis Hospital',
    slug: 'fortis-hospital-gurgaon',
    address: 'Sector 44, Gurgaon',
    city: 'Gurgaon',
    state: 'Haryana',
    image: '/hospitals/fortis.jpg',
    rating: 4.6,
    reviewCount: 167,
    doctorCount: 32,
    specialties: ['Cardiology', 'Nephrology', 'Urology'],
    isVerified: true,
    isOpen: true,
    openTime: '8:00 AM - 10:00 PM',
    consultationFee: 550,
    description: 'Fortis Healthcare Limited is a leading integrated healthcare delivery service provider in India.',
  },
  {
    id: '4',
    name: 'AIIMS Delhi',
    slug: 'aiims-delhi',
    address: 'Ansari Nagar, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    image: '/hospitals/aiims.jpg',
    rating: 4.9,
    reviewCount: 523,
    doctorCount: 120,
    specialties: ['All Specialties', 'Research', 'Teaching'],
    isVerified: true,
    isOpen: true,
    openTime: '24/7',
    consultationFee: 100,
    description: 'All India Institute of Medical Sciences is the premier medical college and hospital in India.',
  },
  {
    id: '5',
    name: 'Medanta The Medicity',
    slug: 'medanta-gurgaon',
    address: 'Sector 38, Gurgaon',
    city: 'Gurgaon',
    state: 'Haryana',
    image: '/hospitals/medanta.jpg',
    rating: 4.7,
    reviewCount: 312,
    doctorCount: 68,
    specialties: ['Cardiac Surgery', 'Neurosurgery', 'Transplants'],
    isVerified: true,
    isOpen: true,
    openTime: '24/7 Emergency',
    consultationFee: 800,
    description: 'Medanta is one of the largest multi-super specialty institutes in India.',
  },
  {
    id: '6',
    name: 'Sir Ganga Ram Hospital',
    slug: 'sir-ganga-ram-hospital',
    address: 'Rajinder Nagar, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    image: '/hospitals/gangaram.jpg',
    rating: 4.5,
    reviewCount: 278,
    doctorCount: 54,
    specialties: ['General Surgery', 'Pediatrics', 'Obstetrics'],
    isVerified: true,
    isOpen: true,
    openTime: '24/7',
    consultationFee: 400,
    description: 'Sir Ganga Ram Hospital is a multi-specialty hospital in New Delhi, India.',
  },
];

export function HospitalsListing() {
  const [hospitals, setHospitals] = useState(mockHospitals);
  const [sortBy, setSortBy] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const hospitalsPerPage = 6;

  // Pagination
  const totalPages = Math.ceil(hospitals.length / hospitalsPerPage);
  const startIndex = (currentPage - 1) * hospitalsPerPage;
  const displayedHospitals = hospitals.slice(startIndex, startIndex + hospitalsPerPage);

  // Sort hospitals
  useEffect(() => {
    const sorted = [...mockHospitals].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        case 'doctors':
          return b.doctorCount - a.doctorCount;
        case 'fee-low':
          return a.consultationFee - b.consultationFee;
        case 'fee-high':
          return b.consultationFee - a.consultationFee;
        default:
          return 0;
      }
    });
    setHospitals(sorted);
  }, [sortBy]);

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {hospitals.length} Hospitals Found
            </h2>
            <p className="text-muted-foreground text-sm">
              Showing verified hospitals near you
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-45">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
                <SelectItem value="doctors">Most Doctors</SelectItem>
                <SelectItem value="fee-low">Fee: Low to High</SelectItem>
                <SelectItem value="fee-high">Fee: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Hospital Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedHospitals.map((hospital) => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="icon"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

interface HospitalCardProps {
  hospital: {
    id: string;
    name: string;
    slug: string;
    address: string;
    city: string;
    image: string;
    rating: number;
    reviewCount: number;
    doctorCount: number;
    specialties: string[];
    isVerified: boolean;
    isOpen: boolean;
    openTime: string;
    consultationFee: number;
    description: string;
  };
}

function HospitalCard({ hospital }: HospitalCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Hospital Image */}
      <div className="relative h-48 bg-muted">
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Building2 className="h-16 w-16 text-muted-foreground/50" />
        </div>
        {hospital.isVerified && (
          <div className="absolute top-3 right-3 z-20">
            <Badge className="bg-green-500 hover:bg-green-600">
              <BadgeCheck className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          </div>
        )}
        <div className="absolute bottom-3 left-3 z-20">
          <Badge variant={hospital.isOpen ? 'default' : 'secondary'}>
            <Clock className="h-3 w-3 mr-1" />
            {hospital.openTime}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {hospital.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {hospital.address}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded">
            <Star className="h-4 w-4 text-primary fill-primary" />
            <span className="font-medium text-primary">{hospital.rating}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Stethoscope className="h-4 w-4" />
            <span>{hospital.doctorCount} Doctors</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{hospital.reviewCount} Reviews</span>
          </div>
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1">
          {hospital.specialties.slice(0, 3).map((specialty) => (
            <Badge key={specialty} variant="outline" className="text-xs">
              {specialty}
            </Badge>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div>
            <span className="text-sm text-muted-foreground">From </span>
            <span className="text-lg font-semibold text-foreground">
              ₹{hospital.consultationFee}
            </span>
          </div>
          <Link href={`/hospitals/${hospital.slug}`}>
            <Button>Book Now</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
