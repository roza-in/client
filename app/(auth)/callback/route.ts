import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * OAuth callback handler
 * This route handles the callback from Supabase OAuth providers
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirect = requestUrl.searchParams.get('redirect') || '/dashboard';
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Get the user to determine their role for redirect
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Try to get the user's profile to determine role
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('auth_id', user.id)
          .single();

        const role = profile?.role || user.user_metadata?.role || 'patient';
        
        // Determine redirect based on role
        let redirectPath = redirect;
        if (redirect === '/dashboard') {
          switch (role) {
            case 'admin':
              redirectPath = '/admin';
              break;
            case 'hospital_admin':
              redirectPath = '/hospital';
              break;
            case 'doctor':
              redirectPath = '/doctor';
              break;
            default:
              redirectPath = '/dashboard';
          }
        }

        return NextResponse.redirect(`${origin}${redirectPath}`);
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate`);
}
