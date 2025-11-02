'use client';

import { useState, useRef, useEffect } from 'react';
import { useContacts, useUpdateContactStatus } from '@/hooks/useContacts';
import type { ContactSubmission, ContactFilters } from '@/types';
import {
  Mail,
  MailOpen,
  CheckCircle,
  Loader2,
  X,
  Search,
  Phone,
  User,
  MessageSquare,
  Calendar,
  Sparkles,
  Check,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const statusConfig = {
  unread: {
    label: 'Unread',
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    icon: Mail,
  },
  read: {
    label: 'Read',
    color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    icon: MailOpen,
  },
  responded: {
    label: 'Responded',
    color: 'text-green-500 bg-green-500/10 border-green-500/20',
    icon: CheckCircle,
  },
};

export default function ContactsPage() {
  const [filters, setFilters] = useState<ContactFilters>({});
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read' | 'responded'>('all');

  const statusDropdownRef = useRef<HTMLDivElement>(null);

  const { data: contacts, isLoading } = useContacts(filters);
  const updateStatusMutation = useUpdateContactStatus();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setShowStatusFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusChange = async (id: number, status: 'read' | 'responded') => {
    try {
      await updateStatusMutation.mutateAsync({ id, status });
    } catch (error) {
      console.error('Failed to update contact status:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchQuery });
  };

  const openContactModal = async (contact: ContactSubmission) => {
    setSelectedContact(contact);
    // Mark as read if unread
    if (contact.status === 'unread') {
      await handleStatusChange(contact.id, 'read');
    }
  };

  const closeModal = () => {
    setSelectedContact(null);
  };

  const handleStatusFilterChange = (status: typeof statusFilter) => {
    setStatusFilter(status);
    if (status === 'all') {
      setFilters({ ...filters, status: undefined });
    } else {
      setFilters({ ...filters, status });
    }
    setShowStatusFilter(false);
  };

  const unreadCount = contacts?.filter((c) => c.status === 'unread').length || 0;
  const readCount = contacts?.filter((c) => c.status === 'read').length || 0;
  const respondedCount = contacts?.filter((c) => c.status === 'responded').length || 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 border border-primary/10">
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold">Contact Submissions</h1>
            </div>
            <p className="text-muted-foreground text-base">
              Manage and respond to contact form submissions
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl p-6 border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-600/5"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Mail className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{unreadCount}</p>
              <p className="text-sm text-muted-foreground mt-1">Unread</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl p-6 border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <MailOpen className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{readCount}</p>
              <p className="text-sm text-muted-foreground mt-1">Read</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-2xl p-6 border border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-600/5"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{respondedCount}</p>
              <p className="text-sm text-muted-foreground mt-1">Responded</p>
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
                placeholder="Search by name, email, or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-0 rounded-2xl text-foreground placeholder:text-muted-foreground transition-all"
              />
              {searchQuery && (
                <button
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
              className="group relative inline-flex items-center gap-3 px-5 py-3.5 backdrop-blur-sm hover:bg-background rounded-2xl transition-all border border-primary/10 hover:shadow-md"
            >
              {statusFilter === 'unread' ? (
                <Mail className="w-5 h-5 text-blue-500" />
              ) : statusFilter === 'read' ? (
                <MailOpen className="w-5 h-5 text-yellow-500" />
              ) : statusFilter === 'responded' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Sparkles className="w-5 h-5 text-primary" />
              )}
              <span className="text-foreground font-medium capitalize">{statusFilter}</span>
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
                  className="absolute right-0 mt-2 w-48 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden z-20"
                >
                  <div className="p-2">
                    {(['all', 'unread', 'read', 'responded'] as const).map((status) => (
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
                          {status === 'unread' && <Mail className="w-4 h-4" />}
                          {status === 'read' && <MailOpen className="w-4 h-4" />}
                          {status === 'responded' && <CheckCircle className="w-4 h-4" />}
                          {status === 'all' && <Sparkles className="w-4 h-4" />}
                          <span className="font-medium capitalize">{status}</span>
                        </div>
                        {statusFilter === status && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Active Filters */}
        {(searchQuery || statusFilter !== 'all') && (
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
                Status: {statusFilter}
                <button onClick={() => handleStatusFilterChange('all')} className="hover:text-primary/80">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
          </motion.div>
        )}
      </div>

      {/* Contacts Table */}
      <div className="relative overflow-hidden bg-card border border-border/10 rounded-3xl shadow-xl">
        <div className="relative z-10">
          {/* Table Header */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">All Contacts</h3>
                <p className="text-sm text-muted-foreground">
                  {contacts?.length || 0} submission{contacts?.length !== 1 ? 's' : ''}
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
              <p className="mt-4 text-muted-foreground font-medium">Loading contacts...</p>
            </div>
          ) : contacts && contacts.length > 0 ? (
            <div className="p-6 space-y-2">
              {contacts.map((contact, index) => {
                const StatusIcon = statusConfig[contact.status].icon;
                return (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => openContactModal(contact)}
                    className="group relative overflow-hidden bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 p-5 cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      {/* Status Icon */}
                      <div
                        className={`p-2.5 rounded-xl border ${statusConfig[contact.status].color} flex-shrink-0`}
                      >
                        <StatusIcon className="w-5 h-5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                              {contact.subject}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <User className="w-4 h-4" />
                                <span>{contact.name}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Mail className="w-4 h-4" />
                                <span className="truncate">{contact.email}</span>
                              </div>
                              {contact.phone && (
                                <div className="flex items-center gap-1.5">
                                  <Phone className="w-4 h-4" />
                                  <span>{contact.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{format(new Date(contact.created_at), 'MMM dd, yyyy')}</span>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {contact.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="p-6 bg-primary/5 rounded-3xl mb-6 ring-1 ring-primary/10">
                <MessageSquare className="w-20 h-20 text-primary/40" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">No contact submissions</h3>
              <p className="text-muted-foreground text-center max-w-md">
                {filters.status || searchQuery
                  ? 'No submissions match your filters'
                  : 'No contact submissions yet'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedContact && (
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
                {/* Modal Header */}
                <div className="flex items-start justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {selectedContact.subject}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border ${
                          statusConfig[selectedContact.status].color
                        }`}
                      >
                        {React.createElement(statusConfig[selectedContact.status].icon, {
                          className: 'w-3.5 h-3.5',
                        })}
                        {statusConfig[selectedContact.status].label}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(selectedContact.created_at), 'MMMM dd, yyyy • hh:mm a')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 bg-accent/30 rounded-xl border border-border/50">
                      <User className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Name</p>
                        <p className="font-semibold text-foreground">{selectedContact.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-accent/30 rounded-xl border border-border/50">
                      <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Email</p>
                        <a
                          href={`mailto:${selectedContact.email}`}
                          className="font-semibold text-primary hover:underline"
                        >
                          {selectedContact.email}
                        </a>
                      </div>
                    </div>

                    {selectedContact.phone && (
                      <div className="flex items-start gap-3 p-4 bg-accent/30 rounded-xl border border-border/50 md:col-span-2">
                        <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Phone</p>
                          <a
                            href={`tel:${selectedContact.phone}`}
                            className="font-semibold text-primary hover:underline"
                          >
                            {selectedContact.phone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Message
                    </label>
                    <div className="p-4 bg-accent/20 rounded-xl border border-border/50">
                      <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                        {selectedContact.message}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    {selectedContact.status !== 'responded' && (
                      <button
                        onClick={() => {
                          handleStatusChange(selectedContact.id, 'responded');
                          closeModal();
                        }}
                        disabled={updateStatusMutation.isPending}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl transition-all font-medium disabled:opacity-50 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Mark as Responded
                      </button>
                    )}
                    <a
                      href={`mailto:${selectedContact.email}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent hover:bg-accent/80 text-foreground rounded-xl transition-all font-medium border border-border hover:scale-105"
                    >
                      <Mail className="w-5 h-5" />
                      Reply via Email
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
