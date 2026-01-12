'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    listUsers,
    getUser,
    updateUser,
    deleteUser,
    banUser,
    unbanUser,
} from '@/lib/api';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TablePagination } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { PageLoader } from '@/components/ui/spinner';
import type { User } from '@/lib/types';
import { Edit, Eye, Trash } from 'lucide-react';

function AdminUsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [total, setTotal] = useState(0);
    console.log('Users:', users);
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { users: data, meta } = await listUsers({ page, limit });
            setUsers(data as User[]);
            setTotal(meta.total);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load users');
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this user? This is irreversible.')) return;
        try {
            await deleteUser(id);
            setUsers((s) => s.filter((u) => u.id !== id));
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete user');
        }
    };

    const handleBan = async (id: string) => {
        const reason = prompt('Reason for ban?') || 'Violation';
        try {
            await banUser(id, reason);
            fetchUsers();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to ban user');
        }
    };

    const handleUnban = async (id: string) => {
        if (!confirm('Unban this user?')) return;
        try {
            await unbanUser(id);
            fetchUsers();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to unban user');
        }
    };

    const handleView = (id: string) => {
        router.push(`/admin/users/${id}`);
    };

    if (loading) return <PageLoader />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Users</h1>
                <div className="flex items-center gap-2">
                    <Button onClick={() => fetchUsers()}>Refresh</Button>
                </div>
            </div>

            {error && <div className="text-destructive">{error}</div>}

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Profile</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Is Active</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((u) => (
                        <TableRow key={u.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar src={u.full_name} fallback={u.full_name ?? 'U'} />
                                    <div className="flex flex-col">
                                        <span className="font-medium">{u.full_name || '—'}</span>
                                        <span className="text-xs text-muted-foreground">{u.email}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{u.phone || '—'}</TableCell>
                            <TableCell>{u.role[0].toUpperCase() + u.role.slice(1)}</TableCell>
                            <TableCell>{u.created_at ? new Date(u.created_at).toLocaleString() : '—'}</TableCell>
                            <TableCell>{u.is_active ? 'Yes' : 'No'}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => router.push(`/admin/users/${u.id}`)}>
                                        <Eye className="h-4 w-4 " />
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => router.push(`/admin/users/${u.id}/?mode=edit`)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => handleDelete(u.id)}>
                                        <Trash className="h-4 w-4 text-red-400" />
                                    </Button>
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
                onPageSizeChange={(s) => {
                    setLimit(s);
                    setPage(1);
                }}
            />
        </div>
    );
}

export default AdminUsersPage;