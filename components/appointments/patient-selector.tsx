/**
 * ROZX Healthcare Platform - Patient Selector Component
 * Select between self and family members for booking
 */

'use client';

import { User, Users, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FamilyMember } from '@/types';

interface PatientSelectorProps {
    familyMembers: FamilyMember[];
    selectedId: string | 'self';
    onSelect: (id: string | 'self') => void;
    className?: string;
}

export function PatientSelector({ familyMembers, selectedId, onSelect, className }: PatientSelectorProps) {
    const hasFamily = familyMembers.length > 0;

    return (
        <div className={cn("space-y-3", className)}>
            {/* Self Selection - Always shown */}
            <button
                onClick={() => onSelect('self')}
                className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                    selectedId === 'self'
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                )}
            >
                <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition-colors",
                    selectedId === 'self' ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                )}>
                    <User className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold">Myself</p>
                    <p className="text-sm text-muted-foreground">Book for my own appointment</p>
                </div>
                {selectedId === 'self' && (
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                )}
            </button>

            {/* Family Members - Only if they exist */}
            {hasFamily && (
                <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-medium px-1">Family Members</p>
                    {familyMembers.map((member) => (
                        <button
                            key={member.id}
                            onClick={() => onSelect(member.id)}
                            className={cn(
                                "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                                selectedId === member.id
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/40"
                            )}
                        >
                            <div className={cn(
                                "h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition-colors",
                                selectedId === member.id ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                            )}>
                                <Users className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">{member.name}</p>
                                <p className="text-sm text-muted-foreground capitalize truncate">
                                    {member.relationship}
                                </p>
                            </div>
                            {selectedId === member.id && (
                                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                            )}
                        </button>
                    ))}
                </div>
            )}

        </div>
    );
}

export default PatientSelector;
