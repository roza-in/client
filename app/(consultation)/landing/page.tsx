import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Video } from 'lucide-react';

export default function ConsultationLandingPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
            <div className="relative w-full max-w-md">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-emerald-500/20 blur-3xl -z-10 rounded-full" />

                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                            <Video className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400">
                            Telehealth Portal
                        </CardTitle>
                        <CardDescription>
                            Enter your appointment details to join the session
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Appointment ID</label>
                            <Input placeholder="Enter unique ID (e.g. 1A2B-3C4D)" className="bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800" />
                        </div>
                        <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 transition-all font-medium">
                            Join Secure Room
                        </Button>
                        <p className="text-center text-xs text-muted-foreground mt-4">
                            Secured by ROZX Health • HIPPA Compliant
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}