/**
 * RSVP List Component
 * Admin dashboard component for managing and viewing RSVPs
 * 
 * Reference: CONST-P1 (Modular Architecture), CONST-P12 (Admin Interface), CONST-P4 (Type Safety)
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card';
import { Alert, AlertDescription } from '@/shared/components/alert';
import { useRSVPList } from '../hooks/use-rsvp';

interface RSVPListProps {
  className?: string;
}

export function RSVPList({ className }: RSVPListProps) {
  const {
    rsvps,
    loading,
    error,
    fetchRSVPs,
    searchRSVPs,
    deleteRSVP,
    exportRSVPs,
    clearError,
  } = useRSVPList();

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRSVP, setExpandedRSVP] = useState<string | null>(null);
  const [filterBy, setFilterBy] = useState<'all' | 'yes' | 'no' | 'maybe'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'attendance'>('date');

  // Computed values with filtering and sorting
  let filteredRSVPs = searchTerm
    ? rsvps.filter(rsvp => 
        rsvp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rsvp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rsvp.message && rsvp.message.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : rsvps;

  // Apply attendance filter
  if (filterBy !== 'all') {
    filteredRSVPs = filteredRSVPs.filter(rsvp => rsvp.attendance === filterBy);
  }

  // Apply sorting
  filteredRSVPs = [...filteredRSVPs].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'attendance':
        const order = { 'yes': 0, 'maybe': 1, 'no': 2 };
        return order[a.attendance] - order[b.attendance];
      case 'date':
      default:
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    }
  });

  const totalCount = rsvps.length;
  const attendingCount = rsvps.filter(rsvp => rsvp.attendance === 'yes').length;
  const declinedCount = rsvps.filter(rsvp => rsvp.attendance === 'no').length;
  const pendingCount = rsvps.filter(rsvp => rsvp.attendance === 'maybe').length;
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = async (rsvpId: string) => {
    if (deleteConfirm === rsvpId) {
      await deleteRSVP(rsvpId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(rsvpId);
      // Auto-clear confirmation after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      await searchRSVPs({ name: searchTerm });
    } else {
      await fetchRSVPs();
    }
  };

  const handleExport = async () => {
    await exportRSVPs();
  };

  const handleRefresh = async () => {
    clearError();
    await fetchRSVPs();
  };

  const getAttendanceColor = (attendance: string) => {
    switch (attendance) {
      case 'yes': return 'text-green-600 bg-green-50';
      case 'no': return 'text-red-600 bg-red-50';
      case 'maybe': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getAttendanceIcon = (attendance: string) => {
    switch (attendance) {
      case 'yes': return '✅';
      case 'no': return '❌';
      case 'maybe': return '❓';
      default: return '⚪';
    }
  };

  if (loading && rsvps.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading RSVPs...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>RSVP Management</span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button variant="outline" onClick={handleExport}>
                Export CSV
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            {/* Search */}
            <div className="flex gap-2 max-w-md">
              <Input
                type="text"
                placeholder="Search by name, email, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" onClick={handleSearch}>
                Search
              </Button>
              {searchTerm && (
                <Button variant="ghost" onClick={() => {
                  setSearchTerm('');
                  fetchRSVPs();
                }}>
                  Clear
                </Button>
              )}
            </div>

            {/* Filters and Sort */}
            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Filter:</label>
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as 'all' | 'yes' | 'no' | 'maybe')}
                  className="px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All ({totalCount})</option>
                  <option value="yes">Attending ({attendingCount})</option>
                  <option value="no">Not Attending ({declinedCount})</option>
                  <option value="maybe">Maybe ({pendingCount})</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Sort:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'attendance')}
                  className="px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="date">Latest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="attendance">By Response</option>
                </select>
              </div>

              <div className="text-sm text-muted-foreground flex items-center">
                Showing {filteredRSVPs.length} of {totalCount} RSVPs
              </div>
            </div>
          </div>

          {/* RSVP List */}
          {filteredRSVPs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="text-4xl mb-4">
                {searchTerm || filterBy !== 'all' ? '🔍' : '📝'}
              </div>
              <h3 className="text-lg font-medium mb-2">
                {searchTerm || filterBy !== 'all' ? 'No RSVPs match your criteria' : 'No RSVPs submitted yet'}
              </h3>
              <p className="text-sm">
                {searchTerm || filterBy !== 'all' 
                  ? 'Try adjusting your search or filter settings' 
                  : 'RSVPs will appear here once guests start submitting them'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRSVPs.map((rsvp) => (
                <div key={rsvp.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-lg">{rsvp.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAttendanceColor(rsvp.attendance)}`}>
                          {getAttendanceIcon(rsvp.attendance)} {rsvp.attendance}
                        </span>
                        {rsvp.plusOne && (
                          <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                            +1: {rsvp.plusOneName || 'Guest'}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        📧 {rsvp.email}
                      </div>
                      
                      {rsvp.dietary && (
                        <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                          <strong>Dietary:</strong> {rsvp.dietary}
                        </div>
                      )}
                      
                      {rsvp.message && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <strong>Message:</strong> {rsvp.message}
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        Submitted: {new Date(rsvp.submittedAt).toLocaleDateString()} at {new Date(rsvp.submittedAt).toLocaleTimeString()}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setExpandedRSVP(expandedRSVP === rsvp.id ? null : rsvp.id)}
                      >
                        {expandedRSVP === rsvp.id ? 'Hide Details' : 'View Details'}
                      </Button>
                      
                      <Button
                        variant={deleteConfirm === rsvp.id ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => handleDelete(rsvp.id)}
                      >
                        {deleteConfirm === rsvp.id ? 'Confirm Delete' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  {expandedRSVP === rsvp.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                      <div>
                        <strong className="text-sm font-medium text-gray-700">Full Details:</strong>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <strong>Name:</strong> {rsvp.name}
                        </div>
                        <div>
                          <strong>Email:</strong> {rsvp.email}
                        </div>
                        <div>
                          <strong>Attendance:</strong> 
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getAttendanceColor(rsvp.attendance)}`}>
                            {getAttendanceIcon(rsvp.attendance)} {rsvp.attendance}
                          </span>
                        </div>
                        {rsvp.plusOne && (
                          <div>
                            <strong>Plus One:</strong> {rsvp.plusOneName || 'Yes (name not provided)'}
                          </div>
                        )}
                      </div>
                      {rsvp.dietary && (
                        <div>
                          <strong className="text-sm font-medium text-gray-700">Dietary Restrictions:</strong>
                          <div className="mt-1 p-3 bg-amber-50 text-amber-700 rounded text-sm">
                            {rsvp.dietary}
                          </div>
                        </div>
                      )}
                      {rsvp.message && (
                        <div>
                          <strong className="text-sm font-medium text-gray-700">Message:</strong>
                          <div className="mt-1 p-3 bg-gray-50 rounded text-sm">
                            {rsvp.message}
                          </div>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 pt-2 border-t">
                        <strong>Submitted:</strong> {new Date(rsvp.submittedAt).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}