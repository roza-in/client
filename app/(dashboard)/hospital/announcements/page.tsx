'use client';

import { useState } from 'react';
import { Megaphone, Plus, Pencil, Trash2 } from 'lucide-react';
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
import { useAnnouncements, useCreateAnnouncement, useDeleteAnnouncement } from '@/features/announcements';
import { useAuth } from '@/hooks/use-auth';
import type { CreateAnnouncementInput, AnnouncementType } from '@/types';

const ANNOUNCEMENT_TYPES: { value: AnnouncementType; label: string }[] = [
    { value: 'general', label: 'General' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'holiday', label: 'Holiday' },
    { value: 'policy', label: 'Policy' },
    { value: 'event', label: 'Event' },
];

const TYPE_COLORS: Record<string, string> = {
    general: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    maintenance: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    emergency: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    holiday: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    policy: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    event: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
};

export default function HospitalAnnouncementsPage() {
    const { user } = useAuth();
    const hospitalId = user?.hospital?.id ?? '';
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<CreateAnnouncementInput>({
        title: '',
        content: '',
        type: 'general',
    });

    const { data: announcements, isLoading } = useAnnouncements(hospitalId);
    const createMutation = useCreateAnnouncement();
    const deleteMutation = useDeleteAnnouncement();

    const handleCreate = async () => {
        if (!formData.title || !formData.content || !hospitalId) return;
        await createMutation.mutateAsync({ hospitalId, input: formData });
        setFormData({ title: '', content: '', type: 'general' });
        setShowForm(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Announcements</h1>
                    <p className="text-muted-foreground">Manage hospital announcements</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Announcement
                </Button>
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="rounded-xl border p-4 space-y-4">
                    <h3 className="font-semibold">Create Announcement</h3>
                    <Input
                        placeholder="Title"
                        value={formData.title}
                        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    />
                    <Textarea
                        placeholder="Content"
                        value={formData.content}
                        onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                        rows={3}
                    />
                    <Select
                        value={formData.type}
                        onValueChange={(value: string) =>
                            setFormData((prev) => ({ ...prev, type: value as AnnouncementType }))
                        }
                    >
                        <SelectTrigger className="w-50">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {ANNOUNCEMENT_TYPES.map((t) => (
                                <SelectItem key={t.value} value={t.value}>
                                    {t.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                        <Button onClick={handleCreate} disabled={createMutation.isPending}>
                            {createMutation.isPending ? 'Creating...' : 'Create'}
                        </Button>
                        <Button variant="outline" onClick={() => setShowForm(false)}>
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {/* Announcements List */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner />
                </div>
            ) : !announcements || announcements.length === 0 ? (
                <EmptyState
                    title="No announcements"
                    description="Create your first announcement to inform staff and patients."
                    icon={Megaphone}
                />
            ) : (
                <div className="space-y-4">
                    {announcements.map((ann) => (
                        <div key={ann.id} className="rounded-xl border p-4">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">{ann.title}</h3>
                                    <span className={`rounded-full px-2 py-0.5 text-xs ${TYPE_COLORS[ann.type] ?? ''}`}>
                                        {ann.type}
                                    </span>
                                    {!ann.isActive && (
                                        <span className="rounded-full bg-gray-100 text-gray-600 px-2 py-0.5 text-xs">
                                            Inactive
                                        </span>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteMutation.mutate({ hospitalId, announcementId: ann.id })}
                                    disabled={deleteMutation.isPending}
                                >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">{ann.content}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                                {new Date(ann.createdAt).toLocaleDateString()}
                                {ann.expiresAt && ` · Expires ${new Date(ann.expiresAt).toLocaleDateString()}`}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
