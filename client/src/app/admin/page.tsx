'use client';

import { useDashboardStats } from '@/hooks/useDashboard';
import { cn } from '@/lib/utils';
import {
  FileText,
  Users,
  Mail,
  Eye,
  TrendingUp,
  Loader2,
  AlertCircle,
  Plus,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import BlogViewsChart from '@/components/dashboard/BlogViewsChart';
import PostsTimelineChart from '@/components/dashboard/PostsTimelineChart';
import PostsByCategoryChart from '@/components/dashboard/PostsByCategoryChart';
import ContactsByStatusChart from '@/components/dashboard/ContactsByStatusChart';

export default function AdminDashboardPage() {
  const { data: stats, isLoading, error } = useDashboardStats();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const quickActions = [
    {
      label: 'Create New Blog',
      description: 'Write and publish a new blog post',
      icon: FileText,
      href: '/admin/blogs',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      hoverBg: 'hover:bg-blue-100 dark:hover:bg-blue-900/40',
    },
    {
      label: 'Add Associate',
      description: 'Add a new team member or associate',
      icon: Users,
      href: '/admin/associates',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
      hoverBg: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/40',
    },
    {
      label: 'View Contacts',
      description: 'Check new contact submissions',
      icon: Mail,
      href: '/admin/contacts',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
      hoverBg: 'hover:bg-purple-100 dark:hover:bg-purple-900/40',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground">Failed to load dashboard statistics</p>
        </div>
      </div>
    );
  }

  // Prepare chart data using CSS chart variables
  const blogData = [
    { name: 'Published', value: stats?.published_blogs || 0 },
    { name: 'Drafts', value: stats?.draft_blogs || 0 },
  ];

  const associateData = [
    { name: 'Active', value: stats?.active_associates || 0 },
    { name: 'Inactive', value: (stats?.total_associates || 0) - (stats?.active_associates || 0) },
  ];

  const contactData = [
    { name: 'Unread', value: stats?.unread_contacts || 0 },
    { name: 'Read', value: (stats?.total_contacts || 0) - (stats?.unread_contacts || 0) },
  ];

  const overviewData = [
    { name: 'Blogs', value: stats?.total_blogs || 0 },
    { name: 'Associates', value: stats?.total_associates || 0 },
    { name: 'Contacts', value: stats?.total_contacts || 0 },
  ];

  const statCards = [
    {
      title: 'Total Blog Posts',
      value: stats?.total_blogs || 0,
      subtitle: `${stats?.published_blogs || 0} published`,
      icon: FileText,
      bgColor: 'bg-chart-1/10',
      iconColor: 'text-chart-1'
    },
    {
      title: 'Team Associates',
      value: stats?.total_associates || 0,
      subtitle: `${stats?.active_associates || 0} active`,
      icon: Users,
      bgColor: 'bg-chart-2/10',
      iconColor: 'text-chart-2'
    },
    {
      title: 'Contact Submissions',
      value: stats?.total_contacts || 0,
      subtitle: `${stats?.unread_contacts || 0} unread`,
      icon: Mail,
      bgColor: 'bg-chart-3/10',
      iconColor: 'text-chart-3'
    },
    {
      title: 'Total Views',
      value: stats?.total_views || 0,
      subtitle: 'All blog posts',
      icon: Eye,
      bgColor: 'bg-chart-4/10',
      iconColor: 'text-chart-4'
    },
  ];

  // Chart colors from CSS variables
  const CHART_COLORS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)'
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header with CTA Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1.5 text-[15px]">Welcome back! Here's what's happening today.</p>
        </div>
        
        {/* Quick Actions Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="group relative inline-flex items-center gap-2.5 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 font-semibold text-[15px] tracking-tight hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
            <span>Quick Actions</span>
            <ChevronDown 
              className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} 
              strokeWidth={2.5}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 rounded-xl pointer-events-none" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/60 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Dropdown Header */}
              <div className="px-5 py-4 border-b border-border/60 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30">
                <div className="flex items-center gap-2.5">
                  <div>
                    <h3 className="text-sm font-bold text-foreground tracking-tight leading-none">Quick Actions</h3>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-none">Create and manage content</p>
                  </div>
                </div>
              </div>

              {/* Action Items */}
              <div className="p-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      window.location.href = action.href;
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-start gap-4 p-4 rounded-xl transition-all duration-200 ${action.hoverBg} group`}
                  >
                    <div className={`${action.bgColor} p-3 rounded-xl transition-transform group-hover:scale-110 duration-200 shadow-none`}>
                      <action.icon className={`w-5 h-5 ${action.color}`} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-[15px] font-semibold text-foreground tracking-tight leading-none mb-1.5">
                        {action.label}
                      </h4>
                      <p className="text-[13px] text-muted-foreground leading-snug">
                        {action.description}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground -rotate-90 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-card rounded-xl shadow-md dark:border border-border/40 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">{card.title}</p>
                <p className={cn("text-3xl font-bold mb-1", card.iconColor)}>{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.subtitle}</p>
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Overview Bar Chart */}
        <div className="bg-card rounded-xl shadow-sm dark:border border-border/40 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-card-foreground">Content Overview</h3>
            <TrendingUp className="w-5 h-5 text-chart-1" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={overviewData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" className="text-muted-foreground" />
              <YAxis className="text-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--card-foreground)'
                }}
              />
              <Bar dataKey="value" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Blog Status Pie Chart */}
        <div className="bg-card rounded-xl shadow-md dark:border border-border p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-6">Blog Post Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={blogData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                dataKey="value"
              >
                {blogData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Associates Status */}
        <div className="bg-card rounded-xl shadow-md dark:border border-border/40 p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-6">Team Associate Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={associateData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                dataKey="value"
              >
                {associateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[(index + 1) % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Contact Status */}
        <div className="bg-card rounded-xl shadow-sm dark:border border-border/40 p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-6">Contact Submissions</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={contactData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                dataKey="value"
              >
                {contactData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[(index + 2) % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Premium Analytics Charts */}
      <div className="mt-6 border-t border-border/50 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Advanced Analytics</h2>
            <p className="text-sm text-muted-foreground">Detailed insights and trends</p>
          </div>
        </div>

        {/* Area Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <BlogViewsChart days={30} />
          <PostsTimelineChart days={30} />
        </div>

        {/* Bar and Pie Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PostsByCategoryChart />
          <ContactsByStatusChart />
        </div>
      </div>
    </div>
  );
}
