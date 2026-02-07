
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/slices/auth.slice';
import { api } from '@/lib/api'; // Assuming this is the configured axios/fetch wrapper

interface HospitalDashboard {
    hospital: any;
    stats: any;
    recentAppointments: any[];
    topDoctors: any[];
}

export const useHospitalDashboard = () => {
    const { user } = useAuthStore();
    const hospitalId = user?.role === 'hospital' ? user.hospital?.id : null;

    const query = useQuery({
        queryKey: ['hospital-dashboard', hospitalId],
        queryFn: async () => {
            if (!hospitalId) throw new Error('No hospital ID found');
            // api.get already returns response.data, so we get the dashboard data directly
            const data = await api.get<HospitalDashboard>(`/hospitals/${hospitalId}/dashboard`);
            return data;
        },
        enabled: !!hospitalId,
    });

    return {
        ...query,
        isLoading: query.isLoading && !!hospitalId, // Prevent loading state if query is disabled
    };
};
