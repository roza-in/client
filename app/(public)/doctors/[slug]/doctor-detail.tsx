'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  Phone,
  Mail,
  Globe,
  ArrowLeft,
  BadgeCheck,
  Stethoscope,
  GraduationCap,
  Calendar,
  IndianRupee,
  Building2,
  Users,
  ChevronRight,
} from 'lucide-react';

// Mock data for hospital detail
const mockHospital = {
  id: '1',
  name: 'Apollo Hospital',
  slug: 'apollo-hospital-delhi',
  description: 'Apollo Hospitals is a leading healthcare provider with world-class facilities and expert medical professionals. We offer comprehensive healthcare services with a patient-first approach.',
  address: 'Sarita Vihar, Delhi, 110076',
  city: 'Delhi',
  state: 'Delhi',
  phone: '+91 11 2692 5858',
  email: 'info@apollohospitals.com',
  website: 'https://www.apollohospitals.com',
  image: '/hospitals/apollo.jpg',
  rating: 4.8,
  reviewCount: 245,
  isVerified: true,
  isOpen: true,
  openTime: '24/7 Emergency',
  facilities: ['Emergency Services', 'ICU', 'Laboratory', 'Pharmacy', 'Parking', 'Cafeteria', 'Ambulance'],
  specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'Gastroenterology', 'Pediatrics'],
};

const mockDoctors = [
  {
    id: '1',
    name: 'Dr. Rajesh Sharma',
    specialty: 'Cardiology',
    qualification: 'MBBS, MD, DM (Cardiology)',
    experience: 15,
    rating: 4.9,
    reviewCount: 89,
    consultationFee: 800,
    image: '/doctors/1.jpg',
    availableToday: true,
    nextAvailable: 'Today, 2:30 PM',
  },
  {
    id: '2',
    name: 'Dr. Priya Verma',
    specialty: 'Neurology',
    qualification: 'MBBS, MD, DM (Neurology)',
    experience: 12,
    rating: 4.8,
    reviewCount: 67,
    consultationFee: 750,
    image: '/doctors/2.jpg',
    availableToday: true,
    nextAvailable: 'Today, 4:00 PM',
  },
  {
    id: '3',
    name: 'Dr. Amit Kumar',
    specialty: 'Orthopedics',
    qualification: 'MBBS, MS (Orthopedics)',
    experience: 18,
    rating: 4.7,
    reviewCount: 112,
    consultationFee: 600,
    image: '/doctors/3.jpg',
    availableToday: false,
    nextAvailable: 'Tomorrow, 10:00 AM',
  },
  {
    id: '4',
    name: 'Dr. Sunita Patel',
    specialty: 'Oncology',
    qualification: 'MBBS, MD, DM (Medical Oncology)',
    experience: 14,
    rating: 4.9,
    reviewCount: 78,
    consultationFee: 900,
    image: '/doctors/4.jpg',
    availableToday: true,
    nextAvailable: 'Today, 5:30 PM',
  },
];

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
];

interface HospitalDetailProps {
  slug: string;
}

export function HospitalDetail({ slug }: HospitalDetailProps) {
  const hospital = mockHospital;
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDoctors = mockDoctors.filter((doctor) => {
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  return (
    <>
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/hospitals" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Back to Hospitals</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hospital Header */}
      <section className="bg-muted/30 py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Hospital Image */}
            <div className="relative w-full lg:w-80 h-48 lg:h-56 bg-muted rounded-xl overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <Building2 className="h-20 w-20 text-muted-foreground/50" />
              </div>
            </div>

            {/* Hospital Info */}
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{hospital.name}</h1>
                {hospital.isVerified && (
                  <Badge className="bg-green-500 hover:bg-green-600">
                    <BadgeCheck className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>

              <p className="text-muted-foreground mb-4 max-w-2xl">{hospital.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{hospital.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{hospital.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{hospital.openTime}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
                  <Star className="h-5 w-5 text-primary fill-primary" />
                  <span className="font-semibold text-primary">{hospital.rating}</span>
                  <span className="text-muted-foreground text-sm">({hospital.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Stethoscope className="h-4 w-4" />
                  <span>{mockDoctors.length} Doctors</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{hospital.specialties.length} Specialties</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="doctors" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
              <TabsTrigger value="doctors">Doctors</TabsTrigger>
              <TabsTrigger value="facilities">Facilities</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="doctors" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="text"
                  placeholder="Search doctors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-xs"
                />
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    {hospital.specialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Doctors List */}
              <div className="grid gap-4">
                {filteredDoctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} hospitalName={hospital.name} />
                ))}
              </div>

              {filteredDoctors.length === 0 && (
                <div className="text-center py-12">
                  <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No doctors found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="facilities" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {hospital.facilities.map((facility) => (
                  <div
                    key={facility}
                    className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <BadgeCheck className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">{facility}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <div className="text-center py-12">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Reviews coming soon</h3>
                <p className="text-muted-foreground">Patient reviews will be available here</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
}

interface DoctorCardProps {
  doctor: {
    id: string;
    name: string;
    specialty: string;
    qualification: string;
    experience: number;
    rating: number;
    reviewCount: number;
    consultationFee: number;
    availableToday: boolean;
    nextAvailable: string;
  };
  hospitalName: string;
}

function DoctorCard({ doctor, hospitalName }: DoctorCardProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      value: date.toISOString().split('T')[0],
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
      full: date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }),
    };
  });

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Doctor Info */}
          <div className="flex gap-4 flex-1">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <Stethoscope className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{doctor.name}</h3>
              <p className="text-primary font-medium">{doctor.specialty}</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <GraduationCap className="h-4 w-4" />
                <span>{doctor.qualification}</span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-primary fill-primary" />
                  <span className="text-sm font-medium">{doctor.rating}</span>
                  <span className="text-xs text-muted-foreground">({doctor.reviewCount})</span>
                </div>
                <span className="text-sm text-muted-foreground">{doctor.experience} years exp.</span>
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="flex flex-col items-end gap-3 min-w-[200px]">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Consultation Fee</div>
              <div className="text-xl font-semibold text-foreground">₹{doctor.consultationFee}</div>
            </div>
            <div className="flex items-center gap-2">
              {doctor.availableToday ? (
                <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                  Available Today
                </Badge>
              ) : (
                <Badge variant="secondary">{doctor.nextAvailable}</Badge>
              )}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Book Appointment</DialogTitle>
                  <DialogDescription>
                    {doctor.name} • {doctor.specialty} • {hospitalName}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Date Selection */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">
                      Select Date
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {dates.map((date) => (
                        <Button
                          key={date.value}
                          variant={selectedDate === date.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedDate(date.value)}
                          className="flex flex-col h-auto py-2"
                        >
                          <span className="text-xs">{date.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slot Selection */}
                  {selectedDate && (
                    <div>
                      <label className="text-sm font-medium text-foreground mb-3 block">
                        Select Time Slot
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot}
                            variant={selectedSlot === slot ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedSlot(slot)}
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Booking Summary */}
                  {selectedDate && selectedSlot && (
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <h4 className="font-medium text-foreground">Booking Summary</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Doctor: {doctor.name}</p>
                        <p>Date: {dates.find(d => d.value === selectedDate)?.full}</p>
                        <p>Time: {selectedSlot}</p>
                        <p className="font-medium text-foreground">Fee: ₹{doctor.consultationFee}</p>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    size="lg"
                    disabled={!selectedDate || !selectedSlot}
                  >
                    <Link href="/login" className="flex items-center">
                      Confirm Booking
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    You&apos;ll need to login to complete the booking
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
