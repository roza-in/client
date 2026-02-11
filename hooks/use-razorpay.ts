import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { bookingApi } from '@/features/appointments';

interface RazorpayOrderData {
    key: string;
    amount: number;
    currency: string;
    orderId: string;
    name?: string;
    description?: string;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
}

interface UseRazorpayOptions {
    onSuccess?: (appointmentId: string) => void;
    onError?: (error: any) => void;
}

export const useRazorpay = () => {
    const router = useRouter();

    const initiatePayment = useCallback((
        orderData: RazorpayOrderData,
        appointmentId: string,
        options?: UseRazorpayOptions
    ) => {
        const rzpOptions = {
            key: orderData.key,
            amount: orderData.amount,
            currency: orderData.currency,
            name: orderData.name || "Rozx Healthcare",
            description: orderData.description || "Appointment Booking",
            order_id: orderData.orderId,
            handler: async function (response: any) {
                try {
                    const verification = await bookingApi.verifyPaymentAndConfirm({
                        appointmentId,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpayOrderId: response.razorpay_order_id,
                        razorpaySignature: response.razorpay_signature,
                    });

                    // API client throws error if response.success is false
                    // So if we get here, it is successful.
                    // verification is the Payment object (or whatever data the backend sends).

                    toast.success("Payment successful! Appointment confirmed.");
                    options?.onSuccess?.(appointmentId) || router.push(`/patient/book/success/${appointmentId}`);
                } catch (error: any) {
                    const msg = error.message || "Payment verification failed";
                    toast.error(msg);
                    options?.onError?.(error);
                }
            },
            prefill: orderData.prefill,
            theme: {
                color: "#0f172a",
            },
            modal: {
                ondismiss: function () {
                    console.log('Payment modal closed');
                }
            }
        };

        if (typeof window !== 'undefined' && (window as any).Razorpay) {
            const rzp = new (window as any).Razorpay(rzpOptions);
            rzp.open();
        } else {
            toast.error("Razorpay SDK not loaded. Please try again.");
        }
    }, [router]);

    return { initiatePayment };
};
