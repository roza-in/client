'use client';

import { IndianRupee, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookingSummaryProps {
    consultationFee: number;
    platformFee?: number; // Optional - not shown to patients
    gstAmount?: number; // Optional - not shown to patients
    totalAmount: number;
    isLoading?: boolean;
    className?: string;
}

/**
 * BookingSummary Component
 * Shows only consultation fee to patients - platform fee/GST are taken from hospital settlement
 */
export function BookingSummary({
    consultationFee,
    totalAmount,
    isLoading,
    className
}: BookingSummaryProps) {
    // Show only the consultation fee - no platform fee or GST to patient
    // Commission is deducted from hospital during settlement
    const displayAmount = consultationFee || totalAmount;

    return (
        <div className={cn("bg-slate-900 text-white rounded-2xl p-6 shadow-xl space-y-6", className)}>
            <div className="flex items-center gap-2 pb-4 border-b border-white/10">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <h3 className="text-sm font-black uppercase tracking-[0.2em]">Secure Checkout</h3>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center group">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-200 transition-colors">
                        Consultation Fee
                    </span>
                    <span className="text-sm font-black">₹{consultationFee}</span>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-sm font-black uppercase tracking-[0.2em] text-primary">Total Payable</span>
                    <div className="flex items-center gap-1">
                        <IndianRupee className="h-5 w-5 text-primary" />
                        <span className="text-2xl font-black text-primary">{displayAmount}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 flex gap-3">
                <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <span className="text-[10px] text-emerald-400 font-black">✓</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                    Your payment is encrypted and processed securely. No hidden charges.
                </p>
            </div>
        </div>
    );
}
