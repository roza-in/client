import { Metadata } from 'next';
import { User, Mail, Phone, Calendar, MapPin, Shield, Camera } from 'lucide-react';

export const metadata: Metadata = {
    title: 'My Profile',
    description: 'Manage your profile information.',
};

export default function ProfilePage() {
    // Mock user data - in real implementation, fetch from API
    const user = {
        name: 'John',
        email: 'john.doe@example.com',
        phone: '+91 98765 43210',
        dateOfBirth: '1990-05-15',
        gender: 'male',
        bloodGroup: 'O+',
        address: '123 Main Street, Hyderabad, Telangana - 500001',
        emergencyContact: {
            name: 'Sarah Doe',
            phone: '+91 98765 43211',
            relationship: 'Spouse',
        },
    };

    return (
        <div className="p-6 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">My Profile</h1>

            <div className="space-y-6">
                {/* Profile Picture */}
                <div className="rounded-xl border p-6">
                    <h2 className="font-semibold mb-4">Profile Picture</h2>
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
                                {user.name.charAt(0)}
                            </div>
                            <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-md">
                                <Camera className="h-4 w-4" />
                            </button>
                        </div>
                        <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <button className="mt-2 text-sm text-primary hover:underline">
                                Change Profile Picture
                            </button>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="rounded-xl border p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold">Personal Information</h2>
                        <button className="text-sm text-primary hover:underline">Edit</button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">First Name</label>
                            <input
                                type="text"
                                value={user.name}
                                readOnly
                                className="w-full rounded-md border bg-muted/50 px-3 py-2 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Email</label>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <input
                                    type="email"
                                    value={user.email}
                                    readOnly
                                    className="flex-1 rounded-md border bg-muted/50 px-3 py-2 text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Phone</label>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <input
                                    type="tel"
                                    value={user.phone}
                                    readOnly
                                    className="flex-1 rounded-md border bg-muted/50 px-3 py-2 text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Date of Birth</label>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={new Date(user.dateOfBirth).toLocaleDateString()}
                                    readOnly
                                    className="flex-1 rounded-md border bg-muted/50 px-3 py-2 text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Gender</label>
                            <input
                                type="text"
                                value={user.gender}
                                readOnly
                                className="w-full rounded-md border bg-muted/50 px-3 py-2 text-sm capitalize"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Blood Group</label>
                            <input
                                type="text"
                                value={user.bloodGroup}
                                readOnly
                                className="w-full rounded-md border bg-muted/50 px-3 py-2 text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div className="rounded-xl border p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold">Address</h2>
                        <button className="text-sm text-primary hover:underline">Edit</button>
                    </div>
                    <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                        <p className="text-muted-foreground">{user.address}</p>
                    </div>
                </div>

                {/* Emergency Contact */}
                <div className="rounded-xl border p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold">Emergency Contact</h2>
                        <button className="text-sm text-primary hover:underline">Edit</button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">{user.emergencyContact.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="font-medium">{user.emergencyContact.phone}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Relationship</p>
                            <p className="font-medium">{user.emergencyContact.relationship}</p>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="rounded-xl border p-6">
                    <h2 className="font-semibold mb-4 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Security
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Password</p>
                                <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                            </div>
                            <button className="rounded-md border px-4 py-2 text-sm hover:bg-muted">
                                Change Password
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Two-Factor Authentication</p>
                                <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                            </div>
                            <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
                                Enable
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
