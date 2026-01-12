'use client';

import { useEffect, useState, useCallback } from 'react';
import { StatCard } from '@/components/common';
import { Hospital as HospitalIcon, CheckCircle, Clock, Activity, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TablePagination } from '@/components/ui/table';
import { listPendingVerifications, verifyHospital, requestDocuments } from '@/lib/api/admin';
import type { Hospital } from '@/lib/types/hospital';

function AdminHospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async (p = page, l = limit) => {
    setLoading(true);
    try {
      const res = await listPendingVerifications({ page: p, limit: l });
      setHospitals(res.hospitals || []);
      setTotal(res.meta?.total || 0);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => { fetch(page, limit); }, [fetch, page, limit]);

  const handleVerify = async (id: string) => {
    const confirmed = window.confirm('Mark hospital as VERIFIED?');
    if (!confirmed) return;
    await verifyHospital(id, { status: 'verified' });
    fetch(page, limit);
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt('Enter remarks for rejection (optional)');
    if (reason === null) return;
    await verifyHospital(id, { status: 'rejected', remarks: reason || undefined });
    fetch(page, limit);
  };

  const handleRequestDocs = async (id: string) => {
    const docs = window.prompt('Enter comma-separated document types to request (e.g. license, gstin)');
    if (docs === null) return;
    await requestDocuments(id, docs.split(',').map((s) => s.trim()).filter(Boolean));
    alert('Request sent');
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this hospital? This action cannot be undone.');
    if (!confirmed) return;
    try {
      // TODO: Implement deleteHospital API
      alert('Hospital deleted');
    } catch (err) {
      console.error(err);
      alert('Failed to delete hospital');
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const stats = {
    totalHospitals: 0,
    activeHospitals: 0,
    verifiedHospitals: 0,
    pendingVerification: total,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Hospitals" value={stats.totalHospitals} icon={HospitalIcon} description="All onboarded hospitals"/>
        <StatCard title="Active Hospitals" value={stats.activeHospitals} icon={Activity} description="Currently live"/>
        <StatCard title="Verified Hospitals" value={stats.verifiedHospitals} icon={CheckCircle} description="Approved & trusted"/>
        <StatCard title="Pending Verification" value={stats.pendingVerification} icon={Clock} description="Requires admin action"/>
      </div>

      <div className="bg-card p-4 rounded">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hospitals.map((h) => (
              <TableRow key={h.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="font-medium">{h.name}</div>
                    <div className="text-xs text-muted-foreground">{h.email}</div>
                  </div>
                </TableCell>
                <TableCell>{h.city}</TableCell>
                <TableCell>{h.phone}</TableCell>
                <TableCell>{new Date((h as any).created_at || h.createdAt || '').toLocaleString()}</TableCell>
                <TableCell>{(h as any).verification_status || (h as any).verificationStatus || 'pending'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/hospitals/${h.id}`} className="btn btn-sm btn-ghost p-2" aria-label="View"><Eye size={16} /></Link>
                    <Link href={`/admin/hospitals/${h.id}/?mode=edit`} className="btn btn-sm btn-ghost p-2" aria-label="Edit"><Edit size={16} /></Link>
                    <button className="btn btn-sm btn-ghost p-2 text-destructive" onClick={() => handleDelete(h.id)} aria-label="Delete"><Trash2 size={16} /></button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={limit}
          totalItems={total}
          onPageChange={(p) => setPage(p)}
          onPageSizeChange={(s) => { setLimit(s); setPage(1); }}
        />
      </div>
    </div>
  );
}

export default AdminHospitalsPage;
