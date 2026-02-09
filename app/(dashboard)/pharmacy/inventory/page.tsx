'use client';

import { useState } from 'react';
import { Package, AlertTriangle, Plus, Search } from 'lucide-react';
import { StatsCard } from '@/components/patients';

export default function PharmacyInventoryPage() {
    const [searchQuery, setSearchQuery] = useState('');

    // Placeholder data
    const inventory = [
        { id: '1', name: 'Paracetamol 500mg', category: 'Analgesic', stock: 500, minStock: 100, price: 12, expiry: '2025-06-15' },
        { id: '2', name: 'Amoxicillin 500mg', category: 'Antibiotic', stock: 20, minStock: 50, price: 45, expiry: '2025-03-20' },
        { id: '3', name: 'Metformin 500mg', category: 'Antidiabetic', stock: 300, minStock: 100, price: 8, expiry: '2025-12-01' },
        { id: '4', name: 'Omeprazole 20mg', category: 'Antacid', stock: 15, minStock: 30, price: 25, expiry: '2025-04-10' },
        { id: '5', name: 'Azithromycin 250mg', category: 'Antibiotic', stock: 80, minStock: 50, price: 65, expiry: '2025-08-22' },
    ];

    const stats = {
        totalItems: 156,
        lowStock: 8,
        expiringSoon: 3,
        totalValue: 125000,
    };

    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Inventory Management</h1>
                    <p className="text-muted-foreground">Track and manage medicine stock</p>
                </div>
                <button className="flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm hover:bg-primary/90">
                    <Plus className="h-4 w-4" />
                    Add Medicine
                </button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <StatsCard title="Total Items" value={stats.totalItems} icon={Package} variant="primary" />
                <StatsCard title="Low Stock" value={stats.lowStock} icon={AlertTriangle} variant="warning" />
                <StatsCard title="Expiring Soon" value={stats.expiringSoon} icon={AlertTriangle} variant="warning" />
                <StatsCard title="Stock Value" value={`₹${(stats.totalValue / 1000).toFixed(0)}K`} icon={Package} />
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search medicines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border bg-background pl-10 pr-4 py-2"
                />
            </div>

            {/* Inventory Table */}
            <div className="rounded-xl border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="text-left p-4 font-medium">Medicine</th>
                            <th className="text-left p-4 font-medium">Category</th>
                            <th className="text-right p-4 font-medium">Stock</th>
                            <th className="text-right p-4 font-medium">Min</th>
                            <th className="text-right p-4 font-medium">Price</th>
                            <th className="text-left p-4 font-medium">Expiry</th>
                            <th className="text-left p-4 font-medium">Status</th>
                            <th className="p-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredInventory.map((item) => (
                            <tr key={item.id} className="hover:bg-muted/30">
                                <td className="p-4 font-medium">{item.name}</td>
                                <td className="p-4 text-muted-foreground">{item.category}</td>
                                <td className="p-4 text-right">{item.stock}</td>
                                <td className="p-4 text-right text-muted-foreground">{item.minStock}</td>
                                <td className="p-4 text-right">₹{item.price}</td>
                                <td className="p-4 text-muted-foreground">
                                    {new Date(item.expiry).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                                </td>
                                <td className="p-4">
                                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs ${item.stock < item.minStock
                                        ? 'bg-red-100 text-red-700'
                                        : item.stock < item.minStock * 1.5
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-green-100 text-green-700'
                                        }`}>
                                        {item.stock < item.minStock ? 'Low Stock' : item.stock < item.minStock * 1.5 ? 'Warning' : 'OK'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button className="rounded-md border px-3 py-1 text-sm hover:bg-muted">
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
