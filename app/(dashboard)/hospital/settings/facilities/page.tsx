'use client';
import { Wifi, SquareParking, Armchair, Coffee, Baby, Accessibility, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function HospitalFacilitiesSettingsPage() {
    // This would typically come from the API (hospitals.facilities array)
    const facilities = [
        { id: 'parking', label: 'Parking Available', icon: SquareParking, description: 'Dedicated parking space for patients and visitors' },
        { id: 'wifi', label: 'Free Wi-Fi', icon: Wifi, description: 'High-speed internet access throughout the premises' },
        { id: 'wheelchair', label: 'Wheelchair Accessible', icon: Accessibility, description: 'Ramps and elevators for easy mobility' },
        { id: 'cafeteria', label: 'Cafeteria', icon: Coffee, description: 'In-house food and beverage services' },
        { id: 'waiting_area', label: 'AC Waiting Area', icon: Armchair, description: 'Comfortable air-conditioned waiting lounges' },
        { id: 'ambulance', label: '24/7 Ambulance', icon: Car, description: 'Emergency ambulance service availability' },
        { id: 'nicu', label: 'NICU', icon: Baby, description: 'Neonatal Intensive Care Unit' },
    ];

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Hospital Facilities</CardTitle>
                    <CardDescription>Select the amenities and facilities available at your hospital to showcase on your profile.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {facilities.map((facility) => (
                        <div key={facility.id} className="flex items-start justify-between space-x-4 rounded-lg border p-4 transition-all hover:bg-muted/50">
                            <div className="flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <facility.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor={facility.id} className="text-base font-medium cursor-pointer">
                                        {facility.label}
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        {facility.description}
                                    </p>
                                </div>
                            </div>
                            <Switch id={facility.id} defaultChecked />
                        </div>
                    ))}

                    <div className="flex justify-end pt-4">
                        <Button>Save Changes</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
