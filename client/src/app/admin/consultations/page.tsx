'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  useAdminBookings,
  useAdminBookingDetail,
  useUpdateBookingAdmin,
  useConsultationStats,
} from '@/hooks/useConsultations';
import { useAssociates } from '@/hooks/useAssociates';
import type {
  BookingAdminListItem,
  BookingAdminDetail,
  BookingFilters,
  BookingStatus,
} from '@/types';
import {
  CalendarCheck,
  Search,
  X,
  User,
  Mail,
  Phone,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronDown,
  Sparkles,
  Check,
  Building,
  FileText,
  CreditCard,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Status configuration
const statusConfig: Record<
  BookingStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  pending_payment: {
    label: 'Pending Payment',
    color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    icon: Clock,
  },
  paid: {
    label: 'Paid',
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    icon: CreditCard,
  },
  confirmed: {
    label: 'Confirmed',
    color: 'text-green-500 bg-green-500/10 border-green-500/20',
    icon: CheckCircle,
  },
  completed: {
    label: 'Completed',
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    icon: Check,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-500 bg-red-500/10 border-red-500/20',
    icon: XCircle,
  },
  refunded: {
    label: 'Refunded',
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    icon: RefreshCw,
  },
};

// Valid status transitions
const validTransitions: Record<BookingStatus, BookingStatus[]> = {
  pending_payment: ['cancelled'],
  paid: ['confirmed', 'cancelled', 'refunded'],
  confirmed: ['completed', 'cancelled', 'refunded'],
  completed: ['refunded'],
  cancelled: [],
  refunded: [],
};

// Transition button styling
const transitionButtonConfig: Record<
  BookingStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  pending_payment: {
    label: 'Pending Payment',
    className:
      'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20',
    icon: Clock,
  },
  paid: {
    label: 'Mark Paid',
    className:
      'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20',
    icon: CreditCard,
  },
  confirmed: {
    label: 'Confirm',
    className:
      'bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20',
    icon: CheckCircle,
  },
  completed: {
    label: 'Complete',
    className:
      'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20',
    icon: Check,
  },
  cancelled: {
    label: 'Cancel',
    className:
      'bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20',
    icon: XCircle,
  },
  refunded: {
    label: 'Refund',
    className:
      'bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 border-purple-500/20',
    icon: RefreshCw,
  },
};

export default function ConsultationsPage() {
  const [filters, setFilters] = useState<BookingFilters>({});
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [selectedAssociate, setSelectedAssociate] = useState<number | null>(null);
  const [showAssociateDropdown, setShowAssociateDropdown] = useState(false);

  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const associateDropdownRef = useRef<HTMLDivElement>(null);

  const { data: bookings, isLoading } = useAdminBookings(filters);
  const { data: stats } = useConsultationStats();
  const { data: bookingDetail, isLoading: isDetailLoading } = useAdminBookingDetail(
    selectedBookingId || 0
  );
  const { data: associates } = useAssociates();
  const updateBookingMutation = useUpdateBookingAdmin();

  // Sync admin notes and associate when detail loads
  useEffect(() => {
    if (bookingDetail) {
      setAdminNotes(bookingDetail.admin_notes || '');
      setSelectedAssociate(bookingDetail.assigned_associate);
    }
  }, [bookingDetail]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setShowStatusFilter(false);
      }
      if (
        associateDropdownRef.current &&
        !associateDropdownRef.current.contains(event.target as Node)
      ) {
        setShowAssociateDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchQuery || undefined });
  };

  const handleStatusFilterChange = (status: 'all' | BookingStatus) => {
    setStatusFilter(status);
    if (status === 'all') {
      setFilters({ ...filters, status: undefined });
    } else {
      setFilters({ ...filters, status });
    }
    setShowStatusFilter(false);
  };

  const handleDateFromChange = (value: string) => {
    setDateFrom(value);
    setFilters({ ...filters, date_from: value || undefined });
  };

  const handleDateToChange = (value: string) => {
    setDateTo(value);
    setFilters({ ...filters, date_to: value || undefined });
  };

  const openBookingModal = (booking: BookingAdminListItem) => {
    setSelectedBookingId(booking.id);
  };

  const closeModal = () => {
    setSelectedBookingId(null);
    setAdminNotes('');
    setSelectedAssociate(null);
    setShowAssociateDropdown(false);
  };

  const handleStatusTransition = async (newStatus: BookingStatus) => {
    if (!selectedBookingId) return;
    try {
      await updateBookingMutation.mutateAsync({
        id: selectedBookingId,
        data: { status: newStatus },
      });
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  const handleSaveAdminNotes = async () => {
    if (!selectedBookingId) return;
    try {
      await updateBookingMutation.mutateAsync({
        id: selectedBookingId,
        data: { admin_notes: adminNotes },
      });
    } catch (error) {
      console.error('Failed to save admin notes:', error);
    }
  };

  const handleAssignAssociate = async (associateId: number | null) => {
    if (!selectedBookingId) return;
    setSelectedAssociate(associateId);
    setShowAssociateDropdown(false);
    try {
      await updateBookingMutation.mutateAsync({
        id: selectedBookingId,
        data: { assigned_associate: associateId },
      });
    } catch (error) {
      console.error('Failed to assign associate:', error);
    }
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || dateFrom || dateTo;

  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDateFrom('');
    setDateTo('');
    setFilters({});
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 border border-primary/10">
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold">Consultation Bookings</h1>
            </div>
            <p className="text-muted-foreground text-base">
              Manage consultation bookings, track payments and assign associates
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl p-6 border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-600/5"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <CalendarCheck className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">
                {stats?.total_bookings ?? 0}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Total Bookings</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl p-6 border border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-600/5"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">
                {stats?.paid_bookings ?? 0}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Paid Bookings</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-2xl p-6 border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-600/5"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">
                {stats?.formatted_revenue ?? '--'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Revenue</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative overflow-hidden rounded-2xl p-6 border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-600/5"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Clock className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">
                {stats?.pending_confirmations ?? 0}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Pending Confirmations
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters Section */}
      <div className="bg-card rounded-2xl border border-primary/10 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative group">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-muted-foreground transition-colors group-hover:text-primary" />
              <input
                type="text"
                placeholder="Search by name, email, or reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-0 rounded-2xl text-foreground placeholder:text-muted-foreground transition-all bg-accent/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({ ...filters, search: undefined });
                  }}
                  className="absolute right-3 p-1.5 hover:bg-accent rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </form>
          </div>

          {/* Status Filter */}
          <div className="relative" ref={statusDropdownRef}>
            <button
              onClick={() => setShowStatusFilter(!showStatusFilter)}
              className="group relative inline-flex items-center gap-3 px-5 py-3.5 backdrop-blur-sm hover:bg-background rounded-2xl transition-all border border-primary/10 hover:shadow-md w-full lg:w-auto"
            >
              {statusFilter !== 'all' ? (
                React.createElement(statusConfig[statusFilter].icon, {
                  className: `w-5 h-5 ${statusConfig[statusFilter].color.split(' ')[0]}`,
                })
              ) : (
                <Sparkles className="w-5 h-5 text-primary" />
              )}
              <span className="text-foreground font-medium">
                {statusFilter === 'all' ? 'All Statuses' : statusConfig[statusFilter].label}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${
                  showStatusFilter ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {showStatusFilter && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden z-20"
                >
                  <div className="p-2">
                    <button
                      onClick={() => handleStatusFilterChange('all')}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all ${
                        statusFilter === 'all'
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-accent text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span className="font-medium">All Statuses</span>
                      </div>
                      {statusFilter === 'all' && <Check className="w-4 h-4" />}
                    </button>
                    {(
                      [
                        'pending_payment',
                        'paid',
                        'confirmed',
                        'completed',
                        'cancelled',
                        'refunded',
                      ] as BookingStatus[]
                    ).map((status) => {
                      const config = statusConfig[status];
                      const StatusIcon = config.icon;
                      return (
                        <button
                          key={status}
                          onClick={() => handleStatusFilterChange(status)}
                          className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all ${
                            statusFilter === status
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-accent text-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <StatusIcon className="w-4 h-4" />
                            <span className="font-medium">{config.label}</span>
                          </div>
                          {statusFilter === status && <Check className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Date From */}
          <div className="relative">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => handleDateFromChange(e.target.value)}
              className="w-full lg:w-auto px-5 py-3.5 backdrop-blur-sm hover:bg-background rounded-2xl transition-all border border-primary/10 hover:shadow-md text-foreground bg-transparent cursor-pointer"
              placeholder="From date"
            />
          </div>

          {/* Date To */}
          <div className="relative">
            <input
              type="date"
              value={dateTo}
              onChange={(e) => handleDateToChange(e.target.value)}
              className="w-full lg:w-auto px-5 py-3.5 backdrop-blur-sm hover:bg-background rounded-2xl transition-all border border-primary/10 hover:shadow-md text-foreground bg-transparent cursor-pointer"
              placeholder="To date"
            />
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/50"
          >
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-sm font-medium">
                Search: {searchQuery}
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({ ...filters, search: undefined });
                  }}
                  className="hover:text-primary/80"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-sm font-medium">
                Status: {statusConfig[statusFilter].label}
                <button
                  onClick={() => handleStatusFilterChange('all')}
                  className="hover:text-primary/80"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {dateFrom && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-sm font-medium">
                From: {dateFrom}
                <button
                  onClick={() => handleDateFromChange('')}
                  className="hover:text-primary/80"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {dateTo && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-sm font-medium">
                To: {dateTo}
                <button
                  onClick={() => handleDateToChange('')}
                  className="hover:text-primary/80"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-muted-foreground hover:text-foreground rounded-xl text-sm font-medium transition-colors"
            >
              Clear all
            </button>
          </motion.div>
        )}
      </div>

      {/* Bookings List */}
      <div className="relative overflow-hidden bg-card border border-border/10 rounded-3xl shadow-xl">
        <div className="relative z-10">
          {/* Table Header */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <CalendarCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">All Bookings</h3>
                <p className="text-sm text-muted-foreground">
                  {bookings?.length || 0} booking{bookings?.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Table Content */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="mt-4 text-muted-foreground font-medium">
                Loading bookings...
              </p>
            </div>
          ) : bookings && bookings.length > 0 ? (
            <>
              {/* Desktop View */}
              <div className="hidden lg:block p-6 space-y-2">
                {bookings.map((booking, index) => {
                  const config = statusConfig[booking.status];
                  const StatusIcon = config.icon;
                  return (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => openBookingModal(booking)}
                      className="group relative overflow-hidden bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 p-5 cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        {/* Status Icon */}
                        <div
                          className={`p-2.5 rounded-xl border ${config.color} flex-shrink-0`}
                        >
                          <StatusIcon className="w-5 h-5" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                {booking.client_name}
                              </h3>
                              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                  <Mail className="w-4 h-4" />
                                  <span className="truncate">{booking.client_email}</span>
                                </div>
                                {booking.client_phone && (
                                  <div className="flex items-center gap-1.5">
                                    <Phone className="w-4 h-4" />
                                    <span>{booking.client_phone}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1.5">
                                  <FileText className="w-4 h-4" />
                                  <span className="font-mono text-xs">
                                    {booking.reference}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border ${config.color}`}
                              >
                                <StatusIcon className="w-3.5 h-3.5" />
                                {config.label}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Building className="w-4 h-4" />
                              <span>{booking.service_name}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <DollarSign className="w-4 h-4" />
                              <span className="font-semibold text-foreground">
                                {booking.formatted_amount}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <CalendarCheck className="w-4 h-4" />
                              <span>
                                {booking.preferred_date
                                  ? format(new Date(booking.preferred_date), 'MMM dd, yyyy')
                                  : '--'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              <span>{booking.preferred_time || '--'}</span>
                            </div>
                            {booking.payment_verified && (
                              <div className="flex items-center gap-1.5 text-green-500">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-xs font-medium">Verified</span>
                              </div>
                            )}
                            {booking.assigned_associate_name && (
                              <div className="flex items-center gap-1.5">
                                <User className="w-4 h-4" />
                                <span>{booking.assigned_associate_name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Mobile View with Table */}
              <div className="lg:hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border/50">
                      <TableHead className="text-foreground font-semibold">
                        Booking
                      </TableHead>
                      <TableHead className="text-foreground font-semibold text-center">
                        Status
                      </TableHead>
                      <TableHead className="text-foreground font-semibold text-right">
                        Amount
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <BookingMobileRow
                        key={booking.id}
                        booking={booking}
                        onClick={() => openBookingModal(booking)}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="p-6 bg-primary/5 rounded-3xl mb-6 ring-1 ring-primary/10">
                <CalendarCheck className="w-20 h-20 text-primary/40" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                No bookings found
              </h3>
              <p className="text-muted-foreground text-center max-w-md">
                {hasActiveFilters
                  ? 'No bookings match your current filters'
                  : 'No consultation bookings have been made yet'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedBookingId && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={closeModal}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-card to-card/95 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              >
                {isDetailLoading || !bookingDetail ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                      <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="mt-4 text-muted-foreground font-medium">
                      Loading booking details...
                    </p>
                  </div>
                ) : (
                  <BookingDetailContent
                    booking={bookingDetail}
                    associates={associates || []}
                    adminNotes={adminNotes}
                    selectedAssociate={selectedAssociate}
                    showAssociateDropdown={showAssociateDropdown}
                    associateDropdownRef={associateDropdownRef}
                    isPending={updateBookingMutation.isPending}
                    onClose={closeModal}
                    onAdminNotesChange={setAdminNotes}
                    onSaveAdminNotes={handleSaveAdminNotes}
                    onAssignAssociate={handleAssignAssociate}
                    onToggleAssociateDropdown={() =>
                      setShowAssociateDropdown(!showAssociateDropdown)
                    }
                    onStatusTransition={handleStatusTransition}
                  />
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== Booking Detail Modal Content ====================

interface BookingDetailContentProps {
  booking: BookingAdminDetail;
  associates: { id: number; name: string }[];
  adminNotes: string;
  selectedAssociate: number | null;
  showAssociateDropdown: boolean;
  associateDropdownRef: React.RefObject<HTMLDivElement | null>;
  isPending: boolean;
  onClose: () => void;
  onAdminNotesChange: (value: string) => void;
  onSaveAdminNotes: () => void;
  onAssignAssociate: (id: number | null) => void;
  onToggleAssociateDropdown: () => void;
  onStatusTransition: (status: BookingStatus) => void;
}

function BookingDetailContent({
  booking,
  associates,
  adminNotes,
  selectedAssociate,
  showAssociateDropdown,
  associateDropdownRef,
  isPending,
  onClose,
  onAdminNotesChange,
  onSaveAdminNotes,
  onAssignAssociate,
  onToggleAssociateDropdown,
  onStatusTransition,
}: BookingDetailContentProps) {
  const config = statusConfig[booking.status];
  const StatusIcon = config.icon;
  const transitions = validTransitions[booking.status];
  const associateName =
    associates.find((a) => a.id === selectedAssociate)?.name ||
    booking.assigned_associate_name;

  return (
    <>
      {/* Modal Header */}
      <div className="flex items-start justify-between p-6 border-b border-border sticky top-0 bg-card z-10 rounded-t-3xl">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {booking.client_name}
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border ${config.color}`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              {config.label}
            </span>
            <span className="text-sm text-muted-foreground font-mono">
              {booking.reference}
            </span>
            <span className="text-sm text-muted-foreground">
              {format(new Date(booking.created_at), 'MMMM dd, yyyy -- hh:mm a')}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-6 space-y-6">
        {/* Client Info */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            Client Information
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-accent/30 rounded-xl border border-border/50">
              <User className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Name</p>
                <p className="font-semibold text-foreground">{booking.client_name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-accent/30 rounded-xl border border-border/50">
              <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <a
                  href={`mailto:${booking.client_email}`}
                  className="font-semibold text-primary hover:underline"
                >
                  {booking.client_email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-accent/30 rounded-xl border border-border/50">
              <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Phone</p>
                <a
                  href={`tel:${booking.client_phone}`}
                  className="font-semibold text-primary hover:underline"
                >
                  {booking.client_phone}
                </a>
              </div>
            </div>

            {booking.client_company && (
              <div className="flex items-start gap-3 p-4 bg-accent/30 rounded-xl border border-border/50">
                <Building className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Company</p>
                  <p className="font-semibold text-foreground">
                    {booking.client_company}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Service Details */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            Service Details
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-accent/30 rounded-xl border border-border/50">
              <Building className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Service</p>
                <p className="font-semibold text-foreground">{booking.service_name}</p>
                {booking.service_detail && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {booking.service_detail.formatted_duration} --{' '}
                    {booking.service_detail.formatted_price}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-accent/30 rounded-xl border border-border/50">
              <CalendarCheck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Preferred Date & Time
                </p>
                <p className="font-semibold text-foreground">
                  {booking.preferred_date
                    ? format(new Date(booking.preferred_date), 'MMMM dd, yyyy')
                    : '--'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {booking.preferred_time || '--'}
                </p>
              </div>
            </div>

            {booking.custom_service_description && (
              <div className="flex items-start gap-3 p-4 bg-accent/30 rounded-xl border border-border/50 md:col-span-2">
                <FileText className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Custom Service Description
                  </p>
                  <p className="text-foreground">{booking.custom_service_description}</p>
                </div>
              </div>
            )}

            {booking.notes && (
              <div className="flex items-start gap-3 p-4 bg-accent/30 rounded-xl border border-border/50 md:col-span-2">
                <FileText className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Client Notes</p>
                  <p className="text-foreground whitespace-pre-wrap">{booking.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Details */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            Payment Details
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-4 bg-accent/30 rounded-xl border border-border/50">
              <DollarSign className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Amount</p>
                <p className="font-semibold text-foreground">
                  {booking.formatted_amount}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-accent/30 rounded-xl border border-border/50">
              <FileText className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Reference</p>
                <p className="font-semibold text-foreground font-mono text-sm">
                  {booking.paystack_reference || booking.reference}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-accent/30 rounded-xl border border-border/50">
              <CreditCard className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Payment Channel</p>
                <p className="font-semibold text-foreground capitalize">
                  {booking.payment_channel || '--'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-accent/30 rounded-xl border border-border/50">
              {booking.payment_verified ? (
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Payment Verified</p>
                <p
                  className={`font-semibold ${
                    booking.payment_verified ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {booking.payment_verified ? 'Yes' : 'No'}
                </p>
                {booking.payment_verified_at && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(
                      new Date(booking.payment_verified_at),
                      'MMM dd, yyyy hh:mm a'
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Associate Assignment */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            Assigned Associate
          </label>
          <div className="relative" ref={associateDropdownRef}>
            <button
              onClick={onToggleAssociateDropdown}
              className="w-full flex items-center justify-between gap-3 px-5 py-3.5 backdrop-blur-sm hover:bg-background rounded-2xl transition-all border border-primary/10 hover:shadow-md"
            >
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <span className="text-foreground font-medium">
                  {associateName || 'Unassigned'}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${
                  showAssociateDropdown ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {showAssociateDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden z-20 max-h-60 overflow-y-auto"
                >
                  <div className="p-2">
                    <button
                      onClick={() => onAssignAssociate(null)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all ${
                        selectedAssociate === null
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-accent text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        <span className="font-medium">Unassigned</span>
                      </div>
                      {selectedAssociate === null && <Check className="w-4 h-4" />}
                    </button>
                    {associates.map((associate) => (
                      <button
                        key={associate.id}
                        onClick={() => onAssignAssociate(associate.id)}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all ${
                          selectedAssociate === associate.id
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-accent text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span className="font-medium">{associate.name}</span>
                        </div>
                        {selectedAssociate === associate.id && (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Admin Notes */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            Admin Notes
          </label>
          <textarea
            value={adminNotes}
            onChange={(e) => onAdminNotesChange(e.target.value)}
            placeholder="Add internal notes about this booking..."
            rows={4}
            className="w-full px-4 py-3 bg-accent/20 rounded-xl border border-border/50 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={onSaveAdminNotes}
              disabled={isPending}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl transition-all text-sm font-medium disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              Save Notes
            </button>
          </div>
        </div>

        {/* Status Transition Buttons */}
        {transitions.length > 0 && (
          <div className="pt-4 border-t border-border">
            <label className="block text-sm font-semibold text-foreground mb-3">
              Update Status
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {transitions.map((targetStatus) => {
                const btnConfig = transitionButtonConfig[targetStatus];
                const BtnIcon = btnConfig.icon;
                return (
                  <button
                    key={targetStatus}
                    onClick={() => onStatusTransition(targetStatus)}
                    disabled={isPending}
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl transition-all font-medium border disabled:opacity-50 hover:scale-105 ${btnConfig.className}`}
                  >
                    <BtnIcon className="w-5 h-5" />
                    {btnConfig.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <a
            href={`mailto:${booking.client_email}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl transition-all font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
          >
            <Mail className="w-5 h-5" />
            Contact Client
          </a>
          <button
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent hover:bg-accent/80 text-foreground rounded-xl transition-all font-medium border border-border hover:scale-105"
          >
            <X className="w-5 h-5" />
            Close
          </button>
        </div>
      </div>
    </>
  );
}

// ==================== Mobile Booking Row ====================

interface BookingMobileRowProps {
  booking: BookingAdminListItem;
  onClick: () => void;
}

function BookingMobileRow({ booking, onClick }: BookingMobileRowProps) {
  const config = statusConfig[booking.status];
  const StatusIcon = config.icon;

  return (
    <TableRow
      onClick={onClick}
      className="hover:bg-muted/50 border-border/50 cursor-pointer"
    >
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg border ${config.color}`}>
              <StatusIcon className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground truncate text-sm">
                {booking.client_name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Building className="w-3 h-3" />
                <span className="truncate">{booking.service_name}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="w-3 h-3" />
            <span className="truncate">{booking.client_email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarCheck className="w-3 h-3" />
            <span>
              {booking.preferred_date
                ? format(new Date(booking.preferred_date), 'MMM dd')
                : '--'}
            </span>
            <Clock className="w-3 h-3 ml-1" />
            <span>{booking.preferred_time || '--'}</span>
          </div>
        </div>
      </TableCell>

      <TableCell className="text-center">
        <span
          className={`inline-flex items-center justify-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border ${config.color}`}
        >
          <StatusIcon className="w-3 h-3" />
        </span>
        {booking.payment_verified && (
          <div className="mt-1">
            <CheckCircle className="w-3.5 h-3.5 text-green-500 mx-auto" />
          </div>
        )}
      </TableCell>

      <TableCell className="text-right">
        <p className="text-sm font-semibold text-foreground">
          {booking.formatted_amount}
        </p>
        <p className="text-xs text-muted-foreground whitespace-nowrap">
          {format(new Date(booking.created_at), 'MMM dd')}
        </p>
      </TableCell>
    </TableRow>
  );
}
