'use client';

import { useState } from 'react';
import {
    MessageSquare,
    Plus,
    Send,
} from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useMyTickets, useCreateTicket } from '@/features/support';
import type { CreateTicketInput, TicketCategory, TicketFilters } from '@/types';

const CATEGORIES: { value: TicketCategory; label: string }[] = [
    { value: 'appointment', label: 'Appointment' },
    { value: 'payment', label: 'Payment' },
    { value: 'refund', label: 'Refund' },
    { value: 'medicine_order', label: 'Medicine Order' },
    { value: 'technical', label: 'Technical Issue' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'other', label: 'Other' },
];

const STATUS_COLORS: Record<string, string> = {
    open: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    in_progress: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    waiting_on_customer: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    closed: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

export default function PatientSupportPage() {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<CreateTicketInput>({
        category: 'other',
        subject: '',
        description: '',
    });

    const { data, isLoading } = useMyTickets({ sortBy: 'createdAt', sortOrder: 'desc' });
    const createMutation = useCreateTicket();

    const tickets = data?.tickets ?? [];

    const handleCreate = async () => {
        if (!formData.subject || !formData.description) return;
        await createMutation.mutateAsync(formData);
        setFormData({ category: 'other', subject: '', description: '' });
        setShowForm(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Support</h1>
                    <p className="text-muted-foreground">Get help with your account or appointments</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Ticket
                </Button>
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="rounded-xl border p-4 space-y-4">
                    <h3 className="font-semibold">Create Support Ticket</h3>
                    <Select
                        value={formData.category}
                        onValueChange={(value: string) =>
                            setFormData((prev) => ({ ...prev, category: value as TicketCategory }))
                        }
                    >
                        <SelectTrigger className="w-full sm:w-[250px]">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            {CATEGORIES.map((c) => (
                                <SelectItem key={c.value} value={c.value}>
                                    {c.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                    />
                    <Textarea
                        placeholder="Describe your issue..."
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        rows={4}
                    />
                    <div className="flex gap-2">
                        <Button onClick={handleCreate} disabled={createMutation.isPending}>
                            <Send className="h-4 w-4 mr-2" />
                            {createMutation.isPending ? 'Submitting...' : 'Submit'}
                        </Button>
                        <Button variant="outline" onClick={() => setShowForm(false)}>
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {/* Tickets List */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner />
                </div>
            ) : tickets.length === 0 ? (
                <EmptyState
                    title="No support tickets"
                    description="You haven't created any support tickets yet."
                    icon={MessageSquare}
                />
            ) : (
                <div className="rounded-xl border divide-y">
                    {tickets.map((ticket) => (
                        <div key={ticket.id} className="p-4">
                            <div className="flex items-start justify-between mb-1">
                                <p className="font-medium">{ticket.subject}</p>
                                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${STATUS_COLORS[ticket.status] ?? ''}`}>
                                    {ticket.status.replace(/_/g, ' ')}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {ticket.ticketNumber ?? ticket.id.slice(0, 8)} · {ticket.category.replace(/_/g, ' ')}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {new Date(ticket.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
