'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Trash2, User, Phone, Mail, Copy, CheckCircle, Loader2, X } from 'lucide-react';
import { useHospitalDashboard } from '@/features/hospitals/hooks/use-hospital-dashboard';
import { api } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';

interface Staff {
    id: string;
    name: string;
    phone: string;
    email?: string;
    staff_role: string;
    can_book_appointments: boolean;
    can_mark_payments: boolean;
    is_active: boolean;
    created_at: string;
}

interface AddStaffResponse {
    id: string;
    name: string;
    phone: string;
    email?: string;
    role: string;
    defaultPassword: string;
    message: string;
}

export default function StaffManagementPage() {
    const { data: dashboard, isLoading: dashboardLoading } = useHospitalDashboard();
    const [staff, setStaff] = useState<Staff[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newStaffResult, setNewStaffResult] = useState<AddStaffResponse | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
    });

    const hospitalId = dashboard?.hospital?.id;

    // Fetch staff list
    const fetchStaff = useCallback(async () => {
        if (!hospitalId) return;
        try {
            setIsLoading(true);
            // api.get already returns response.data, so we get Staff[] directly
            const staffList = await api.get<Staff[]>(endpoints.hospitals.staff(hospitalId));
            setStaff(staffList || []);
        } catch (error) {
            console.error('Error fetching staff:', error);
            toast.error('Failed to fetch staff list');
        } finally {
            setIsLoading(false);
        }
    }, [hospitalId]);

    useEffect(() => {
        if (hospitalId) {
            fetchStaff();
        }
    }, [hospitalId, fetchStaff]);

    // Add staff
    const handleAddStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!hospitalId) return;

        if (!formData.name || !formData.phone) {
            toast.error('Name and phone are required');
            return;
        }

        // Validate phone format
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(formData.phone)) {
            toast.error('Please enter a valid 10-digit Indian mobile number');
            return;
        }

        try {
            setIsSubmitting(true);
            // api.post already returns response.data directly
            const newStaff = await api.post<AddStaffResponse>(endpoints.hospitals.addStaff(hospitalId), {
                name: formData.name,
                phone: formData.phone,
                email: formData.email || undefined,
            });

            setNewStaffResult(newStaff);
            toast.success('Staff member added successfully!');
            fetchStaff();
        } catch (error: unknown) {
            console.error('Error adding staff:', error);
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to add staff member');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Remove staff
    const handleRemoveStaff = async (staffId: string) => {
        if (!hospitalId) return;
        if (!confirm('Are you sure you want to remove this staff member?')) return;

        try {
            await api.delete(endpoints.hospitals.removeStaff(hospitalId, staffId));
            toast.success('Staff member removed');
            fetchStaff();
        } catch (error) {
            console.error('Error removing staff:', error);
            toast.error('Failed to remove staff member');
        }
    };

    // Copy to clipboard
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    // Reset form
    const resetForm = () => {
        setFormData({ name: '', phone: '', email: '' });
        setNewStaffResult(null);
        setShowAddForm(false);
    };

    if (dashboardLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Staff Management</h1>
                    <p className="text-muted-foreground">
                        Add and manage reception staff for your hospital
                    </p>
                </div>
                {!showAddForm && !newStaffResult && (
                    <Button onClick={() => setShowAddForm(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Staff
                    </Button>
                )}
            </div>

            {/* Add Staff Form */}
            {(showAddForm || newStaffResult) && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>
                                {newStaffResult ? (
                                    <span className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        Staff Added Successfully
                                    </span>
                                ) : (
                                    'Add Reception Staff'
                                )}
                            </CardTitle>
                            {!newStaffResult && (
                                <CardDescription>
                                    Enter staff details below
                                </CardDescription>
                            )}
                        </div>
                        <Button variant="ghost" size="icon" onClick={resetForm}>
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {!newStaffResult ? (
                            <form onSubmit={handleAddStaff} className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            placeholder="Enter staff member name"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number *</Label>
                                        <Input
                                            id="phone"
                                            placeholder="10-digit mobile number"
                                            value={formData.phone}
                                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email (Optional)</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="staff@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Default password will be: <code className="bg-muted px-1 py-0.5 rounded">{formData.name.split(' ')[0].toLowerCase() || 'name'}@123</code>
                                </p>
                                <div className="flex gap-2">
                                    <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Adding...
                                            </>
                                        ) : (
                                            'Add Staff'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-muted-foreground">
                                    Share these login credentials with the staff member:
                                </p>
                                <div className="bg-muted p-4 rounded-lg space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Phone</p>
                                            <p className="font-medium">{newStaffResult.phone}</p>
                                        </div>
                                        <Button size="icon" variant="ghost" onClick={() => copyToClipboard(newStaffResult.phone)}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Password</p>
                                            <p className="font-medium font-mono">{newStaffResult.defaultPassword}</p>
                                        </div>
                                        <Button size="icon" variant="ghost" onClick={() => copyToClipboard(newStaffResult.defaultPassword)}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-sm text-amber-600">
                                    ⚠️ Staff should change their password on first login
                                </p>
                                <Button onClick={resetForm}>Done</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Staff List */}
            <Card>
                <CardHeader>
                    <CardTitle>Reception Staff</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center h-32">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    ) : staff.length === 0 ? (
                        <div className="text-center py-8">
                            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No staff members added yet</p>
                            <p className="text-sm text-muted-foreground">
                                Click &quot;Add Staff&quot; to add your first reception staff member
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-b-xl border -mx-6 -mb-6 overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-muted/40">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Staff Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y bg-background">
                                    {staff.map((member) => (
                                        <tr key={member.id} className="hover:bg-muted/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                                                        <User className="h-4 w-4" />
                                                    </div>
                                                    <p className="font-medium text-sm">{member.name}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5 text-sm">
                                                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                                        <span>{member.phone}</span>
                                                    </div>
                                                    {member.email && (
                                                        <div className="flex items-center gap-1.5 text-sm">
                                                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                                            <span>{member.email}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="secondary" className="capitalize">
                                                    {member.staff_role}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={member.is_active ? 'default' : 'destructive'}>
                                                    {member.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="text-destructive hover:text-destructive h-8 w-8"
                                                    onClick={() => handleRemoveStaff(member.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
