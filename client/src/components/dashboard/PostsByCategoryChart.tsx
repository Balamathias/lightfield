'use client';

import { usePostsByCategoryChart } from '@/hooks/useDashboard';
import { Loader2, AlertCircle, FolderOpen } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function PostsByCategoryChart() {
  const { data, isLoading, error } = usePostsByCategoryChart();

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl shadow-md dark:border border-border/40 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-card-foreground">Posts by Category</h3>
          <FolderOpen className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
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
          <h3 className="text-lg font-semibold text-card-foreground">Posts by Category</h3>
          <FolderOpen className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
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

  return (
    <div className="bg-card rounded-xl shadow-md dark:border border-border/40 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Posts by Category</h3>
          <p className="text-sm text-muted-foreground">Content distribution across categories</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/30">
          <FolderOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
            {data?.length || 0} categories
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <defs>
            <linearGradient id="colorCategory" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#0891b2" stopOpacity={0.7} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
          <XAxis
            dataKey="category"
            className="text-muted-foreground"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis className="text-muted-foreground" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--card-foreground)',
            }}
          />
          <Bar dataKey="posts" fill="url(#colorCategory)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
