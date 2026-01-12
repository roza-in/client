'use client';
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TablePagination, TableRow } from "@/components/ui";
import { doctorApi } from "@/lib/api";
import { Edit, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";


function HospitalDoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async (p = page, l = limit, q = search) => {
    setLoading(true);
    setError(null);
    try {
      const res = await doctorApi.list({ page: p, limit: l, search: q });
      setDoctors(res.doctors || []);
      setTotal(res.meta?.total || 0);
    } catch (err: any) {
      console.error('Failed to load doctors', err);
      setError(err.message || 'Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(page, limit, search);
  }, [page, limit, search]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this doctor? This action cannot be undone.');
    if (!confirmed) return;
    try {
      setDeletingId(id);
      await doctorApi.delete(id);
      setDoctors(prev => prev.filter(d => d.id !== id));
      setTotal(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
      alert((err as any)?.message || 'Failed to delete doctor');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <section className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Doctors Management</h1>
          <p className="text-sm text-muted-foreground">Manage doctors for your hospital</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            placeholder="Search doctors..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="border rounded px-3 py-1"
          />
          <Link className="bg-primary text-secondary px-4 py-2 rounded" href="/hospital/doctors/new">Add New Doctor</Link>
        </div>
      </section>

      <section>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-destructive">{error}</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Appointments</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <div className="py-6 text-center text-sm text-muted-foreground">No doctors found</div>
                    </TableCell>
                  </TableRow>
                )}
                {doctors.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="font-medium">{d.full_name || d.user?.full_name || '—'}</div>
                        <div className="text-xs text-muted-foreground">{d.user?.email || d.user?.phone || ''}</div>
                      </div>
                    </TableCell>
                    <TableCell>{d.specialization || d.specialization_name || 'General'}</TableCell>
                    <TableCell>{d.is_active ? 'Active' : 'Inactive'}</TableCell>
                    <TableCell>{d.total_consultations ?? 0}</TableCell>
                    <TableCell>{d.verification_status || 'pending'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link href={`/hospital/doctors/${d.id}`} className="btn btn-sm btn-ghost p-2" aria-label="View"><Eye size={16} /></Link>
                        <Link href={`/hospital/doctors/${d.id}/edit`} className="btn btn-sm btn-ghost p-2" aria-label="Edit"><Edit size={16} /></Link>
                        <button className="btn btn-sm btn-ghost p-2 text-destructive" onClick={() => handleDelete(d.id)} disabled={deletingId === d.id} aria-label="Delete">
                          {deletingId === d.id ? 'Deleting...' : <Trash2 size={16} />}
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <TablePagination
              currentPage={page}
              totalPages={Math.max(1, Math.ceil(total / limit))}
              pageSize={limit}
              totalItems={total}
              onPageChange={(p) => setPage(p)}
              onPageSizeChange={(s) => { setLimit(s); setPage(1); }}
            />
          </>
        )}
      </section>
    </div>
  );
}

export default HospitalDoctorsPage;