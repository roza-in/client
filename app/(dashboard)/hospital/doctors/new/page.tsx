'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doctorApi, uploadApi, api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation } from '@/hooks/use-async';
import { Upload } from 'lucide-react';

function HospitalDoctorAddPage() {
  const router = useRouter();

  const initialForm = {
    fullName: '',
    phone: '',
    email: '',
    specializationId: null as string | null,
    specializationText: '',
    qualifications: '',
    consultationFee: '' as number | '',
    onlineFee: '' as number | '',
    consultationDuration: 15,
    followUpFee: '' as number | '',
    yearsOfExperience: '' as number | '',
    bio: '',
    bufferTime: '' as number | '',
    registrationNumber: '',
    licenseNumber: '',
    registrationCouncil: '',
    acceptsOnline: true,
    acceptsInPerson: true,
    isAvailable: true,
    maxPatientsPerDay: '' as number | '',
    profileImageFile: null as File | null,
    profileImagePreview: null as string | null,
    langEnglish: false,
    langHindi: true,
  };

  const [form, setForm] = useState<typeof initialForm>(initialForm);
  const [error, setError] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [specializations, setSpecializations] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingSpecs, setLoadingSpecs] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoadingSpecs(true);
        const data = await doctorApi.getSpecializations();
        if (!mounted) return;
        setSpecializations((data || []).map((s: any) => ({ id: s.id, name: s.display_name || s.name })));
      } catch (err) {
        console.error('Failed to load specializations', err);
      } finally {
        setLoadingSpecs(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const { mutate: addDoctor, isLoading } = useMutation(doctorApi.add, {
    onError: () => {
      setLoading(false);
      setError({ form: 'Failed to create doctor. Please try again.' });
    },
  });

  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [createdDoctorId, setCreatedDoctorId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (form.phone && !/^\+?[0-9]{7,15}$/.test(form.phone)) e.phone = 'Invalid phone number';
    if (form.consultationFee !== '' && Number(form.consultationFee) < 0) e.consultationFee = 'Must be >= 0';
    return e;
  }, [form.fullName, form.phone, form.consultationFee]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (Object.keys(errors).length) return;

    const payload: any = {
      full_name: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      qualifications: form.qualifications || null,
      consultation_duration: form.consultationDuration || 15,
      consultation_fee_in_person: form.consultationFee === '' ? undefined : Number(form.consultationFee),
      online_consultation_fee: form.onlineFee === '' ? undefined : Number(form.onlineFee),
      follow_up_fee: form.followUpFee === '' ? undefined : Number(form.followUpFee),
      years_of_experience: form.yearsOfExperience === '' ? undefined : Number(form.yearsOfExperience),
      bio: form.bio || null,
      registration_number: form.registrationNumber || null,
      license_number: form.licenseNumber || null,
      registration_council: form.registrationCouncil || null,
      accepts_online_consultation: form.acceptsOnline,
      accepts_in_person: form.acceptsInPerson,
      is_available: form.isAvailable,
      buffer_time: form.bufferTime === '' ? undefined : Number(form.bufferTime),
      max_patients_per_day: form.maxPatientsPerDay === '' ? undefined : Number(form.maxPatientsPerDay),
      profile_image_url: form.profileImagePreview || null,
      languages_spoken: [form.langEnglish ? 'English' : null, form.langHindi ? 'Hindi' : null].filter(Boolean),
    };

    if (form.specializationId) {
      payload.specialization_id = form.specializationId;
    } else if (form.specializationText) {
      payload.specialization = form.specializationText.trim();
    }

    setUploadError(null);
    const created = await addDoctor(payload);
    if (!created) {
      setUploadError('Failed to create doctor.');
      return;
    }

    const createdId = (created as any).id as string;
    setCreatedDoctorId(createdId);

    // If a profile image file was selected, upload it after doctor creation with progress
    if (form.profileImageFile) {
      try {
        setUploadProgress(0);
        const res = await uploadApi.uploadDoctorAvatar(createdId, form.profileImageFile as File, (p) => setUploadProgress(p));
        if (res && (res as any).url) {
          setForm(prev => ({ ...prev, profileImagePreview: (res as any).url }));
        }
      } catch (uploadErr) {
        console.error('Avatar upload failed', uploadErr);
        setUploadError('Failed to upload avatar. You can retry later from doctor profile.');
      } finally {
        setUploadProgress(null);
      }
    }

    // Navigate back once create (and optional upload) complete
    router.push('/hospital/doctors');
  };

  async function handleDeleteAvatar() {
    setUploadError(null);
    if (!createdDoctorId) {
      setForm(prev => ({ ...prev, profileImageFile: null, profileImagePreview: null }));
      return;
    }

    try {
      setIsDeleting(true);
      await api.patch(`/doctors/${createdDoctorId}`, { profile_image_url: null });
      setForm(prev => ({ ...prev, profileImageFile: null, profileImagePreview: null }));
    } catch (err) {
      console.error('Failed to delete avatar', err);
      setUploadError('Failed to delete avatar. Try again.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Add New Doctor</h1>
          <p className="text-sm text-muted-foreground">Create doctor profile and upload avatar</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" type="button" onClick={() => { setForm(initialForm); if (inputRef.current) inputRef.current.value = ''; }}>Reset</Button>
          <Button type="submit" isLoading={isLoading || uploadProgress !== null}>{uploadProgress !== null ? `Uploading (${uploadProgress}%)` : 'Create Doctor'}</Button>
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label required>Full name</Label>
                  <Input value={form.fullName} onChange={(e) => setForm(prev => ({ ...prev, fullName: e.target.value }))} placeholder="Sanjeev Kapoor" />
                </div>
                <div>
                  <Label required>Phone</Label>
                  <Input value={form.phone} onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))} placeholder="+919876543210" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={form.email} onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} placeholder="name@hospital.com" />
                </div>
                <div>
                  <Label>Specialization</Label>
                  <Select onValueChange={(v) => { setForm(prev => ({ ...prev, specializationId: v === 'none' ? null : (v || null), specializationText: '' })); }}>
                    <SelectTrigger>
                      <SelectValue>{form.specializationId ? specializations.find(s => s.id === form.specializationId)?.name : 'Select specialization'}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional details</CardTitle>
              <CardDescription>Qualifications, registration and experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label>Qualifications</Label>
                  <Input value={form.qualifications} onChange={(e) => setForm(prev => ({ ...prev, qualifications: e.target.value }))} placeholder="MBBS, MD - Cardiology" />
                </div>
                <div>
                  <Label>Registration number</Label>
                  <Input value={form.registrationNumber} onChange={(e) => setForm(prev => ({ ...prev, registrationNumber: e.target.value }))} placeholder="Medical registration no." />
                </div>
                <div>
                  <Label>License number</Label>
                  <Input value={form.licenseNumber} onChange={(e) => setForm(prev => ({ ...prev, licenseNumber: e.target.value }))} placeholder="License no." />
                </div>
                <div >
                  <Label>Registration council</Label>
                  <Input value={form.registrationCouncil} onChange={(e) => setForm(prev => ({ ...prev, registrationCouncil: e.target.value }))} placeholder="Council / Board" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fees & schedule</CardTitle>
              <CardDescription>Consultation fees and timing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label>Offline Consultation fee (INR)</Label>
                  <Input type="number" value={form.consultationFee as any} onChange={(e) => setForm(prev => ({ ...prev, consultationFee: e.target.value === '' ? '' : Number(e.target.value) }))} />
                  {errors.consultationFee && <p className="text-xs text-destructive">{errors.consultationFee}</p>}
                </div>
                <div>
                  <Label>Online consultation fee (INR)</Label>
                  <Input type="number" value={form.onlineFee as any} onChange={(e) => setForm(prev => ({ ...prev, onlineFee: e.target.value === '' ? '' : Number(e.target.value) }))} />
                </div>
                <div>
                  <Label>Follow-up fee (INR)</Label>
                  <Input type="number" value={form.followUpFee as any} onChange={(e) => setForm(prev => ({ ...prev, followUpFee: e.target.value === '' ? '' : Number(e.target.value) }))} />
                </div>
                <div>
                  <Label>Consultation duration (mins)</Label>
                  <Input type="number" value={String(form.consultationDuration)} onChange={(e) => setForm(prev => ({ ...prev, consultationDuration: Number(e.target.value || 15) }))} />
                </div>
                <div>
                  <Label>Buffer time (mins)</Label>
                  <Input type="number" value={form.bufferTime === '' ? '' : String(form.bufferTime)} onChange={(e) => setForm(prev => ({ ...prev, bufferTime: e.target.value === '' ? '' : Number(e.target.value) }))} />
                </div>
                <div>
                  <Label>Max patients per day</Label>
                  <Input type="number" value={form.maxPatientsPerDay === '' ? '' : String(form.maxPatientsPerDay)} onChange={(e) => setForm(prev => ({ ...prev, maxPatientsPerDay: e.target.value === '' ? '' : Number(e.target.value) }))} />
                </div>
              </div>
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
              <input
                ref={(el) => { inputRef.current = el }}
                type="file"
                accept="image/*"
                className='hidden'
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  if (f) {
                    const reader = new FileReader();
                    reader.onload = () => setForm(prev => ({ ...prev, profileImageFile: f, profileImagePreview: String(reader.result) }));
                    reader.readAsDataURL(f);
                  } else {
                    setForm(prev => ({ ...prev, profileImageFile: null, profileImagePreview: null }));
                  }
                }}
              />
              {!form.profileImagePreview && (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => inputRef.current?.click()}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
                  className='w-full py-8 rounded border-2 border-dashed cursor-pointer'
                >
                  <Upload className='mx-auto my-4 text-muted-foreground' />
                  <p className='text-center text-sm text-muted-foreground mb-4'>Click to upload</p>
                </div>
              )}
              {form.profileImagePreview && (
                <div className="flex items-center gap-4 mt-2">
                  <img src={form.profileImagePreview as string} alt="preview" className="h-24 w-24 object-cover rounded" />
                  <div>
                    <p className="text-sm">{form.profileImageFile?.name ?? 'Uploaded image'}</p>
                    <div className="flex gap-2 mt-2">
                      <Button variant="ghost" size="sm" type="button" onClick={() => { if (inputRef.current) inputRef.current.click(); }}>Replace</Button>
                      <Button variant="ghost" size="sm" type="button" onClick={handleDeleteAvatar} disabled={isDeleting}>{isDeleting ? 'Deleting...' : 'Delete'}</Button>
                    </div>
                  </div>
                </div>
              )}
              {uploadProgress !== null && (
                <div className="mt-3">
                  <div className="w-full bg-slate-200 h-2 rounded overflow-hidden">
                    <div className="bg-primary h-2" style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{uploadProgress}%</p>
                </div>
              )}
              {uploadError && <p className="text-xs text-destructive mt-2">{uploadError}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Experience & bio</CardTitle>
              <CardDescription>Years of experience and short bio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label>Years of experience</Label>
                  <Input type="number" value={form.yearsOfExperience === '' ? '' : String(form.yearsOfExperience)} onChange={(e) => setForm(prev => ({ ...prev, yearsOfExperience: e.target.value === '' ? '' : Number(e.target.value) }))} />
                </div>
                <div>
                  <Label>Short bio</Label>
                  <Textarea value={form.bio} onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))} placeholder="Brief profile or summary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Availability & options</CardTitle>
              <CardDescription>Quick toggles and languages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.acceptsOnline} onChange={(e) => setForm(prev => ({ ...prev, acceptsOnline: e.target.checked }))} /> Accepts online</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.acceptsInPerson} onChange={(e) => setForm(prev => ({ ...prev, acceptsInPerson: e.target.checked }))} /> Accepts in-person</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm(prev => ({ ...prev, isAvailable: e.target.checked }))} /> Is available</label>
                <div className="pt-2">
                  <Label>Languages</Label>
                  <div className="flex gap-4 items-center">
                    <label className="flex items-center gap-2"><input type="checkbox" checked={form.langEnglish} onChange={(e) => setForm(prev => ({ ...prev, langEnglish: e.target.checked }))} /> English</label>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={form.langHindi} onChange={(e) => setForm(prev => ({ ...prev, langHindi: e.target.checked }))} /> Hindi</label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </form>
  );
}

export default HospitalDoctorAddPage;
