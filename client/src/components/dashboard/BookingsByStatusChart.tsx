'use client';

import { useConsultationStats } from '@/hooks/useConsultations';
import { Loader2, AlertCircle, CalendarCheck } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const STATUS_COLORS: Record<string, string> = {
  pending_payment: '#f59e0b',
  paid: '#3b82f6',
  confirmed: '#10b981',
  completed: '#059669',
  cancelled: '#ef4444',
  refunded: '#8b5cf6',
};

const STATUS_LABELS: Record<string, string> = {
  pending_payment: 'Pending Payment',
  paid: 'Paid',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export default function BookingsByStatusChart() {
  const { data, isLoading, error } = useConsultationStats();

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl shadow-md dark:border border-border/40 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-card-foreground">Booking Status</h3>
          <CalendarCheck className="w-5 h-5 text-brand-primary" />
        </div>
        <div className="flex items-center justify-center h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card rounded-xl shadow-md dark:border border-border/40 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-card-foreground">Booking Status</h3>
          <CalendarCheck className="w-5 h-5 text-brand-primary" />
        </div>
        <div className="flex items-center justify-center h-[300px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Failed to load chart data</p>
          </div>
        </div>
      </div>
    );
  }

  const chartData = (data?.status_breakdown || []).map((item) => ({
    name: STATUS_LABELS[item.status] || item.status,
    value: item.count,
    rawStatus: item.status,
  }));

  const totalBookings = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-card rounded-xl shadow-md dark:border border-border/40 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Booking Status</h3>
          <p className="text-sm text-muted-foreground">Distribution by status</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-primary/10">
          <CalendarCheck className="w-4 h-4 text-brand-primary" />
          <span className="text-sm font-medium text-brand-primary">
            {totalBookings} total
          </span>
        </div>
      </div>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }: any) =>
                `${name}: ${((percent || 0) * 100).toFixed(0)}%`
              }
              outerRadius={100}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={STATUS_COLORS[entry.rawStatus] || '#6b7280'}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--card-foreground)',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[300px]">
          <div className="text-center">
            <CalendarCheck className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No bookings yet</p>
          </div>
        </div>
      )}
    </div>
  );
}
