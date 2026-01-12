"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatCard } from '@/components/common/stat-card';
import { PageLoader } from '@/components/ui/spinner';
import { getDashboardStats, listUsers, listPendingVerifications, listTickets, getRevenueStats, type DashboardStats } from '@/lib/api/admin';
import type { User } from '@/lib/types';
import { ArrowRight, BriefcaseMedical, CircleAlert, Hospital, IndianRupee, Users } from 'lucide-react';

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [pendingHospitals, setPendingHospitals] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [revenue, setRevenue] = useState<{ total: number } | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const [d, uResp, hResp, tResp, rResp] = await Promise.all([
          getDashboardStats(),
          listUsers({ page: 1, limit: 5 }),
          listPendingVerifications({ page: 1, limit: 5 }),
          listTickets({ page: 1, limit: 5 }),
          getRevenueStats({}),
        ]);

        if (!mounted) return;
        setStats(d as DashboardStats);
        setRecentUsers(uResp.users || []);
        setPendingHospitals(hResp.hospitals || []);
        setTickets(tResp.tickets || []);
        setRevenue(rResp || null);
      } catch (err) {
        // console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Users" value={stats?.totalUsers ?? 0} icon={Users} description="Total registered users" />
        <StatCard title="Hospitals" value={stats?.totalHospitals ?? 0} icon={Hospital} description="Registered hospitals" />
        <StatCard title="Doctors" value={stats?.totalDoctors ?? 0} icon={BriefcaseMedical} description="Registered doctors" />
        <StatCard title="Revenue" value={revenue?.total ?? stats?.totalRevenue ?? 0} icon={IndianRupee} format="currency" description="Total collected" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <section className="bg-card p-4 rounded-md">
            <h2 className="text-lg font-medium mb-2">Recent Users</h2>
            {recentUsers.length === 0 ? (
              <div className="text-sm text-muted-foreground">No recent users</div>
            ) : (
              <ul className="space-y-2">
                {recentUsers.map((u) => (
                  <li key={u.id} className="flex items-center justify-between">
                    <div>
                      <Link href={`/admin/users/${u.id}`} className="font-medium">{u.full_name ?? u.email ?? u.phone}</Link>
                      <div className="text-xs text-muted-foreground">{u.email ?? u.phone}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{u.created_at ? new Date(u.created_at).toLocaleString() : '—'}</div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="bg-card p-4 rounded-md">
            <h2 className="text-lg font-medium mb-2">Open Support Tickets</h2>
            {tickets.length === 0 ? (
              <div className="text-sm text-muted-foreground">No open tickets</div>
            ) : (
              <ul className="space-y-2">
                {tickets.map((t) => (
                  <li key={t.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{t.subject || `#${t.id}`}</div>
                      <div className="text-xs text-muted-foreground">{t.user?.email ?? t.userId}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{t.status}</div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <section className="bg-card p-4 shadow-xs rounded-md">
            <div className='flex items-center justify-between border-b pb-2 mb-4'>
              <h3 className="text-lg font-medium mb-2">Pending Hospital</h3>
              <Link href="/admin/hospitals/?status=pending" className="text-primary"><ArrowRight /></Link>
            </div>
            <div className='min-h-32'>
              {pendingHospitals.length === 0 ? (
                <div className="h-full text-center text-sm mt-18 text-muted-foreground">
                  <CircleAlert className='mx-auto mb-2' />
                  No pending Verifications
                </div>
              ) : (
                <ul className="space-y-2">
                  {pendingHospitals.map((h) => (
                    <li key={h.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{h.name}</div>
                        <div className="text-xs text-muted-foreground">{h.city || h.address || '—'}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">{new Date(h.created_at).toLocaleDateString()}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="bg-card p-4 min-h-40 shadow-xs rounded-md">
            <div className='flex items-center justify-between border-b pb-2 mb-4'>
              <h3 className="text-lg font-medium mb-2">Pending Doctor</h3>
              <Link href="/admin/doctors/?status=pending" className="text-primary"><ArrowRight /></Link>
            </div>
            <div className='min-h-32'>
              {pendingHospitals.length === 0 ? (
                <div className="h-full text-center text-sm mt-18 text-muted-foreground">
                  <CircleAlert className='mx-auto mb-2' />
                  No pending Verifications
                </div>
              ) : (
                <ul className="space-y-2">
                  {pendingHospitals.map((h) => (
                    <li key={h.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{h.name}</div>
                        <div className="text-xs text-muted-foreground">{h.city || h.address || '—'}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">{new Date(h.created_at).toLocaleDateString()}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="bg-card p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2 border-b pb-2">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <Link href="/admin/users" className="text-sm text-primary">Manage Users</Link>
              <Link href="/admin/hospitals" className="text-sm text-primary">Review Hospitals</Link>
              <Link href="/admin/tickets" className="text-sm text-primary">View Tickets</Link>
              <Link href="/admin/settings" className="text-sm text-primary">System Settings</Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}