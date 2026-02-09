'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Search, Calendar, Clock, CreditCard, User, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/config';
import { useDoctors } from '@/features/doctors/hooks/use-doctors';
import { useAvailableSlots } from '@/features/appointments/hooks/use-available-slots';
import { LoadingSpinner } from '@/components/shared';
import { useWalkInBooking, usePatientSearch, type WalkInBookingInput } from '@/features/reception';

export default function WalkinBookingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // URL Parameters
    const urlPatientId = searchParams.get('patientId');
    const urlPatientName = searchParams.get('patientName');
    const urlPatientPhone = searchParams.get('patientPhone');

    const [step, setStep] = useState(1);
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
    const [selectedSlot, setSelectedSlot] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isNewPatient, setIsNewPatient] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [patientDetails, setPatientDetails] = useState({
        name: '',
        phone: '',
        email: '',
        gender: 'male' as 'male' | 'female' | 'other',
    });
    const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

    const { data: doctorsData, isLoading: loadingDoctors } = useDoctors({});
    const { data: slotsData, isLoading: loadingSlots } = useAvailableSlots(
        selectedDoctor ? { doctorId: selectedDoctor.id, date: selectedDate, consultationType: 'in_person' } : null
    );
    const walkInMutation = useWalkInBooking();
    const patientSearch = usePatientSearch('');

    // Handle URL parameters for patient selection
    useEffect(() => {
        if (urlPatientId || urlPatientName || urlPatientPhone) {
            if (urlPatientId) {
                setSelectedPatient({
                    id: urlPatientId,
                    name: urlPatientName || '',
                    phone: urlPatientPhone || ''
                });
                setIsNewPatient(false);
            } else {
                setIsNewPatient(true);
            }

            setPatientDetails(prev => ({
                ...prev,
                name: urlPatientName || prev.name,
                phone: urlPatientPhone || prev.phone,
            }));
        }
    }, [urlPatientId, urlPatientName, urlPatientPhone]);

    const doctors = doctorsData?.doctors || [];
    const slots = slotsData?.slots || [];

    // Helper to get consultation fee for a doctor
    const getDoctorFee = (doctor: any) => {
        return Number(doctor?.consultation_fee_in_person) ||
            Number(doctor?.consultation_fee_walk_in) ||
            Number(doctor?.consultation_fee) ||
            Number(doctor?.consultationFeeInPerson) ||
            Number(doctor?.consultationFeeWalkIn) ||
            0;
    };

    const filteredDoctors = useMemo(() => {
        if (!searchQuery) return doctors;
        const query = searchQuery.toLowerCase();
        return doctors.filter((doc: any) => {
            const docName = doc.name?.toLowerCase() || '';
            // Handle specialization as either string or object
            const spec = typeof doc.specialization === 'string'
                ? doc.specialization.toLowerCase()
                : (doc.specialization?.name?.toLowerCase() || '');
            return docName.includes(query) || spec.includes(query);
        });
    }, [doctors, searchQuery]);

    // Format slots for display
    const formattedSlots = useMemo(() => {
        return slots.map((slot: any, idx: number) => ({
            id: slot.id || `slot-${idx}`,
            time: slot.time || 'N/A',
            startTime: slot.time,
            available: slot.available !== false,
        }));
    }, [slots]);

    const handlePatientSearch = (query: string) => {
        patientSearch.setQuery(query);
    };

    const handleSelectPatient = (patient: any) => {
        setSelectedPatient(patient);
        setPatientDetails({
            name: patient.name,
            phone: patient.phone || '',
            email: patient.email || '',
            gender: 'male',
        });
        setIsNewPatient(false);
    };

    const handleSubmit = async () => {
        if (!selectedDoctor || !selectedSlot) return;

        // Get consultation fee using helper
        const fee = getDoctorFee(selectedDoctor) || 500;

        // Create proper ISO timestamp for scheduledStart
        // selectedSlot.startTime is a time string like "09:00" or "14:30"
        const timeStr = selectedSlot.startTime || selectedSlot.time || '09:00';
        const scheduledStartISO = `${selectedDate}T${timeStr}:00`;

        const input: WalkInBookingInput = {
            doctorId: selectedDoctor.id,
            slotId: selectedSlot.id?.startsWith('slot-') ? undefined : selectedSlot.id, // Don't send generated IDs
            scheduledDate: selectedDate,
            scheduledStart: scheduledStartISO, // ISO format: 2026-01-29T09:00:00
            patient: {
                id: selectedPatient?.id,
                name: patientDetails.name,
                phone: patientDetails.phone,
                email: patientDetails.email || undefined,
                gender: patientDetails.gender,
            },
            consultationFee: fee,
            paymentMethod: 'cash',
        };

        walkInMutation.mutate(input, {
            onSuccess: () => {
                setBookingSuccess(true);
                // Navigate after a delay
                setTimeout(() => {
                    router.push(routes.reception?.queue || '/reception/queue');
                }, 3000);
            },
        });
    };

    // Success screen
    if (bookingSuccess) {
        return (
            <div className="flex h-96 flex-col items-center justify-center text-center">
                <div className="rounded-full bg-green-100 p-4 mb-4">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
                <p className="text-muted-foreground mb-4">
                    Patient: {patientDetails.name}<br />
                    Doctor: Dr. {selectedDoctor?.name}
                </p>
                <p className="text-sm text-muted-foreground">Redirecting to queue...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="">
                <h1 className="text-2xl font-bold">Walk-in Booking</h1>
                <p className="text-muted-foreground">Book appointment for walk-in patient</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-4 border-b pb-4 overflow-x-auto">
                {['Select Doctor', 'Select Time', 'Patient Details', 'Confirm'].map((label, idx) => (
                    <div key={label} className="flex items-center gap-2 shrink-0">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${step > idx + 1
                            ? 'bg-green-600 text-white'
                            : step === idx + 1
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                            }`}>
                            {idx + 1}
                        </div>
                        <span className={`text-sm ${step === idx + 1 ? 'font-medium' : 'text-muted-foreground'}`}>
                            {label}
                        </span>
                        {idx < 3 && <div className="h-px w-8 bg-border" />}
                    </div>
                ))}
            </div>

            {/* Step 1: Select Doctor */}
            {step === 1 && (
                <div className="space-y-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search doctor by name or specialization..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-lg border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {loadingDoctors ? (
                        <div className="flex h-48 items-center justify-center">
                            <LoadingSpinner />
                        </div>
                    ) : filteredDoctors.length === 0 ? (
                        <div className="rounded-xl border p-8 text-center text-muted-foreground">
                            No doctors found
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredDoctors.map((doctor: any) => (
                                <button
                                    key={doctor.id}
                                    onClick={() => {
                                        setSelectedDoctor(doctor);
                                        setStep(2);
                                    }}
                                    className={`rounded-xl border p-4 text-left hover:border-primary transition-colors ${selectedDoctor?.id === doctor.id ? 'border-primary bg-primary/5' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                                            {doctor.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'D'}
                                        </div>
                                        <div>
                                            <p className="font-medium">Dr. {doctor.name || 'Unknown'}</p>
                                            <p className="text-sm text-muted-foreground">{typeof doctor.specialization === 'string' ? doctor.specialization : doctor.specialization?.name || 'General'}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Walk-in Fee</span>
                                        <span className="font-medium">₹{getDoctorFee(doctor) || 'Free'}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Step 2: Select Time Slot */}
            {step === 2 && (
                <div className="space-y-4">
                    <div className="rounded-xl border p-4 bg-muted/30">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                                {selectedDoctor?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'D'}
                            </div>
                            <div>
                                <p className="font-medium">Dr. {selectedDoctor?.name}</p>
                                <p className="text-sm text-muted-foreground">{typeof selectedDoctor?.specialization === 'string' ? selectedDoctor?.specialization : selectedDoctor?.specialization?.name || 'General'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium">Date:</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="rounded-lg border px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <h3 className="font-medium mb-3 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Available Slots
                        </h3>
                        {loadingSlots ? (
                            <div className="flex h-24 items-center justify-center">
                                <LoadingSpinner />
                            </div>
                        ) : formattedSlots.length === 0 ? (
                            <div className="rounded-xl border p-8 text-center text-muted-foreground">
                                No available slots for this date
                            </div>
                        ) : (
                            <div className="grid gap-2 grid-cols-4 md:grid-cols-6">
                                {formattedSlots.map((slot: any, index: number) => (
                                    <button
                                        key={slot.id || `slot-${index}`}
                                        onClick={() => {
                                            if (slot.available) {
                                                setSelectedSlot(slot);
                                                setStep(3);
                                            }
                                        }}
                                        disabled={!slot.available}
                                        className={`rounded-lg border p-3 text-center text-sm transition-colors ${!slot.available
                                            ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                            : selectedSlot?.id === slot.id
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : 'hover:border-primary'
                                            }`}
                                    >
                                        {slot.time}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setStep(1)}
                        className="text-sm text-primary hover:underline"
                    >
                        ← Change doctor
                    </button>
                </div>
            )}

            {/* Step 3: Patient Details */}
            {step === 3 && (
                <div className="max-w-xl space-y-6">
                    {/* Patient Search */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsNewPatient(false)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${!isNewPatient ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                            >
                                <Search className="h-4 w-4" />
                                Existing Patient
                            </button>
                            <button
                                onClick={() => {
                                    setIsNewPatient(true);
                                    setSelectedPatient(null);
                                    setPatientDetails({ name: '', phone: '+91 ', email: '', gender: 'male' });
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${isNewPatient ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                            >
                                <User className="h-4 w-4" />
                                New Patient
                            </button>
                        </div>

                        {!isNewPatient && (
                            <div className="space-y-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search by phone or name..."
                                        value={patientSearch.query}
                                        onChange={(e) => handlePatientSearch(e.target.value)}
                                        className="w-full rounded-lg border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                {patientSearch.isLoading && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Searching...
                                    </div>
                                )}
                                {patientSearch.patients.length > 0 && (
                                    <div className="rounded-lg border divide-y max-h-48 overflow-y-auto">
                                        {patientSearch.patients.map((patient: any) => (
                                            <button
                                                key={patient.id}
                                                onClick={() => handleSelectPatient(patient)}
                                                className={`w-full p-3 text-left hover:bg-muted ${selectedPatient?.id === patient.id ? 'bg-primary/5' : ''}`}
                                            >
                                                <p className="font-medium">{patient.name}</p>
                                                <p className="text-sm text-muted-foreground">{patient.phone}</p>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Patient Form */}
                    {(isNewPatient || selectedPatient) && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Patient Name *</label>
                                <input
                                    type="text"
                                    value={patientDetails.name}
                                    onChange={(e) => setPatientDetails({ ...patientDetails, name: e.target.value })}
                                    disabled={!!selectedPatient}
                                    className="mt-1 w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                                    placeholder="Enter patient name"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Phone Number *</label>
                                <input
                                    type="tel"
                                    value={patientDetails.phone}
                                    onChange={(e) => {
                                        let val = e.target.value;
                                        // Ensure it always starts with +91 
                                        if (!val.startsWith('+91 ')) {
                                            // If they deleted part of it, restore it
                                            if (val.startsWith('+91')) {
                                                val = '+91 ' + val.slice(3).trim();
                                            } else {
                                                val = '+91 ' + val.replace(/^\+?91?\s?/, '').trim();
                                            }
                                        }
                                        setPatientDetails({ ...patientDetails, phone: val });
                                    }}
                                    disabled={!!selectedPatient}
                                    className="mt-1 w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                                    placeholder="+91 9876543210"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Email (optional)</label>
                                    <input
                                        type="email"
                                        value={patientDetails.email}
                                        onChange={(e) => setPatientDetails({ ...patientDetails, email: e.target.value })}
                                        disabled={!!selectedPatient}
                                        className="mt-1 w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Gender</label>
                                    <select
                                        value={patientDetails.gender}
                                        onChange={(e) => setPatientDetails({ ...patientDetails, gender: e.target.value as any })}
                                        className="mt-1 w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={() => setStep(2)}
                            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => setStep(4)}
                            disabled={!patientDetails.name || !patientDetails.phone}
                            className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {/* Step 4: Confirm */}
            {step === 4 && (
                <div className="max-w-md space-y-6">
                    <div className="rounded-xl border p-4 space-y-4">
                        <h3 className="font-semibold">Booking Summary</h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Doctor</span>
                                <span className="font-medium">Dr. {selectedDoctor?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Specialization</span>
                                <span>{typeof selectedDoctor?.specialization === 'string' ? selectedDoctor?.specialization : selectedDoctor?.specialization?.name || 'General'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Date</span>
                                <span>{new Date(selectedDate).toLocaleDateString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Time</span>
                                <span>{selectedSlot?.time}</span>
                            </div>
                            <div className="border-t pt-3">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Patient</span>
                                    <span className="font-medium">{patientDetails.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Phone</span>
                                    <span>{patientDetails.phone}</span>
                                </div>
                            </div>
                            <div className="border-t pt-3">
                                <div className="flex justify-between text-base">
                                    <span className="font-medium">Total Amount (Cash)</span>
                                    <span className="font-semibold">₹{getDoctorFee(selectedDoctor) || 'Free'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setStep(3)}
                            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={walkInMutation.isPending}
                            className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {walkInMutation.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="h-4 w-4" />
                                    Confirm & Collect ₹{getDoctorFee(selectedDoctor) || 'Free'}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
