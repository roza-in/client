'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { format, startOfDay, parseISO } from 'date-fns';
import { Calendar, Clock, Video, Building2, ArrowRight, Loader2, CheckCircle2, Star, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConsultationFee, bookingApi, type TimeSlot } from '@/features/appointments';
import { useFamilyMembers } from '@/features/patients';
import { useUser } from '@/store';
import { fetchDoctor, type PublicDoctor } from '@/lib/api/public';
import { PatientSelector } from '@/components/appointments/patient-selector';
import { SlotPicker } from '@/components/appointments/slot-picker';
import { Button } from '@/components/ui/button';
// useRazorpay removed
import { LoadingSpinner } from '@/components/shared';
import { toast } from '@/hooks/use-toast';

export default function BookingDetailsPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const doctorId = params.id as string;

    // Auth & User State
    const user = useUser();

    // Page State
    const [doctor, setDoctor] = useState<PublicDoctor | null>(null);
    const [consultationType, setConsultationType] = useState<'in_person' | 'video'>('in_person');
    const [selectedDate, setSelectedDate] = useState<Date>(
        searchParams.get('date') ? parseISO(searchParams.get('date')!) : startOfDay(new Date())
    );
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [patientId, setPatientId] = useState<string | 'self'>('self');
    const [isBooking, setIsBooking] = useState(false);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);

    // Initial Data Fetch
    useEffect(() => {
        const loadDoctor = async () => {
            try {
                const data = await fetchDoctor(doctorId);
                if (data) setDoctor(data);
            } catch (error) {
                toast.error("Failed to load doctor details");
            } finally {
                setIsLoadingInitial(false);
            }
        };
        loadDoctor();
    }, [doctorId]);

    // Map video to online for API
    const apiConsultationType = consultationType === 'video' ? 'online' : consultationType;

    const { data: familyMembers = [] } = useFamilyMembers();
    const { data: feeData } = useConsultationFee(doctor ? {
        doctorId,
        consultationType: apiConsultationType as any,
        hospitalId: doctor.hospital?.id
    } : null);

    // Pre-select slot from URL if available
    useEffect(() => {
        const time = searchParams.get('time');
        if (time && !selectedSlot && !isLoadingInitial) {
            setSelectedSlot({
                time,
                endTime: '',
                available: true
            } as any);
        }
    }, [searchParams, isLoadingInitial, selectedSlot]);

    const handleBooking = async () => {
        if (!selectedDate || !selectedSlot) {
            toast.error("Please select a time slot");
            return;
        }

        setIsBooking(true);
        try {
            const bookingData = {
                doctorId,
                hospitalId: doctor?.hospital?.id || '',
                appointmentDate: format(selectedDate, 'yyyy-MM-dd'),
                startTime: selectedSlot.time,
                consultationType: apiConsultationType as any,
                familyMemberId: patientId === 'self' ? undefined : patientId,
                patientName: user?.name || '',
                patientPhone: user?.phone || '',
            };

            const response = await bookingApi.executeBookingFlow(bookingData);

            if (response.success) {
                if (response.requiresPayment) {
                    toast.success("Booking initiated. Proceeding to payment...");
                    router.push(`/patient/book/payment/${response.appointment?.id}`);
                } else {
                    toast.success("Appointment booked successfully!");
                    router.push(`/patient/book/success/${response.appointment?.id}`);
                }
            } else {
                toast.error(response.error || "Booking failed");
            }
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setIsBooking(false);
        }
    };

    if (isLoadingInitial) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-muted-foreground">Loading booking details...</p>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="p-8 text-center bg-card rounded-xl border">
                <h1 className="text-xl font-bold">Doctor Not Found</h1>
                <p className="text-muted-foreground mt-2">The doctor profile you're looking for doesn't exist.</p>
                <button onClick={() => router.back()} className="mt-6 text-primary font-medium hover:underline">Go Back</button>
            </div>
        );
    }

    const consultationFee = feeData?.consultationFee ||
        (consultationType === 'video' ? doctor.consultation_fee_online : doctor.consultation_fee_in_person) || 0;

    return (
        <div className="space-y-6">
            {/* Header with CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Complete Your Booking</h1>
                    <p className="text-muted-foreground text-sm">
                        Appointment with Dr. {doctor.name}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs text-muted-foreground">Consultation Fee</p>
                        <p className="text-xl font-bold text-primary">₹{consultationFee}</p>
                    </div>
                    <button
                        onClick={handleBooking}
                        disabled={isBooking || !selectedSlot}
                        className={cn(
                            "px-6 py-3 rounded-xl flex items-center gap-2 transition-all",
                            "bg-primary hover:bg-primary/90 text-primary-foreground",
                            "font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                    >
                        {isBooking ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <p>Booking...</p>
                            </div>
                        ) : (
                            <>
                                Proceed to Payment
                                <ArrowRight className="h-5 w-5" />
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Layout: Left = Doctor Info + Summary | Right = Booking Steps */}
            <div className="grid lg:grid-cols-3 gap-6">

                {/* Left Sidebar - Doctor Card & Summary */}
                <div className="space-y-4 lg:order-1">
                    {/* Doctor Card */}
                    <div className="bg-card rounded-xl border p-4">
                        <div className="flex gap-4">
                            {doctor.avatar_url ? (
                                <img
                                    src={doctor.avatar_url}
                                    alt={doctor.name}
                                    className="h-16 w-16 rounded-xl object-cover"
                                />
                            ) : (
                                <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                                    {doctor.name?.charAt(0) || 'D'}
                                </div>
                            )}
                            <div className="min-w-0">
                                <h3 className="font-semibold truncate">Dr. {doctor.name}</h3>
                                <p className="text-sm text-primary">
                                    {typeof doctor.specialization === 'object'
                                        ? doctor.specialization?.name
                                        : doctor.specialization || 'General'}
                                </p>
                                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                    <span>{doctor.rating?.toFixed(1) || '4.5'}</span>
                                    <span>•</span>
                                    <span>{doctor.experience_years} yrs</span>
                                </div>
                            </div>
                        </div>
                        {doctor.hospital && (
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span className="truncate">{doctor.hospital.name}</span>
                            </div>
                        )}
                    </div>

                    {/* Appointment Summary */}
                    <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                        <h4 className="font-medium text-sm">Your Selection</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    {consultationType === 'video' ? <Video className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                                    Type
                                </span>
                                <span className="font-medium">{consultationType === 'video' ? 'Video Call' : 'In-Clinic'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Date
                                </span>
                                <span className="font-medium">{format(selectedDate, 'MMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Time
                                </span>
                                <span className="font-medium">{selectedSlot ? selectedSlot.time : 'Not selected'}</span>
                            </div>
                        </div>
                        <div className="pt-3 border-t flex items-center justify-between">
                            <span className="font-medium">Total</span>
                            <span className="text-xl font-bold text-primary">₹{consultationFee}</span>
                        </div>
                    </div>

                    {/* Mobile CTA */}
                    <div className="sm:hidden">
                        <button
                            onClick={handleBooking}
                            disabled={isBooking || !selectedSlot}
                            className={cn(
                                "w-full py-4 rounded-xl flex items-center justify-center gap-2",
                                "bg-primary hover:bg-primary/90 text-primary-foreground",
                                "font-semibold disabled:opacity-50"
                            )}
                        >
                            {isBooking ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>Proceed to Payment</>
                            )}
                        </button>
                    </div>
                </div>

                {/* Right Side - Booking Steps */}
                <div className="lg:col-span-2 space-y-6 lg:order-2">

                    {/* Consultation Type */}
                    <section className="bg-card rounded-xl border p-5">
                        <h2 className="font-semibold mb-4 flex items-center gap-2">
                            <span className="h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">1</span>
                            Consultation Mode
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setConsultationType('in_person')}
                                className={cn(
                                    "flex items-center gap-3 p-4 rounded-lg border-2 transition-all",
                                    consultationType === 'in_person'
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-primary/40"
                                )}
                            >
                                <div className={cn(
                                    "h-10 w-10 rounded-lg flex items-center justify-center",
                                    consultationType === 'in_person' ? "bg-primary text-white" : "bg-muted"
                                )}>
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-medium">In-Clinic</p>
                                    <p className="text-xs text-muted-foreground">Visit hospital</p>
                                </div>
                                {consultationType === 'in_person' && <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />}
                            </button>

                            <button
                                onClick={() => setConsultationType('video')}
                                className={cn(
                                    "flex items-center gap-3 p-4 rounded-lg border-2 transition-all",
                                    consultationType === 'video'
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-primary/40"
                                )}
                            >
                                <div className={cn(
                                    "h-10 w-10 rounded-lg flex items-center justify-center",
                                    consultationType === 'video' ? "bg-primary text-white" : "bg-muted"
                                )}>
                                    <Video className="h-5 w-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-medium">Video Call</p>
                                    <p className="text-xs text-muted-foreground">Online consult</p>
                                </div>
                                {consultationType === 'video' && <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />}
                            </button>
                        </div>
                    </section>

                    {/* Date & Time Selection */}
                    <section className="bg-card rounded-xl border p-5">
                        <h2 className="font-semibold mb-4 flex items-center gap-2">
                            <span className="h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">2</span>
                            Select Date & Time
                        </h2>
                        <SlotPicker
                            doctorId={doctorId}
                            hospitalId={doctor.hospital?.id}
                            consultationType={consultationType}
                            selectedDate={selectedDate}
                            selectedSlot={selectedSlot}
                            onDateChange={(date) => {
                                setSelectedDate(date);
                                setSelectedSlot(null);
                            }}
                            onSlotChange={setSelectedSlot}
                        />
                    </section>

                    {/* Patient Selection */}
                    <section className="bg-card rounded-xl border p-5">
                        <h2 className="font-semibold mb-4 flex items-center gap-2">
                            <span className="h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">3</span>
                            Patient Details
                        </h2>
                        <PatientSelector
                            familyMembers={familyMembers}
                            selectedId={patientId}
                            onSelect={setPatientId}
                        />
                    </section>
                </div>
            </div>
        </div>
    );
}
