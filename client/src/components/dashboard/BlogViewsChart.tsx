'use client';

import { useBlogViewsChart } from '@/hooks/useDashboard';
import { Loader2, AlertCircle, Eye } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface BlogViewsChartProps {
  days?: number;
}

export default function BlogViewsChart({ days = 30 }: BlogViewsChartProps) {
  const { data, isLoading, error } = useBlogViewsChart(days);

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl shadow-md dark:border border-border/40 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Blog Views Over Time</h3>
            <p className="text-sm text-muted-foreground">Last {days} days</p>
          </div>
          <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
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
          <h3 className="text-lg font-semibold text-card-foreground">Blog Views Over Time</h3>
          <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
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
          <h3 className="text-lg font-semibold text-card-foreground">Blog Views Over Time</h3>
          <p className="text-sm text-muted-foreground">Traffic analysis - Last {days} days</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/30">
          <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
            {data?.reduce((sum, item) => sum + item.views, 0) || 0} total views
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
          <XAxis
            dataKey="date"
            className="text-muted-foreground"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }}
          />
          <YAxis className="text-muted-foreground" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--card-foreground)',
            }}
            labelFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              });
            }}
          />
          <Area
            type="monotone"
            dataKey="views"
            stroke="#9333ea"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorViews)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
