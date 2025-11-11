'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Clock,
  TrendingUp,
  Users,
  BookOpen,
  UserCheck,
  Briefcase,
  Loader2,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { useSoloAnalytics, useSoloAnalyticsTrends } from '@/hooks/useAnalytics';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function AnalyticsPage() {
  const [trendsDays, setTrendsDays] = useState(30);
  const { data: analytics, isLoading: analyticsLoading } = useSoloAnalytics();
  const { data: trends, isLoading: trendsLoading } = useSoloAnalyticsTrends(trendsDays);

  if (analyticsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const overview = analytics?.overview;
  const popularQuestions = analytics?.popular_questions || [];
  const contextUsage = analytics?.context_usage;

  // Prepare context usage data for pie chart
  const contextData = contextUsage
    ? [
        { name: 'Blog Posts', value: contextUsage.blog_posts_used, color: '#8B5CF6' },
        { name: 'Team Members', value: contextUsage.associates_used, color: '#3B82F6' },
        { name: 'Services', value: contextUsage.services_used, color: '#10B981' },
      ]
    : [];

  const statsCards = [
    {
      title: 'Total Conversations',
      value: overview?.total_chats || 0,
      icon: MessageCircle,
      change: '+12%',
      color: 'from-purple-600 to-blue-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Active Sessions',
      value: overview?.total_sessions || 0,
      icon: Users,
      change: '+8%',
      color: 'from-blue-600 to-cyan-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Avg Response Time',
      value: `${Math.round(overview?.avg_response_time_ms || 0)}ms`,
      icon: Clock,
      change: '-5%',
      color: 'from-green-600 to-emerald-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      iconColor: 'text-green-600',
    },
    {
      title: 'Engagement Rate',
      value: `${overview?.engagement_rate || 0}%`,
      icon: TrendingUp,
      change: '+15%',
      color: 'from-orange-600 to-red-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      iconColor: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Solo AI Analytics</h1>
          <p className="text-muted-foreground">Track usage, performance, and user engagement</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={trendsDays}
            onChange={(e) => setTrendsDays(Number(e.target.value))}
            className="px-4 py-2 bg-card border border-border rounded-xl text-sm focus:ring-2 focus:ring-purple-500/50"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden bg-card border border-border/60 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-[0.03] group-hover:opacity-[0.06] transition-opacity`} />

              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-12 h-12 ${stat.bgColor} rounded-xl mb-4`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>

              {/* Content */}
              <div className="relative">
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-foreground mb-2">{stat.value}</p>
                <div className="flex items-center gap-1">
                  <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">vs last period</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border/60 rounded-3xl p-6 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Usage Trends
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Daily conversation volume</p>
            </div>
          </div>

          {trendsLoading ? (
            <div className="flex items-center justify-center h-80">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            </div>
          ) : trends && trends.trends.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={trends.trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    padding: '12px',
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="chats"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Conversations"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 text-muted-foreground">
              <BarChart3 className="w-12 h-12 mb-2 opacity-20" />
              <p className="text-sm">No data available yet</p>
            </div>
          )}
        </motion.div>

        {/* Context Usage Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border/60 rounded-3xl p-6 shadow-xl"
        >
          <div className="mb-6">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-600" />
              Context Usage
            </h2>
            <p className="text-sm text-muted-foreground mt-1">What content Solo references</p>
          </div>

          {contextData.some(d => d.value > 0) ? (
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={contextData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {contextData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      padding: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 text-muted-foreground">
              <Briefcase className="w-12 h-12 mb-2 opacity-20" />
              <p className="text-sm">No context data yet</p>
            </div>
          )}

          {/* Legend */}
          <div className="mt-6 space-y-2">
            {contextData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Popular Questions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card border border-border/60 rounded-3xl p-6 shadow-xl"
      >
        <div className="mb-6">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            Most Popular Questions
          </h2>
          <p className="text-sm text-muted-foreground mt-1">What users ask Solo the most</p>
        </div>

        {popularQuestions.length > 0 ? (
          <div className="space-y-3">
            {popularQuestions.map((question, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className="flex items-center gap-4 p-4 bg-muted/30 hover:bg-muted/50 rounded-xl transition-all group"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {question.user_message}
                  </p>
                </div>
                <div className="flex-shrink-0 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <span className="text-sm font-bold text-purple-600">{question.count}</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <MessageCircle className="w-12 h-12 mb-2 opacity-20" />
            <p className="text-sm">No questions tracked yet</p>
            <p className="text-xs mt-1">Data will appear as users interact with Solo</p>
          </div>
        )}
      </motion.div>

      {/* Response Time Trends */}
      {trends && trends.trends.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card border border-border/60 rounded-3xl p-6 shadow-xl"
        >
          <div className="mb-6">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Response Time Trends
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Average AI response speed over time</p>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trends.trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} label={{ value: 'ms', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  padding: '12px',
                }}
                labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              />
              <Bar dataKey="avg_response_time" fill="#8B5CF6" radius={[8, 8, 0, 0]} name="Avg Response Time (ms)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Insights & Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border border-purple-200/50 dark:border-purple-800/30 rounded-3xl p-6"
      >
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          Key Insights
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm font-semibold text-foreground mb-2">💡 Content Opportunities</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Popular questions reveal content gaps. Consider creating blog posts about frequently asked topics.
            </p>
          </div>
          <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm font-semibold text-foreground mb-2">📊 Performance</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Response times under 2000ms provide excellent user experience. Monitor for spikes.
            </p>
          </div>
          <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm font-semibold text-foreground mb-2">🎯 Engagement</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Higher engagement rates indicate users find Solo's suggestions helpful and actionable.
            </p>
          </div>
          <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm font-semibold text-foreground mb-2">📚 Context Usage</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Frequent blog/team references show Solo is effectively using your content database.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
