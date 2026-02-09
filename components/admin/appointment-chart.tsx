'use client';

import { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';

const dailyData = [
    { name: '00:00', total: 12 },
    { name: '04:00', total: 5 },
    { name: '08:00', total: 45 },
    { name: '12:00', total: 82 },
    { name: '16:00', total: 64 },
    { name: '20:00', total: 38 },
];

const weeklyData = [
    { name: 'Mon', total: 240 },
    { name: 'Tue', total: 300 },
    { name: 'Wed', total: 280 },
    { name: 'Thu', total: 350 },
    { name: 'Fri', total: 400 },
    { name: 'Sat', total: 150 },
    { name: 'Sun', total: 100 },
];

const monthlyData = [
    { name: 'Jan', total: 1200 },
    { name: 'Feb', total: 1500 },
    { name: 'Mar', total: 1800 },
    { name: 'Apr', total: 1600 },
    { name: 'May', total: 2100 },
    { name: 'Jun', total: 2400 },
    { name: 'Jul', total: 2200 },
];

export function AppointmentChart() {
    const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('day');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const data = timeframe === 'day' ? dailyData : timeframe === 'week' ? weeklyData : monthlyData;

    if (!isMounted) {
        return (
            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="h-[300px] w-full flex items-center justify-center bg-muted/10 animate-pulse rounded-lg">
                    <p className="text-sm text-muted-foreground">Loading chart...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold">Appointment Volume</h2>
                    <p className="text-sm text-muted-foreground">Monitor platform activity over time</p>
                </div>
                <div className="flex items-center gap-1 rounded-lg border p-1 bg-muted/50">
                    <button
                        onClick={() => setTimeframe('day')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeframe === 'day' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Day
                    </button>
                    <button
                        onClick={() => setTimeframe('week')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeframe === 'week' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Week
                    </button>
                    <button
                        onClick={() => setTimeframe('month')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeframe === 'month' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Month
                    </button>
                </div>
            </div>

            <div className="h-[300px] w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--card)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                fontSize: '12px',
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="total"
                            stroke="var(--primary)"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorTotal)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
