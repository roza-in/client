'use client';

import {
    Heart,
    Pill,
    AlertCircle,
    FileText,
    Users,
    Activity,
} from 'lucide-react';
import { StatsCard } from '@/components/patients';
import { LoadingSpinner } from '@/components/shared';
import { useHealthSummary, useVitals, useMedications, useAllergies } from '@/features/health-records';

export default function PatientHealthRecordsPage() {
    const { data: summary, isLoading: summaryLoading } = useHealthSummary();
    const { data: vitalsData, isLoading: vitalsLoading } = useVitals({ limit: 5 });
    const { data: medsData, isLoading: medsLoading } = useMedications({ limit: 5 });
    const { data: allergiesData, isLoading: allergiesLoading } = useAllergies({ limit: 10 });

    const vitals = vitalsData?.vitals ?? [];
    const medications = medsData?.medications ?? [];
    const allergies = allergiesData?.allergies ?? [];
    const isLoading = summaryLoading || vitalsLoading || medsLoading || allergiesLoading;

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Health Records</h1>
                <p className="text-muted-foreground">View your health information at a glance</p>
            </div>

            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Active Medications"
                    value={summary?.activeMedications ?? 0}
                    icon={Pill}
                    variant="primary"
                />
                <StatsCard
                    title="Known Allergies"
                    value={summary?.allergies ?? 0}
                    icon={AlertCircle}
                    variant="warning"
                />
                <StatsCard
                    title="Documents"
                    value={summary?.documents ?? 0}
                    icon={FileText}
                />
                <StatsCard
                    title="Family Members"
                    value={summary?.familyMembers ?? 0}
                    icon={Users}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Latest Vitals */}
                <div className="rounded-xl border p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="h-5 w-5 text-primary" />
                        <h2 className="font-semibold">Latest Vitals</h2>
                    </div>
                    {summary?.vitals ? (
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {summary.vitals.bloodPressureSystolic && (
                                <div>
                                    <p className="text-muted-foreground">Blood Pressure</p>
                                    <p className="font-medium">
                                        {summary.vitals.bloodPressureSystolic}/{summary.vitals.bloodPressureDiastolic} mmHg
                                    </p>
                                </div>
                            )}
                            {summary.vitals.heartRate && (
                                <div>
                                    <p className="text-muted-foreground">Heart Rate</p>
                                    <p className="font-medium">{summary.vitals.heartRate} bpm</p>
                                </div>
                            )}
                            {summary.vitals.weight && (
                                <div>
                                    <p className="text-muted-foreground">Weight</p>
                                    <p className="font-medium">{summary.vitals.weight} kg</p>
                                </div>
                            )}
                            {summary.vitals.spo2 && (
                                <div>
                                    <p className="text-muted-foreground">SpO₂</p>
                                    <p className="font-medium">{summary.vitals.spo2}%</p>
                                </div>
                            )}
                            {summary.vitals.temperature && (
                                <div>
                                    <p className="text-muted-foreground">Temperature</p>
                                    <p className="font-medium">{summary.vitals.temperature}°F</p>
                                </div>
                            )}
                            {summary.vitals.bloodSugar && (
                                <div>
                                    <p className="text-muted-foreground">Blood Sugar</p>
                                    <p className="font-medium">{summary.vitals.bloodSugar} mg/dL</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No vitals recorded yet
                        </p>
                    )}
                </div>

                {/* Active Medications */}
                <div className="rounded-xl border p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Pill className="h-5 w-5 text-blue-600" />
                        <h2 className="font-semibold">Active Medications</h2>
                    </div>
                    {medications.length > 0 ? (
                        <div className="space-y-3">
                            {medications.map((med) => (
                                <div key={med.id} className="flex justify-between items-start text-sm">
                                    <div>
                                        <p className="font-medium">{med.medicineName}</p>
                                        <p className="text-muted-foreground">
                                            {med.dosage} · {med.frequency}
                                        </p>
                                    </div>
                                    {med.isActive && (
                                        <span className="rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 text-xs">
                                            Active
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No active medications
                        </p>
                    )}
                </div>

                {/* Allergies */}
                <div className="rounded-xl border p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <h2 className="font-semibold">Allergies</h2>
                    </div>
                    {allergies.length > 0 ? (
                        <div className="space-y-3">
                            {allergies.map((allergy) => (
                                <div key={allergy.id} className="flex justify-between items-start text-sm">
                                    <div>
                                        <p className="font-medium">{allergy.allergen}</p>
                                        <p className="text-muted-foreground capitalize">
                                            {allergy.allergenType} · {allergy.severity.replace(/_/g, ' ')}
                                        </p>
                                    </div>
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs ${
                                            allergy.severity === 'life_threatening' || allergy.severity === 'severe'
                                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                : allergy.severity === 'moderate'
                                                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                  : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        }`}
                                    >
                                        {allergy.severity.replace(/_/g, ' ')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No allergies recorded
                        </p>
                    )}
                </div>

                {/* Recent Vitals History */}
                <div className="rounded-xl border p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Heart className="h-5 w-5 text-red-500" />
                        <h2 className="font-semibold">Recent Vital Records</h2>
                    </div>
                    {vitals.length > 0 ? (
                        <div className="space-y-3">
                            {vitals.map((v) => (
                                <div key={v.id} className="text-sm border-b last:border-0 pb-2 last:pb-0">
                                    <p className="text-xs text-muted-foreground mb-1">
                                        {new Date(v.recordedAt).toLocaleString()}
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {v.bloodPressureSystolic && (
                                            <span>BP: {v.bloodPressureSystolic}/{v.bloodPressureDiastolic}</span>
                                        )}
                                        {v.heartRate && <span>HR: {v.heartRate}</span>}
                                        {v.spo2 && <span>SpO₂: {v.spo2}%</span>}
                                        {v.weight && <span>Wt: {v.weight}kg</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No vitals history
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
