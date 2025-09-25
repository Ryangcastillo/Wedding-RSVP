/**
 * Admin Guest Management Component
 * Advanced guest list management with bulk operations
 * 
 * Reference: CONST-P12 (Admin Interface), CONST-P4 (Type Safety)
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card';
import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/input';
import { Alert, AlertDescription } from '@/shared/components/alert';
import { RSVP } from '@/shared/types/rsvp';

interface AdminGuestManagementProps {
  rsvps: RSVP[];
  className?: string;
}

export function AdminGuestManagement({ rsvps, className }: AdminGuestManagementProps) {
  const [selectedGuests, setSelectedGuests] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Filter guests based on search
  const filteredGuests = rsvps.filter(rsvp => 
    rsvp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rsvp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectGuest = (guestId: string) => {
    const newSelected = new Set(selectedGuests);
    if (newSelected.has(guestId)) {
      newSelected.delete(guestId);
    } else {
      newSelected.add(guestId);
    }
    setSelectedGuests(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleSelectAll = () => {
    if (selectedGuests.size === filteredGuests.length) {
      setSelectedGuests(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedGuests(new Set(filteredGuests.map(rsvp => rsvp.id)));
      setShowBulkActions(true);
    }
  };

  const handleBulkDelete = () => {
    // In real implementation, this would call an API
    console.log('Bulk delete guests:', Array.from(selectedGuests));
    setSelectedGuests(new Set());
    setShowBulkActions(false);
  };

  const handleBulkEmail = () => {
    // In real implementation, this would open email composer
    console.log('Send bulk email to guests:', Array.from(selectedGuests));
  };

  const getGuestStatus = (rsvp: RSVP) => {
    switch (rsvp.attendance) {
      case 'yes':
        return { label: 'Attending', color: 'text-green-600 bg-green-50', icon: '✅' };
      case 'no':
        return { label: 'Not Attending', color: 'text-red-600 bg-red-50', icon: '❌' };
      case 'maybe':
        return { label: 'Maybe', color: 'text-yellow-600 bg-yellow-50', icon: '❓' };
      default:
        return { label: 'Unknown', color: 'text-gray-600 bg-gray-50', icon: '⚪' };
    }
  };

  // Guest summary stats
  const totalGuests = filteredGuests.length;
  const attendingGuests = filteredGuests.filter(rsvp => rsvp.attendance === 'yes');
  const totalAttending = attendingGuests.length + attendingGuests.filter(rsvp => rsvp.plusOne).length;

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalGuests}</div>
              <div className="text-sm text-muted-foreground">Total Responses</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalAttending}</div>
              <div className="text-sm text-muted-foreground">Expected Guests</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{attendingGuests.filter(rsvp => rsvp.plusOne).length}</div>
              <div className="text-sm text-muted-foreground">Plus Ones</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Guest Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search guests by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSelectAll}>
                {selectedGuests.size === filteredGuests.length ? 'Deselect All' : 'Select All'}
              </Button>
              <Button>
                Add Guest
              </Button>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {showBulkActions && (
            <Alert className="mb-4">
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>{selectedGuests.size} guests selected</span>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleBulkEmail}>
                      Send Email
                    </Button>
                    <Button size="sm" variant="outline">
                      Export Selected
                    </Button>
                    <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                      Delete Selected
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Guest List */}
          {filteredGuests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-lg font-medium mb-2">
                {searchTerm ? 'No guests match your search' : 'No guests yet'}
              </h3>
              <p className="text-sm">
                {searchTerm ? 'Try a different search term' : 'Guest RSVPs will appear here'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredGuests.map((rsvp) => {
                const status = getGuestStatus(rsvp);
                const isSelected = selectedGuests.has(rsvp.id);

                return (
                  <div 
                    key={rsvp.id} 
                    className={`border rounded-lg p-4 transition-colors ${
                      isSelected ? 'bg-primary/5 border-primary' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectGuest(rsvp.id)}
                          className="w-4 h-4 text-primary rounded focus:ring-primary"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-lg">{rsvp.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                              {status.icon} {status.label}
                            </span>
                            {rsvp.plusOne && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                                +1: {rsvp.plusOneName || 'Guest'}
                              </span>
                            )}
                          </div>
                          
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>📧 {rsvp.email}</div>
                            <div>📅 RSVP&apos;d: {new Date(rsvp.submittedAt).toLocaleDateString()}</div>
                            {rsvp.dietary && (
                              <div className="text-amber-600">🍽️ Special dietary needs</div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Email
                        </Button>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}