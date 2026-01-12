'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { Hospital } from '@/types/hospital';
import { hospitalApi } from '@/lib/api/hospital';
import { Button, Input, Textarea, Card, CardContent, CardHeader, CardTitle, Avatar } from '@/components/ui';
import { Upload } from 'lucide-react';

function AdminHospitalActionsPage() {
  const params = useParams();
  const hospitalId = params?.id as string | undefined;
  const [hospitalData, setHospitalData] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  type HospitalForm = Partial<Hospital> & {
    admin?: Record<string, any>;
    images?: string[];
    logo_url?: string;
    cover_image_url?: string;
    brand_color?: string;
    registration_number?: string | null;
    license_number?: string | null;
    pan?: string | null;
    landmark?: string | null;
    alternate_phone?: string | null;
    meta_title?: string | null;
    meta_description?: string | null;
    [key: string]: any;
  };
  const [formData, setFormData] = useState<HospitalForm>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const imagesInputRef = useRef<HTMLInputElement | null>(null);
  const fetchHospitalData = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await hospitalApi.get(id);
      // Map server `specializations` to client `specialties` for the form
      const mapped = { ...(data as any) } as any;
      if ((data as any).specializations !== undefined && (data as any).specialties === undefined) {
        mapped.specialties = (data as any).specializations;
      }
      // Remove original server key so we don't send both `specializations` and `specialties`
      if (mapped.specializations !== undefined) delete mapped.specializations;
      setHospitalData(mapped as Hospital);
      setFormData(mapped as any);
      setIsDirty(false);
    } catch (err) {
      setError('Failed to load hospital data.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (hospitalId) fetchHospitalData(hospitalId);
  }, [hospitalId]);

  const handleChange = (key: string, value: any) => {
    setFormData((s) => ({ ...(s || {}), [key]: value }));
    setIsDirty(true);
    validateField(key as string, value);
  };

  const handleAdminChange = (key: string, value: any) => {
    setFormData((s) => ({ ...(s || {}), admin: { ...(s?.admin as any || {}), [key]: value } }));
    setIsDirty(true);
  };

  const SPECIALIZATIONS = [
    ['general_medicine','General Medicine','General health concerns and primary care',1],
    ['cardiology','Cardiology','Heart and cardiovascular system',2],
    ['orthopedics','Orthopedics','Bones, joints, and muscles',3],
    ['pediatrics','Pediatrics','Child healthcare',4],
    ['gynecology','Gynecology & Obstetrics','Women health and pregnancy',5],
    ['dermatology','Dermatology','Skin, hair, and nails',6],
    ['ent','ENT','Ear, Nose, and Throat',7],
    ['ophthalmology','Ophthalmology','Eye care',8],
    ['dentistry','Dentistry','Dental and oral health',9],
    ['neurology','Neurology','Brain and nervous system',10],
    ['psychiatry','Psychiatry','Mental health',11],
    ['gastroenterology','Gastroenterology','Digestive system',12],
    ['pulmonology','Pulmonology','Lungs and respiratory system',13],
    ['nephrology','Nephrology','Kidneys',14],
    ['urology','Urology','Urinary system',15],
    ['endocrinology','Endocrinology','Hormones and metabolism',16],
    ['oncology','Oncology','Cancer treatment',17],
    ['rheumatology','Rheumatology','Autoimmune and joint diseases',18],
    ['general_surgery','General Surgery','Surgical procedures',19],
    ['physiotherapy','Physiotherapy','Physical rehabilitation',20],
    ['ayurveda','Ayurveda','Traditional Indian medicine',21],
    ['homeopathy','Homeopathy','Homeopathic medicine',22],
  ] as const;

  const toggleSpecialization = (key: string) => {
    const current = (formData.specialties || []) as string[];
    const exists = current.includes(key);
    const next = exists ? current.filter((s) => s !== key) : [...current, key];
    handleChange('specialties', next);
  };

  const [specQuery, setSpecQuery] = useState('');
  const suggestions = SPECIALIZATIONS.filter(([key, label]) => {
    const q = specQuery.trim().toLowerCase();
    if (!q) return true; // show available services when no query
    return String(label).toLowerCase().includes(q) || String(key).toLowerCase().includes(q);
  }).filter(([key]) => !((formData.specialties || []) as string[]).includes(String(key))).slice(0, 8);

  const validateField = (key: string, value: any) => {
    const e: Record<string, string> = { ...errors };
    if (key === 'name') {
      if (!value || String(value).trim() === '') e.name = 'Name is required';
      else delete e.name;
    }
    if (key === 'email') {
      if (!value) e.email = 'Email is required';
      else if (!/^\S+@\S+\.\S+$/.test(String(value))) e.email = 'Invalid email';
      else delete e.email;
    }
    if (key === 'phone') {
      if (value && !/^[0-9+\s-]{6,15}$/.test(String(value))) e.phone = 'Invalid phone';
      else delete e.phone;
    }
    if (key === 'website') {
      // Accept URLs with or without protocol. We'll normalize before save.
      if (value && !/^(https?:\/\/)?[^\s]+$/.test(String(value))) e.website = 'Invalid website URL';
      else delete e.website;
    }
    setErrors(e);
  };

  const handleSave = async () => {
    if (!hospitalId) return;
    setSaving(true);
    try {
      validateField('name', formData.name);
      validateField('email', formData.email);
      if (Object.keys(errors).length > 0) {
        toast.error('Please fix validation errors before saving');
        setSaving(false);
        return;
      }

      const payload = { ...(formData as any) } as any;
      // Normalize website: if missing protocol, prefix with https://
      if (payload.website && typeof payload.website === 'string' && !/^https?:\/\//i.test(payload.website)) {
        payload.website = `https://${payload.website.trim()}`;
        // clear website validation error if any
        setErrors((prev) => { const p = { ...prev }; delete p.website; return p; });
      }
      // If client uses `specialties`, ensure we don't also send `specializations` to avoid duplicate keys
      if (payload.specialties !== undefined && payload.specializations !== undefined) {
        delete payload.specializations;
      }
      const updated = await hospitalApi.update(hospitalId, payload as any);
      // Re-fetch full hospital so related fields (owner/admin, relations) are present
      await fetchHospitalData(hospitalId);
      setIsDirty(false);
      toast.success('Hospital updated');
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Failed to update hospital');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading hospital...</div>;
  if (error) return <div className="p-8 text-destructive">{error}</div>;

  const formatDate = (d?: string | null) => {
    if (!d) return '-';
    try {
      return new Date(d).toLocaleString();
    } catch (e) {
      return d;
    }
  };
  return (
    <div className="min-h-screen space-y-6">
      {/* Header */}
      <div className="bg-background rounded-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
          <div>
            <Avatar src={(hospitalData as any)?.logoUrl || null} alt={hospitalData?.name || 'Hospital'} size="xl" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{hospitalData?.name || '—'}</h1>
            <div className="text-sm">{hospitalData?.slug || ''}</div>
          </div>
        </div>

          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${hospitalData?.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {hospitalData?.verificationStatus === 'verified' ? 'Verified' : hospitalData?.verificationStatus || 'Pending'}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={!isDirty || saving}>{saving ? 'Saving...' : 'Save'}</Button>
            </div>
          </div>
      </div>

      {/* Main content */}
      {!hospitalData && <div className="p-6 bg-white rounded shadow">No hospital data available</div>}

      {/* Edit form */}
      {hospitalData && (
        <div className="flex w-full gap-6">
          <div className="w-3/5 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hospital Details</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                <label className="flex flex-col">
                  <span className="text-sm">Name</span>
                  <Input value={formData.name || ''} onChange={(e) => handleChange('name' as any, e.target.value)} />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm">Description</span>
                  <Textarea value={formData.description || ''} onChange={(e) => handleChange('description' as any, e.target.value)} />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm">Type</span>
                  <Input value={formData.type || ''} onChange={(e) => handleChange('type' as any, e.target.value)} />
                </label>
                <div className="flex flex-col">
                  <span className="text-sm">Specializations</span>
                  <div className="mt-2">
                    <div className="flex gap-2 flex-wrap mb-2">
                      {(formData.specialties || []).map((s) => {
                        const opt = SPECIALIZATIONS.find(([k]) => k === s);
                        const label = opt ? String(opt[1]) : s;
                        return (
                          <div key={s} className="inline-flex items-center gap-2 bg-gray-100 px-2 py-1 rounded text-sm">
                            <span>{label}</span>
                            <button type="button" className="text-sm text-gray-600" onClick={() => toggleSpecialization(s)}>×</button>
                          </div>
                        );
                      })}
                    </div>

                    <Input
                      placeholder="Start typing to search specializations"
                      value={specQuery}
                      onChange={(e) => setSpecQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (suggestions.length > 0) {
                            const [key] = suggestions[0];
                            toggleSpecialization(String(key));
                            setSpecQuery('');
                          }
                        }
                      }}
                    />

                    {specQuery.trim() && suggestions.length > 0 && (
                      <div className="mt-1 border rounded bg-white shadow-sm max-h-40 overflow-auto">
                        {suggestions.map(([key, label]) => (
                          <div key={String(key)} className="px-3 py-2 hover:bg-gray-50 cursor-pointer" onMouseDown={(e) => { e.preventDefault(); toggleSpecialization(String(key)); setSpecQuery(''); }}>
                            <div className="text-sm">{label}</div>
                            <div className="text-xs text-muted-foreground">{String(key)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Registration & Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <label className="flex flex-col">
                  <span className="text-sm">Registration Number</span>
                  <Input value={formData.registration_number || ''} onChange={(e) => handleChange('registration_number', e.target.value)} />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm">License Number</span>
                  <Input value={formData.license_number || ''} onChange={(e) => handleChange('license_number', e.target.value)} />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm">GSTIN</span>
                  <Input value={formData.gstin || ''} onChange={(e) => handleChange('gstin' as any, e.target.value)} />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm">PAN</span>
                  <Input value={formData.pan || ''} onChange={(e) => handleChange('pan' as any, e.target.value)} />
                </label>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className='w-full flex gap-4'>
                  <label className="flex w-1/2 flex-col">
                    <span className="text-sm">Address</span>
                    <Input value={formData.address_line1 || ''} onChange={(e) => handleChange('address_line1', e.target.value)} />
                  </label>
                  <label className="flex w-1/2 flex-col">
                    <span className="text-sm">Landmark</span>
                    <Input value={formData.landmark || ''} onChange={(e) => handleChange('landmark' as any, e.target.value)} />
                  </label>
                </div>
                
                <div className='w-full flex gap-4'> 
                  <label className="flex w-1/2 flex-col">
                    <span className="text-sm">City</span>
                    <Input value={formData.city || ''} onChange={(e) => handleChange('city' as any, e.target.value)} />
                  </label>
                  <label className="flex w-1/2 flex-col">
                    <span className="text-sm">State</span>
                    <Input value={formData.state || ''} onChange={(e) => handleChange('state' as any, e.target.value)} />
                  </label>
                </div>
                <div className='w-full flex gap-4'>
                  <label className="flex w-1/2 flex-col">
                    <span className="text-sm">Country</span>
                    <Input value={formData.country || ''} onChange={(e) => handleChange('country' as any, e.target.value)} />
                  </label>
                  <label className="flex w-1/2 flex-col">
                    <span className="text-sm">Pincode</span>
                    <Input value={formData.pincode || ''} onChange={(e) => handleChange('pincode' as any, e.target.value)} />
                  </label>
                </div>
                
              </CardContent>
            </Card>
          </div>
          <div className="w-2/5 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Owner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <label className="flex flex-col"> 
                  <span className="text-sm">Name</span>
                  <Input value={(formData.admin as any)?.full_name || ''} onChange={(e) => handleAdminChange('full_name', e.target.value)} />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm">Email</span>
                  <Input value={(formData.admin as any)?.email || ''} onChange={(e) => handleAdminChange('email', e.target.value)} />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm">Phone</span>
                  <Input value={(formData.admin as any)?.phone || ''} onChange={(e) => handleAdminChange('phone', e.target.value)} />
                </label>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <label className="flex flex-col">
                  <span className="text-sm">Status</span>
                  <select className="input" value={String(formData.is_active ?? false)} onChange={(e) => handleChange('is_active', e.target.value === 'true')}>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </label>
                <label className="flex flex-col">
                  <span className="text-sm">Featured</span>
                  <select className="input" value={String(formData.is_featured ?? false)} onChange={(e) => handleChange('is_featured', e.target.value === 'true')}>
                    <option value="true">Featured</option>
                    <option value="false">Not Featured</option>
                  </select>
                </label>

                <label className="flex flex-col">
                  <span className="text-sm">Verification Status</span>
                  <select className="input" value={formData.verification_status || 'pending'} onChange={(e) => handleChange('verification_status', e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </label>
                {formData.verification_status === 'rejected' && ( 
                  <label className="flex flex-col mt-2">
                    <span className="text-sm">Rejection Reason</span>
                    <Textarea value={formData.rejection_reason || ''} onChange={(e) => handleChange('rejection_reason', e.target.value)} />
                  </label>
                 )}
                {formData.is_verified && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                    <strong className="block mb-2">This hospital is verified.</strong>
                    <p>Verified by: {formData.verified_by || 'N/A'}</p>
                    <p>Verified at: {formatDate(formData.verified_at as any)}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Branding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className='w-full py-6 flex items-center justify-center flex-col border border-dashed border-gray-300 rounded-md p-4'>
                  { (formData.logoUrl || formData.logo_url) ? (
                    <img src={(formData.logoUrl || formData.logo_url) as string} alt="Logo" className="max-h-24" />
                  ) : null }
                  <input
                    ref={logoInputRef}
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          handleChange('logoUrl', reader.result as string);
                          setIsDirty(true);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <Upload className="cursor-pointer" onClick={() => logoInputRef.current?.click()} />
                    <p>Upload Logo</p>
                </div>
                <div>
                  {formData.images && formData.images.length > 0 && (
                    <>
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="mb-2">
                        <img src={img} alt={`Hospital Image ${idx + 1}`} className="max-w-full h-auto mb-1" />
                        <Button variant="destructive" size="sm" onClick={() => {
                          const newImages = (formData.images || []).filter((_, i) => i !== idx);
                          handleChange('images' as any, newImages);
                        }}>Remove</Button>
                      </div>
                    ))}
                    </>
                  )}
                  <div className='w-12 h-12 flex items-center justify-center flex-col border border-dashed border-gray-300 rounded-md p-4'>
                  { (formData.logoUrl || formData.logo_url) ? (
                    <img src={(formData.logoUrl || formData.logo_url) as string} alt="Logo" className="max-h-12" />
                  ) : null }
                  <input
                    ref={imagesInputRef}
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const img = reader.result as string;
                          const newImages = [...(formData.images || []), img];
                          handleChange('images' as any, newImages);
                          setIsDirty(true);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <Upload className="cursor-pointer" onClick={() => imagesInputRef.current?.click()} />
                </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <label className="flex flex-col">
                  <span className="text-sm">Phone</span>
                  <Input value={formData.phone || ''} onChange={(e) => handleChange('phone' as any, e.target.value)} />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm">Alternative Phone</span>
                  <Input value={formData.alternate_phone || ''} onChange={(e) => handleChange('alternate_phone' as any, e.target.value)} />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm">Email</span>
                  <Input value={formData.email || ''} onChange={(e) => handleChange('email' as any, e.target.value)} />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm">Website</span>
                  <Input value={formData.website || ''} onChange={(e) => handleChange('website' as any, e.target.value)} />
                </label>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <label className="flex flex-col">
                  <span className="text-sm">Meta Title</span>
                  <Input value={formData.meta_title || ''} onChange={(e) => handleChange('meta_title' as any, e.target.value)} />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm">Meta Description</span>
                  <Textarea value={formData.meta_description || ''} onChange={(e) => handleChange('meta_description' as any, e.target.value)} />
                </label>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
 
export default AdminHospitalActionsPage;