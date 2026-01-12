'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageLoader } from '@/components/ui/spinner';
import {
  getUser,
  updateUser,
  deleteUser,
  banUser,
  unbanUser,
} from '@/lib/api';
import type { User } from '@/lib/types';

export default function AdminUserActionPage() {
  const router = useRouter();
  const search = useSearchParams();
  const params = useParams();
  const userId = params?.id as string | undefined;
  const mode = search?.get('mode') || undefined;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', role: '' });
  const fetch = async () => {
    setLoading(true);
    try {
      if (!userId) throw new Error('Missing user id');
      const data = await getUser(userId);
      setUser(data as User);
      setForm({ full_name: data.full_name || '', email: data.email || '', phone: data.phone || '', role: data.role || '' });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to load user');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleChange = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const updated = await updateUser(user.id, {
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        role: form.role,
      } as any);
      setUser(updated as User);
      alert('Saved');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    if (!confirm('Delete this user? This is irreversible.')) return;
    try {
      await deleteUser(user.id);
      alert('User deleted');
      router.push('/admin/users');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const handleBan = async () => {
    if (!user) return;
    const reason = prompt('Reason for ban?') || 'Violation';
    try {
      await banUser(user.id, reason);
      alert('User banned');
      fetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to ban');
    }
  };

  const handleUnban = async () => {
    if (!user) return;
    if (!confirm('Unban this user?')) return;
    try {
      await unbanUser(user.id);
      alert('User unbanned');
      fetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to unban');
    }
  };

  if (loading) return <PageLoader />;

  if (!user) return <div>User not found</div>;

  const isEdit = mode === 'edit';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar src={user.avatar_url || undefined} fallback={user.full_name ?? 'U'} />
          <div>
            <h2 className="text-xl font-semibold">{user.full_name || '—'}</h2>
            <p className="text-sm text-muted-foreground">{user.email || '—'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => router.push('/admin/users')}>Back</Button>
          {user.is_blocked ? (
            <Button variant="destructive" onClick={handleUnban}>Unban</Button>
          ) : (
            <Button variant="destructive" onClick={handleBan}>Ban</Button>
          )}
          <Button variant="outline" onClick={() => router.push(`/admin/users/${user.id}?mode=edit`)}>Edit</Button>
          <Button variant="ghost" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <label className="text-sm text-muted-foreground">Full name</label>
          {isEdit ? (
            <Input value={form.full_name} onChange={(e) => handleChange('full_name', e.target.value)} />
          ) : (
            <div>{user.full_name || '—'}</div>
          )}

          <label className="text-sm text-muted-foreground">Email</label>
          {isEdit ? (
            <Input value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
          ) : (
            <div>{user.email || '—'}</div>
          )}

          <label className="text-sm text-muted-foreground">Phone</label>
          {isEdit ? (
            <Input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
          ) : (
            <div>{user.phone || '—'}</div>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-sm text-muted-foreground">Role</label>
          {isEdit ? (
            <Input value={form.role} onChange={(e) => handleChange('role', e.target.value)} />
          ) : (
            <div>{user.role}</div>
          )}

          <label className="text-sm text-muted-foreground">Created</label>
          <div>{user.created_at ? new Date(user.created_at).toLocaleString() : '—'}</div>

          <label className="text-sm text-muted-foreground">Active</label>
          <div>{user.is_active ? 'Yes' : 'No'}</div>

          <label className="text-sm text-muted-foreground">Verified</label>
          <div className="space-y-1">
            <div>Phone: {user.phone_verified ? 'Yes' : 'No'}{user.phone_verified_at ? ` — ${new Date(user.phone_verified_at).toLocaleString()}` : ''}</div>
            <div>Email: {user.email_verified ? 'Yes' : 'No'}{user.email_verified_at ? ` — ${new Date(user.email_verified_at).toLocaleString()}` : ''}</div>
          </div>

          <label className="text-sm text-muted-foreground">Last login</label>
          <div>{user.last_login_at ? new Date(user.last_login_at).toLocaleString() : '—'}</div>

          <label className="text-sm text-muted-foreground">Login stats</label>
          <div>Logins: {user.login_count ?? 0} • Failed attempts: {user.failed_login_attempts ?? 0}</div>

          <label className="text-sm text-muted-foreground">Google ID</label>
          <div>{user.google_id || '—'}</div>

          <label className="text-sm text-muted-foreground">Locale / Timezone</label>
          <div>{user.preferred_language || '—'} • {user.timezone || '—'}</div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Contact & Profile</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground">Phone</label>
            <div>{user.phone || '—'}</div>

            <label className="text-sm text-muted-foreground">Email</label>
            <div>{user.email || '—'}</div>

            <label className="text-sm text-muted-foreground">Address</label>
            <div>{user.address || '—'}</div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Emergency contact</label>
            <div>{user.emergency_contact || '—'}</div>

            <label className="text-sm text-muted-foreground">Gender / DOB</label>
            <div>{user.gender || '—'} • {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : '—'}</div>

            <label className="text-sm text-muted-foreground">Physical</label>
            <div>Height: {user.height_cm ?? '—'} cm • Weight: {user.weight_kg ?? '—'} kg</div>
          </div>
        </div>

        <h3 className="text-lg font-medium">Medical</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground">Allergies</label>
            <div>{user.allergies || '—'}</div>

            <label className="text-sm text-muted-foreground">Chronic conditions</label>
            <div>{user.chronic_conditions || '—'}</div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Current medications</label>
            <div>{user.current_medications || '—'}</div>

            <label className="text-sm text-muted-foreground">Medical history</label>
            <div>{user.medical_history || '—'}</div>
          </div>
        </div>

        <h3 className="text-lg font-medium">Admin / Audit</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground">Blocked</label>
            <div>{user.is_blocked ? `Yes — ${user.blocked_reason || 'No reason'}` : 'No'}</div>

            <label className="text-sm text-muted-foreground">Blocked at/by</label>
            <div>{user.blocked_at ? new Date(user.blocked_at).toLocaleString() : '—'} • {user.blocked_by || '—'}</div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Created / Updated</label>
            <div>{user.created_at ? new Date(user.created_at).toLocaleString() : '—'} • {user.updated_at ? new Date(user.updated_at).toLocaleString() : '—'}</div>
          </div>
        </div>

        <h3 className="text-lg font-medium">Hospitals</h3>
        <div>
          {Array.isArray(user.hospitals) && user.hospitals.length > 0 ? (
            <ul className="list-disc pl-6">
              {user.hospitals.map((h: any) => (
                <li key={h.id}>{h.name} ({h.id})</li>
              ))}
            </ul>
          ) : (
            <div>—</div>
          )}
        </div>
      </div>
      {isEdit && (
        <div className="flex items-center gap-2">
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          <Button variant="ghost" onClick={() => router.push(`/admin/users/${user.id}`)}>Cancel</Button>
        </div>
      )}
    </div>
  );
}