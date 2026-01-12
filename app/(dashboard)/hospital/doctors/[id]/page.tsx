'use client';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '@/components/ui';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doctorApi } from '@/lib/api';
import { Star } from 'lucide-react';

function HospitalDoctorDetailsPage() {
    const params = useParams();
    const { id } = params;
    const [doctorData, setDoctorData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
console.log("Doctor Data:", doctorData);
    const fetchDoctorData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await doctorApi.get(id as string);
        setDoctorData(data);
      } catch (err: any) {
        console.error('Failed to fetch doctor', err);
        setError(err?.message || 'Failed to load doctor data');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
        fetchDoctorData();
    }, [id]);

    const router = useRouter();

  return (
    <div className="space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{doctorData?.user.full_name || 'Doctor details'}</h1>
              <p className="text-sm text-muted-foreground">{doctorData?.specialization?.display_name || ''}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" type="button" onClick={() => router.back()}>Back to Doctors</Button>
              <Button type="button" onClick={() => router.push(`/hospital/doctors/${id}/edit`)}>Edit</Button>
            </div>
        </header>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic information</CardTitle>
              <CardDescription>Primary contact and identification details</CardDescription>
            </CardHeader>
            <CardContent>
                {doctorData && (
                  <div className="space-y-2">
                    <div><span className="font-semibold">Full Name:</span> {doctorData.user.full_name || '—'}</div>
                    <div><span className="font-semibold">Email:</span> {doctorData.user.email || '—'}</div>
                    <div><span className="font-semibold">Phone:</span> {doctorData.user.phone_number || doctorData.user.phone || '—'}</div>
                  </div>
                )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional details</CardTitle>
              <CardDescription>Qualifications, registration and experience</CardDescription>
            </CardHeader>
            <CardContent>
                {doctorData && (
                  <div className="space-y-2">
                    <div><span className="font-semibold">Qualifications:</span> {doctorData.qualifications || 'N/A'}</div>
                    <div><span className="font-semibold">Registration No:</span> {doctorData.registration_number || doctorData.registrationNumber || 'N/A'}</div>
                    <div><span className="font-semibold">License No:</span> {doctorData.license_number || doctorData.licenseNumber || 'N/A'}</div>
                    <div><span className="font-semibold">Registration Council:</span> {doctorData.registration_council || 'N/A'}</div>
                  </div>
                )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fees & schedule</CardTitle>
              <CardDescription>Consultation fees and timing</CardDescription>
            </CardHeader>
            <CardContent>
                {doctorData && (
                  <div className="space-y-2">
                    <div><span className="font-semibold">Consultation (In-person):</span> {doctorData.consultation_fee ?? 'N/A'}</div>
                    <div><span className="font-semibold">Consultation (Online):</span> {doctorData.online_consultation_fee ?? 'N/A'}</div>
                    <div><span className="font-semibold">Follow-up Fee:</span> {doctorData.follow_up_fee ?? 'N/A'}</div>
                    <div><span className="font-semibold">Duration (mins):</span> {doctorData.consultation_duration ?? 'N/A'}</div>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>

        <aside className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile photo</CardTitle>
              <CardDescription>Upload a clear headshot for the doctor profile</CardDescription>
            </CardHeader>
            <CardContent>
                {doctorData && (
                    <img src={doctorData.avatar_url || doctorData.profile_image_url || '/icons/avatar-placeholder.png'} alt="avatar" className="mx-auto h-28 w-28 object-cover rounded" />
                )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Experience & bio</CardTitle>
              <CardDescription>Years of experience and short bio</CardDescription>
            </CardHeader>
            <CardContent>
                {doctorData && (
                  <div>
                    <div><span className="font-semibold">Years:</span> {doctorData.years_of_experience ?? doctorData.experience_years ?? '—'}</div>
                    <div><span className='font-semibold'>Bio:</span> {doctorData.bio || '—'}</div>
                  </div>
                )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account and verification status</CardTitle>
                <CardDescription>Verification status and details</CardDescription>
            </CardHeader>
            <CardContent>
                {doctorData && (
                  <div className="space-y-2">
                    <div><span className="font-semibold">Account Status:</span> {doctorData.is_active ? 'Active' : 'Inactive'}</div>
                    <div><span className="font-semibold">Verification Status:</span> {doctorData.verification_status || (doctorData.is_verified ? 'Verified' : 'Pending')}</div>
                    <div><span className="font-semibold">Verified on:</span> {doctorData.verified_at ? new Date(doctorData.verified_at).toLocaleDateString() : 'N/A'}</div>
                  </div>
                )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Availability & options</CardTitle>
              <CardDescription>Quick toggles and languages</CardDescription>
            </CardHeader>
            <CardContent>
                {doctorData && (
                  <div className="space-y-2">
                    <div><span className="font-semibold">Languages:</span> {(doctorData.languages_spoken || doctorData.languages || []).join(', ') || '—'}</div>
                    <div><span className="font-semibold">Accepts Walk-in:</span> {doctorData.accepts_walk_in ? 'Yes' : 'No'}</div>
                  </div>
                )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}

export default HospitalDoctorDetailsPage
