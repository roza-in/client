import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Camera } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Hospital Profile',
    description: 'Update hospital profile.',
};

export default function HospitalProfileSettingsPage() {
    const hospital = {
        name: 'Apollo Hospitals',
        type: 'Multi-Specialty',
        registrationNumber: 'HOS/12345/2020',
        email: 'contact@apollohospitals.com',
        phone: '+91 40-XXXX-XXXX',
        address: 'Jubilee Hills, Hyderabad, Telangana - 500033',
        about: 'Apollo Hospitals is India\'s largest healthcare group.',
    };

    return (
        <div className="space-y-6">
            <form className="space-y-6">
                {/* Logo */}
                <div className="rounded-xl border p-6">
                    <h2 className="font-semibold mb-4">Hospital Logo</h2>
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="h-20 w-20 rounded-lg bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                                AH
                            </div>
                            <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow-md">
                                <Camera className="h-3.5 w-3.5" />
                            </button>
                        </div>
                        <button className="text-sm text-primary hover:underline">Upload new logo</button>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="rounded-xl border p-6 space-y-4">
                    <h2 className="font-semibold">Basic Information</h2>

                    <div>
                        <label className="block text-sm font-medium mb-1.5">Hospital Name</label>
                        <input
                            type="text"
                            defaultValue={hospital.name}
                            className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Type</label>
                            <select className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                                <option>Multi-Specialty</option>
                                <option>Super-Specialty</option>
                                <option>Clinic</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Registration Number</label>
                            <input
                                type="text"
                                defaultValue={hospital.registrationNumber}
                                readOnly
                                className="w-full rounded-md border bg-muted/50 px-3 py-2 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5">About</label>
                        <textarea
                            rows={4}
                            defaultValue={hospital.about}
                            className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                </div>

                {/* Contact */}
                <div className="rounded-xl border p-6 space-y-4">
                    <h2 className="font-semibold">Contact Information</h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Email</label>
                            <input
                                type="email"
                                defaultValue={hospital.email}
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Phone</label>
                            <input
                                type="tel"
                                defaultValue={hospital.phone}
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5">Address</label>
                        <textarea
                            rows={2}
                            defaultValue={hospital.address}
                            className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}
