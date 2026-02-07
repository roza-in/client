'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X } from 'lucide-react';
import { useAuthStore } from '@/store';
import { addDoctor } from '@/features/hospitals/api/hospitals';
import { uploadDoctorAvatar } from '@/lib/api/upload';
import { useSpecializations } from '@/features/doctors/hooks/use-doctors';

export default function AddDoctorPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { data: specializations, isLoading: loadingSpecs } = useSpecializations();
    const [isLoading, setIsLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user?.hospital?.id) return;

        setIsLoading(true);
        try {
            const formData = new FormData(e.currentTarget);
            let profileImageUrl = null;

            // 1. Upload image if selected
            if (imageFile) {
                const uploadRes = await uploadDoctorAvatar(imageFile);
                profileImageUrl = uploadRes.url;
            }

            // 2. Prepare doctor data with all form fields
            const doctorData = {
                name: formData.get('firstName') as string,
                email: formData.get('email'),
                phone: formData.get('phone'),
                specializationId: formData.get('specializationId'),
                experienceYears: Number(formData.get('experienceYears')) || 0,
                registrationNumber: formData.get('registrationNumber'),
                registrationCouncil: formData.get('registrationCouncil'),
                registrationYear: Number(formData.get('registrationYear')) || null,
                qualifications: formData.get('qualification'),
                bio: formData.get('bio'),
                consultationFeeOnline: Number(formData.get('consultationFeeOnline')) || 0,
                consultationFeeInPerson: Number(formData.get('consultationFeeInPerson')) || 0,
                consultationFeeWalkIn: Number(formData.get('consultationFeeWalkIn')) || 0,
                followUpFee: Number(formData.get('followUpFee')) || 0,
                followUpValidityDays: Number(formData.get('followUpValidityDays')) || 7,
                onlineConsultationEnabled: formData.get('onlineConsultationEnabled') === 'on',
                walkInEnabled: formData.get('walkInEnabled') === 'on',
                profileImageUrl,
            };

            // 3. Create doctor
            await addDoctor(user.hospital.id, doctorData);

            // 4. Navigate back or show success
            router.push('/hospital/doctors');
        } catch (error) {
            console.error('Failed to add doctor:', error);
            // TODO: Add toast notification here
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="">
                    <h1 className="text-2xl font-bold">Add New Doctor</h1>
                    <p className="text-muted-foreground">Add a doctor to your hospital</p>
                </div>
                <div className="flex gap-2">
                    <button type="button" onClick={() => router.back()} className="px-4 py-2 rounded-md border">Cancel</button>
                    <button
                        form="add-doctor-form"
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 rounded-md border bg-primary text-primary-foreground disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
            <form id="add-doctor-form" onSubmit={handleSubmit} className="flex gap-6">
                <div className="space-y-4 w-1/3">
                    <div className="rounded-xl border p-6 space-y-2">
                        <h2 className="font-semibold">Profile Image</h2>
                        <p className="text-muted-foreground">Upload a profile image</p>
                        <div className='w-full h-44 flex items-center justify-center relative bg-muted/20 rounded-lg overflow-hidden border-2 border-dashed border-gray-200'>
                            {previewUrl ? (
                                <>
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <Upload className="w-8 h-8" />
                                        <span className="text-sm">Click/Drag to upload</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className='rounded-xl border p-6 space-y-2'>
                        <h2 className="font-semibold">Registration</h2>
                        <p className="text-muted-foreground">Enter your registration number</p>
                        <div className="space-y-2 mt-4">
                            <label className="block text-sm font-medium mb-1.5">Registration Number *</label>
                            <input
                                name="registrationNumber"
                                type="text"
                                required
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            <label className="block text-sm font-medium mb-1.5">Registration Council *</label>
                            <input
                                name="registrationCouncil"
                                type="text"
                                required
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            <label className="block text-sm font-medium mb-1.5">Registration Year *</label>
                            <input
                                name="registrationYear"
                                type="number"
                                required
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                    </div>
                    <div className="rounded-xl border p-6">
                        <h1 className="font-semibold">Fees</h1>
                        <p className="text-muted-foreground">Enter the fees for the doctor</p>
                        <div className="space-y-2 mt-4">
                            <label className="block text-sm font-medium mb-1.5">Consultation Fee Online *</label>
                            <input
                                name="consultationFeeOnline"
                                type="number"
                                required
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            <label className="block text-sm font-medium mb-1.5">Consultation Fee In Person *</label>
                            <input
                                name="consultationFeeInPerson"
                                type="number"
                                required
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            <label className="block text-sm font-medium mb-1.5">Consultation Fee Walk In *</label>
                            <input
                                name="consultationFeeWalkIn"
                                type="number"
                                required
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            <label className="block text-sm font-medium mb-1.5">Follow Up Fee *</label>
                            <input
                                name="followUpFee"
                                type="number"
                                required
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            <label className="block text-sm font-medium mb-1.5">Follow Up Validity Days *</label>
                            <input
                                name="followUpValidityDays"
                                type="number"
                                required
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                    </div>
                    <div className="rounded-xl border p-6">
                        <h2 className="font-semibold mb-4">Consultation Types</h2>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="onlineConsultationEnabled"
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <span className="text-sm">Enable Online Consultations</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="walkInEnabled"
                                    defaultChecked
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <span className="text-sm">Enable Walk-In Appointments</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="space-y-4 w-2/3">
                    <div className="rounded-xl border p-6">
                        <h2 className="font-semibold">Personal Information</h2>
                        <div>
                            <label className="block text-sm font-medium mb-1.5">First Name *</label>
                            <input
                                name="firstName"
                                type="text"
                                required
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Email *</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Phone *</label>
                            <input
                                name="phone"
                                type="tel"
                                required
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5">About Doctor *</label>
                            <textarea
                                name="bio"
                                required
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                    </div>
                    <div className="rounded-xl border p-6">
                        <h2 className="font-semibold">Professional Information</h2>
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Specialization *</label>
                            <select
                                name="specializationId"
                                required
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <option value="">Select specialization</option>
                                {loadingSpecs ? (
                                    <option disabled>Loading...</option>
                                ) : (
                                    specializations?.map((spec: any) => (
                                        <option key={spec.id} value={spec.id}>
                                            {spec.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Qualification *</label>
                            <input
                                name="qualification"
                                type="text"
                                required
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Experience (Years) *</label>
                            <input
                                name="experienceYears"
                                type="number"
                                required
                                min="0"
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                    </div>
                    <div className="rounded-xl border p-6">
                        <h2 className="font-semibold">Awards and Recognition</h2>
                        <p className="text-sm text-muted-foreground">Upload any awards or recognitions received by the doctor</p>
                        <div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5">Awards *</label>
                                <input
                                    name="awards"
                                    type="text"
                                    required
                                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Publications *</label>
                                <input
                                    name="publications"
                                    type="text"
                                    required
                                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Certificates *</label>
                                <input
                                    name="certificates"
                                    type="text"
                                    required
                                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Mentorships *</label>
                                <input
                                    name="mentorships"
                                    type="text"
                                    required
                                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
