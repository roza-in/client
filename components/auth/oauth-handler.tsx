'use client';

/**
 * @deprecated OAuthHandler was used for the implicit OAuth flow (hash-based tokens).
 * The platform now uses PKCE flow exclusively. This component is no longer mounted.
 * See app/(auth)/callback/page.tsx for the active OAuth callback handler.
 */

import { type ReactNode } from 'react';

export function OAuthHandler({ children }: { children: ReactNode }) {
    return <>{children}</>;
}

export default OAuthHandler;