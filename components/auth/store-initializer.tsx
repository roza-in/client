'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/slices/auth.slice';

export function AuthStoreInitializer() {
    const initialized = useRef(false);
    const initialize = useAuthStore((state) => state.initialize);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            initialize();
        }
    }, [initialize]);

    return null;
}
