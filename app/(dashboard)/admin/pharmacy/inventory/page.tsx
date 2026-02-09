'use client';

import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Plus, Search, AlertTriangle } from 'lucide-react';
import { SearchInput, Pagination } from '@/components/shared';

export const metadata: Metadata = {
    title: 'Pharmacy Inventory',
    description: 'Manage pharmacy inventory.',
};

export default function AdminPharmacyInventoryPage() {
    const products = [
        { id: '1', name: 'Paracetamol 500mg', category: 'Pain Relief', stock: 500, price: 25, status: 'in_stock' },
        { id: '2', name: 'Amoxicillin 500mg', category: 'Antibiotics', stock: 12, price: 150, status: 'low_stock' },
        { id: '3', name: 'Vitamin C 1000mg', category: 'Supplements', stock: 200, price: 80, status: 'in_stock' },
        { id: '4', name: 'Omeprazole 20mg', category: 'Gastro', stock: 0, price: 120, status: 'out_of_stock' },
    ];

    return (
        <div className="p-6">
            <Link
                href="/admin/pharmacy"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to pharmacy
            </Link>

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Inventory</h1>
                <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                    <Plus className="h-4 w-4" />
                    Add Product
                </button>
            </div>

            <SearchInput placeholder="Search products..." onSearch={() => { }} className="mb-6 max-w-md" />

            <div className="rounded-xl border overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-muted/50">
                            <th className="px-4 py-3 text-left text-sm font-medium">Product</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Stock</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td className="px-4 py-4 font-medium">{product.name}</td>
                                <td className="px-4 py-4 text-sm">{product.category}</td>
                                <td className="px-4 py-4 text-sm">
                                    {product.stock === 0 ? (
                                        <span className="text-destructive">0</span>
                                    ) : product.stock < 50 ? (
                                        <span className="flex items-center gap-1 text-yellow-600">
                                            <AlertTriangle className="h-3.5 w-3.5" />
                                            {product.stock}
                                        </span>
                                    ) : (
                                        product.stock
                                    )}
                                </td>
                                <td className="px-4 py-4 text-sm">₹{product.price}</td>
                                <td className="px-4 py-4">
                                    <span className={`rounded-full px-2 py-0.5 text-xs ${product.status === 'in_stock'
                                        ? 'bg-green-100 text-green-700'
                                        : product.status === 'low_stock'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-red-100 text-red-700'
                                        }`}>
                                        {product.status.replace('_', ' ')}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6">
                <Pagination currentPage={1} totalPages={1} />
            </div>
        </div>
    );
}
