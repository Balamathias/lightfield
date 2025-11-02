'use client';

import { useContactsByStatusChart } from '@/hooks/useDashboard';
import { Loader2, AlertCircle, Mail } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const STATUS_COLORS = {
  pending: '#f59e0b', // amber
  reviewed: '#3b82f6', // blue
  responded: '#10b981', // emerald
};

export default function ContactsByStatusChart() {
  const { data, isLoading, error } = useContactsByStatusChart();

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl shadow-md dark:border border-border/40 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-card-foreground">Contact Status</h3>
          <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
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
          <h3 className="text-lg font-semibold text-card-foreground">Contact Status</h3>
          <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
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

  const totalContacts = data?.reduce((sum, item) => sum + item.value, 0) || 0;

  return (
    <div className="bg-card rounded-xl shadow-md dark:border border-border/40 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Contact Status</h3>
          <p className="text-sm text-muted-foreground">Distribution by status</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
          <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            {totalContacts} total
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }: any) =>
              `${name}: ${((percent || 0) * 100).toFixed(0)}%`
            }
            outerRadius={100}
            dataKey="value"
          >
            {data?.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={STATUS_COLORS[entry.rawStatus as keyof typeof STATUS_COLORS] || '#6b7280'}
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
    </div>
  );
}
