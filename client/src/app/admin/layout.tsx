'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { isAuthenticated, isAdmin, getCurrentUser } from '@/lib/api/client';
import {
  LayoutDashboard,
  FileText,
  Users,
  FolderOpen,
  Mail,
  LogOut,
  Menu,
  X,
  MessageSquare,
  BarChart3,
  Award,
  CalendarCheck,
  Briefcase,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const SIDEBAR_KEY = 'admin-sidebar-expanded';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/admin/blogs', icon: FileText, label: 'Blog Posts' },
  { href: '/admin/associates', icon: Users, label: 'Associates' },
  { href: '/admin/grants', icon: Award, label: 'Grants' },
  { href: '/admin/categories', icon: FolderOpen, label: 'Categories' },
  { href: '/admin/consultations', icon: CalendarCheck, label: 'Bookings', exact: true },
  { href: '/admin/consultations/services', icon: Briefcase, label: 'Services' },
  { href: '/admin/testimonials', icon: MessageSquare, label: 'Testimonials' },
  { href: '/admin/analytics', icon: BarChart3, label: 'AI Analytics' },
  { href: '/admin/contacts', icon: Mail, label: 'Contacts' },
];

function isNavActive(pathname: string, item: (typeof navItems)[number]) {
  if (item.exact) {
    // For exact routes: match the href itself or href + '/' only (not deeper sub-routes)
    return pathname === item.href || pathname === item.href + '/';
  }
  return pathname === item.href || pathname.startsWith(item.href + '/');
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  // Read sidebar state from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(SIDEBAR_KEY);
    if (stored !== null) {
      setExpanded(stored === 'true');
    }
  }, []);

  // Auth check
  useEffect(() => {
    if (pathname !== '/admin/login') {
      if (!isAuthenticated() || !isAdmin()) {
        router.push('/admin/login');
      } else {
        setUser(getCurrentUser());
      }
    }
  }, [pathname, router]);

  const toggleSidebar = useCallback(() => {
    setExpanded((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_KEY, String(next));
      return next;
    });
  }, []);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const sidebarWidth = expanded ? 'w-64' : 'w-[72px]';
  const mainMargin = expanded ? 'lg:ml-64' : 'lg:ml-[72px]';

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-background shadow-md dark:border-r dark:border-border/60 transition-all duration-300 ease-in-out
          ${sidebarWidth}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className={`flex items-center gap-3 py-5 transition-all duration-300 ${expanded ? 'px-6' : 'px-3 justify-center'}`}>
            <img
              src="/logo.png"
              alt="LightField Logo"
              className={`object-contain transition-all duration-300 ${expanded ? 'w-10 h-10' : 'w-9 h-9'}`}
            />
            {expanded && (
              <div className="min-w-0">
                <h1 className="font-bold text-foreground text-sm leading-tight">LightField</h1>
                <p className="text-[10px] text-muted-foreground">Admin Panel</p>
              </div>
            )}
            <button
              onClick={() => setMobileOpen(false)}
              className="ml-auto lg:hidden text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Collapse Toggle (desktop only) */}
          <div className={`hidden lg:flex px-3 mb-1 ${expanded ? 'justify-end' : 'justify-center'}`}>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {expanded ? (
                <PanelLeftClose className="w-4 h-4" />
              ) : (
                <PanelLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 ${expanded ? 'px-3 overflow-y-auto' : 'px-2'}`}>
            <div className={`space-y-2 ${expanded ? '' : 'py-1'}`}>
              {navItems.map((item) => {
                const active = isNavActive(pathname, item);
                return (
                  <div key={item.href} className="relative group">
                    <button
                      onClick={() => {
                        router.push(item.href);
                        setMobileOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 rounded-lg transition-colors duration-200
                        ${expanded ? 'px-3 py-2.5' : 'px-0 py-3 justify-center'}
                        ${active
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        }
                      `}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {expanded && (
                        <span className="font-medium text-sm truncate">{item.label}</span>
                      )}
                    </button>

                    {/* Tooltip (collapsed only, desktop only) */}
                    {!expanded && mounted && (
                      <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-popover border border-border rounded-lg shadow-lg text-sm font-medium text-popover-foreground whitespace-nowrap opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 z-[60]">
                        {item.label}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* User Info & Logout */}
          <div className={`border-t border-border bg-card transition-all duration-300 ${expanded ? 'p-3' : 'p-2'}`}>
            {expanded ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2 mb-2 bg-secondary rounded-lg">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground text-sm font-semibold">
                      {user?.username?.[0]?.toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.username || 'Admin'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="relative group">
                  <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-semibold">
                      {user?.username?.[0]?.toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-popover border border-border rounded-lg shadow-lg text-sm font-medium text-popover-foreground whitespace-nowrap opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 z-[60]">
                    {user?.username || 'Admin'}
                  </div>
                </div>
                <div className="relative group">
                  <button
                    onClick={handleLogout}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                  <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-popover border border-border rounded-lg shadow-lg text-sm font-medium text-popover-foreground whitespace-nowrap opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 z-[60]">
                    Logout
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out ${mainMargin}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/70 backdrop-blur-md px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold text-foreground capitalize">
              {pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 bg-background/70">{children}</main>
      </div>
    </div>
  );
}
