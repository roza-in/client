'use client';
import { Lock, Shield, Smartphone, Laptop, LogOut, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function HospitalSecuritySettingsPage() {
    const sessions = [
        { id: 1, device: 'Chrome on Windows', type: 'desktop', location: 'Hyderabad, India', ip: '192.168.1.1', lastActive: 'Current Session' },
        { id: 2, device: 'iPhone 15 Pro', type: 'mobile', location: 'Hyderabad, India', ip: '10.0.0.1', lastActive: '2 hours ago' },
    ];

    return (
        <div className="space-y-6">
            {/* Password Update */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <KeyRound className="h-5 w-5 text-primary" />
                        Change Password
                    </CardTitle>
                    <CardDescription>Ensure your account is secure by using a strong password.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="current">Current Password</Label>
                            <Input id="current" type="password" />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="new">New Password</Label>
                                <Input id="new" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm">Confirm Password</Label>
                                <Input id="confirm" type="password" />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <Button>Update Password</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Active Sessions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Active Sessions
                    </CardTitle>
                    <CardDescription>Manage devices where you are currently logged in.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-4">
                        {sessions.map((session) => (
                            <div key={session.id} className="flex items-center justify-between p-4 rounded-lg border bg-muted/20">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-full bg-muted">
                                        {session.type === 'mobile' ? (
                                            <Smartphone className="h-5 w-5 text-muted-foreground" />
                                        ) : (
                                            <Laptop className="h-5 w-5 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium">{session.device}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {session.location} • {session.ip}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-muted-foreground">{session.lastActive}</span>
                                    {session.lastActive !== 'Current Session' && (
                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                            <LogOut className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
