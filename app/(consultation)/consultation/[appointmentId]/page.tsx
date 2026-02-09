'use client';

import React, { use, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useConsultationRoom } from '@/features/consultations/hooks/use-consultation-room';
import { VideoPanel } from '@/components/consultation/video-panel';
import { ClinicalPanel } from '@/components/consultation/clinical-panel';
import { PrescriptionForm } from '@/components/consultation/prescription-form';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { useCreatePrescription } from '@/features/prescriptions/hooks/use-prescriptions';
import { appointmentsApi } from '@/lib/api/appointments';
import { useQuery } from '@tanstack/react-query';
import { PreJoinLobby } from '@/components/consultation/lobby';
import { Loading } from '@/components/ui/loading';
import { Error as ErrorUI } from '@/components/ui/error';
import { cn } from '@/lib';
import { ApiError } from '@/lib/api/error-handler';

interface PageProps {
    params: Promise<{ appointmentId: string }>;
}

export default function ConsultationPage({ params }: PageProps) {
    const { appointmentId } = use(params);
    const router = useRouter();
    const { user } = useAuth();
    const isDoctor = user?.role === 'doctor';

    const [activeTab, setActiveTab] = useState<'clinical' | 'prescription'>('clinical');
    const [hasJoined, setHasJoined] = useState(false);
    const [preferredDevices, setPreferredDevices] = useState<{ audioId: string; videoId: string }>({ audioId: '', videoId: '' });

    // Hooks
    const { mutateAsync: createPrescription, isPending: isSubmittingPrescription } = useCreatePrescription();
    const {
        consultation,
        isLoading,
        error,
        isSaving,
        startConsultation,
        endConsultation,
        updateNotes,
        updateVitals,
        isStarting,
        isEnding
    } = useConsultationRoom(appointmentId, undefined);

    // Fetch appointment details for metadata/lobby
    const { data: appointment } = useQuery({
        queryKey: ['appointment', appointmentId],
        queryFn: () => appointmentsApi.getAppointment(appointmentId),
        enabled: !!appointmentId,
        retry: (failureCount, error) => {
            if (error instanceof ApiError && error.status === 401) return false;
            return failureCount < 3;
        }
    });

    // Handle automatic consultation start for doctors (background)
    useEffect(() => {
        if (isDoctor && !consultation && appointmentId) {
            startConsultation(appointmentId);
        }
    }, [isDoctor, consultation, appointmentId, startConsultation]);

    // Redirect patients when consultation ends
    useEffect(() => {
        if (!isDoctor && consultation?.status === 'completed') {
            router.push(`/patient/appointments/${appointmentId}`);
        }
    }, [isDoctor, consultation?.status, router, appointmentId]);

    const handleEndConsultation = async () => {
        if (consultation?.id && isDoctor) {
            // Only doctors can officially "end" (complete) the consultation record
            await endConsultation({ id: consultation.id, notes: consultation.doctorNotes || undefined });
        }
        // Both parties just leave the page
        router.push(isDoctor ? '/doctor' : '/patient');
    };

    const handleJoin = (audioId: string, videoId: string) => {
        setPreferredDevices({ audioId, videoId });
        setHasJoined(true);
    };

    const handleSavePrescription = async (data: any) => {
        if (consultation) {
            await createPrescription({
                appointmentId,
                consultationId: consultation.id,
                diagnosis: data.diagnosis,
                medications: data.medications.map((m: any) => ({
                    name: m.name,
                    dosage: m.dosage,
                    frequency: m.frequency,
                    duration: m.duration,
                    timing: m.timing,
                    instructions: m.instructions || undefined
                })),
                labTests: data.labTests,
                advice: data.advice,
                symptoms: [],
            });
            setActiveTab('clinical');
        }
    };

    // Modern Loading Screen
    if (isLoading || isStarting) {
        return (
            <Loading
                title="Connecting Securely..."
                description="Establishing end-to-end encrypted connection to your consultation room."
            />
        );
    }

    if (error) {
        return (
            <ErrorUI
                title="Connection Error"
                description={error instanceof Error ? error.message : 'Failed to join consultation room.'}
                onRetry={() => window.location.reload()}
            />
        );
    }

    // Show Lobby if not joined yet
    if (!hasJoined && !isDoctor) {
        const apptData = appointment as any;
        return (
            <PreJoinLobby
                appointmentId={appointmentId}
                patientName={user?.name || apptData?.patientName || undefined}
                doctorName={apptData?.doctor?.name || apptData?.doctorName || 'Doctor'}
                scheduledAt={apptData?.scheduledStart ? new Date(apptData.scheduledStart).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' }) : undefined}
                consultationType={apptData?.consultationType}
                onJoin={handleJoin}
            />
        );
    }

    if (!hasJoined && isDoctor) {
        const apptData = appointment as any;
        return (
            <PreJoinLobby
                appointmentId={appointmentId}
                patientName={user?.name || 'Doctor'} // Self (Doctor)
                doctorName={apptData?.patientName || apptData?.patient?.name || 'Patient'} // Remote (Patient)
                scheduledAt={apptData?.scheduledStart ? new Date(apptData.scheduledStart).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' }) : undefined}
                consultationType={apptData?.consultationType}
                onJoin={handleJoin}
            />
        );
    }


    return (
        <div className="h-screen w-full flex flex-col bg-slate-50/50 dark:bg-slate-950/50 overflow-hidden">
            {/* Header / StatusBar */}
            <header className="h-14 md:h-16 px-4 md:px-6 flex items-center justify-between z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 supports-backdrop-filter:bg-white/60">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-linear-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center ring-1 ring-inset ring-black/5 dark:ring-white/10">
                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-sm md:text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">Live Consultation</h1>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                                {isDoctor
                                    ? `Patient ID: #${(consultation?.patientId || appointmentId)?.substring(0, 8)}`
                                    : `Session ID: #${(consultation?.id || appointmentId)?.substring(0, 8)}`
                                }
                            </p>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:hidden">
                                {isDoctor ? 'Patient' : 'Session'} #{(consultation?.id || appointmentId)?.substring(0, 4)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    {isSaving && (
                        <div className="hidden sm:flex items-center gap-2 bg-orange-500/10 px-3 py-1.5 rounded-full ring-1 ring-orange-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                            <span className="text-xs font-medium text-orange-700 dark:text-orange-400">Auto-saving...</span>
                        </div>
                    )}
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleEndConsultation}
                        disabled={isEnding}
                        className="rounded-full px-4 md:px-6 text-xs md:text-sm shadow-lg shadow-red-500/10 hover:shadow-red-500/20 transition-all"
                    >
                        {isEnding ? 'Ending...' : <><span className="hidden sm:inline">End Session</span><span className="sm:hidden">End</span></>}
                    </Button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col lg:flex-row overflow-hidden p-2 md:p-4 gap-2 md:gap-4">
                {/* Video Section (Always visible) */}
                <section className={cn(
                    "rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10 transition-all duration-500",
                    isDoctor
                        ? "flex-1 lg:w-[60%] lg:flex-initial bg-black min-h-[40vh] lg:min-h-0"
                        : "flex-1 bg-black" // Full screen for patient
                )}>
                    <VideoPanel
                        consultationId={consultation?.id || ''}
                        role={isDoctor ? 'doctor' : 'patient'}
                        onEnd={handleEndConsultation}
                        preferredMicrophoneId={preferredDevices.audioId}
                        preferredCameraId={preferredDevices.videoId}
                    />
                </section>

                {/* Clinical Panel (Doctors Only) - Becomes bottom panel on mobile */}
                {isDoctor && (
                    <section className="flex-1 lg:w-[40%] lg:flex-initial rounded-2xl lg:rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 shadow-xl flex flex-col overflow-hidden min-h-[35vh] lg:min-h-0">
                        <div className="flex-1 overflow-y-auto p-2">
                            <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)} className="h-full flex flex-col">
                                <div className="px-2 md:px-4 pt-2 md:pt-4 pb-2">
                                    <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-full">
                                        <TabsTrigger
                                            value="clinical"
                                            className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all text-xs font-semibold"
                                        >
                                            <span className="hidden sm:inline">Clinical Notes</span>
                                            <span className="sm:hidden">Notes</span>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="prescription"
                                            className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all text-xs font-semibold"
                                        >
                                            <span className="hidden sm:inline">Prescription</span>
                                            <span className="sm:hidden">Rx</span>
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="clinical" className="flex-1 mt-0 h-full overflow-hidden p-2 md:p-4 pt-0">
                                    <ClinicalPanel
                                        initialNotes={consultation?.doctorNotes || ''}
                                        onSaveNotes={updateNotes}
                                        onSaveVitals={updateVitals}
                                        isSaving={isSaving}
                                    />
                                </TabsContent>

                                <TabsContent value="prescription" className="flex-1 mt-0 h-full overflow-hidden p-2 md:p-4 pt-0">
                                    <PrescriptionForm
                                        onSave={handleSavePrescription}
                                        isSubmitting={isSubmittingPrescription}
                                    />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
