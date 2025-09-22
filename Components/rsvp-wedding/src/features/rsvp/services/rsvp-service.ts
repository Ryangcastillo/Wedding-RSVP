/**
 * RSVP API Service
 * Handles all RSVP-related API calls with proper error handling and validation
 * 
 * Reference: CONST-P8 (API First & Service Layer), CONST-P4 (Type Safety)
 */

import { RSVPFormData, RSVP } from '@/shared/types/rsvp';

const API_BASE = '/api';

export interface RSVPSubmissionResponse {
  success: boolean;
  message: string;
  id?: string;
  rsvp?: RSVP;
}

export interface RSVPListResponse {
  success: boolean;
  rsvps: RSVP[];
  count: number;
}

export class RSVPService {
  /**
   * Submit a new RSVP
   * @param rsvpData RSVP form data
   * @returns Promise with submission response
   */
  static async submitRSVP(rsvpData: RSVPFormData): Promise<RSVPSubmissionResponse> {
    try {
      const response = await fetch(`${API_BASE}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rsvpData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to submit RSVP');
      }

      return {
        success: true,
        message: data.message || 'RSVP submitted successfully',
        id: data.id,
        rsvp: data.rsvp,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error while submitting RSVP');
    }
  }

  /**
   * Get all RSVPs (admin only)
   * @returns Promise with RSVP list
   */
  static async getRSVPs(): Promise<RSVPListResponse> {
    try {
      const response = await fetch(`${API_BASE}/rsvp`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch RSVPs');
      }

      const rsvps: RSVP[] = await response.json();

      return {
        success: true,
        rsvps,
        count: rsvps.length,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error while fetching RSVPs');
    }
  }

  /**
   * Update an existing RSVP (future feature)
   * @param id RSVP ID
   * @param updates Partial RSVP data
   * @returns Promise with update response
   */
  static async updateRSVP(id: string, updates: Partial<RSVPFormData>): Promise<RSVPSubmissionResponse> {
    try {
      const response = await fetch(`${API_BASE}/rsvp/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update RSVP');
      }

      return {
        success: true,
        message: data.message || 'RSVP updated successfully',
        id: data.id,
        rsvp: data.rsvp,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error while updating RSVP');
    }
  }

  /**
   * Delete an RSVP (admin only)
   * @param id RSVP ID
   * @returns Promise with deletion response
   */
  static async deleteRSVP(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE}/rsvp/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete RSVP');
      }

      return {
        success: true,
        message: data.message || 'RSVP deleted successfully',
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error while deleting RSVP');
    }
  }

  /**
   * Search RSVPs by criteria (admin only)
   * @param query Search parameters
   * @returns Promise with filtered RSVPs
   */
  static async searchRSVPs(query: {
    name?: string;
    email?: string;
    attendance?: 'yes' | 'no' | 'maybe';
  }): Promise<RSVPListResponse> {
    try {
      const searchParams = new URLSearchParams();
      
      if (query.name) searchParams.append('name', query.name);
      if (query.email) searchParams.append('email', query.email);
      if (query.attendance) searchParams.append('attendance', query.attendance);

      const response = await fetch(`${API_BASE}/rsvp?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to search RSVPs');
      }

      const rsvps: RSVP[] = await response.json();

      return {
        success: true,
        rsvps,
        count: rsvps.length,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error while searching RSVPs');
    }
  }

  /**
   * Export RSVPs as CSV (admin only)
   * @returns Promise with CSV data
   */
  static async exportRSVPs(): Promise<string> {
    try {
      const { rsvps } = await this.getRSVPs();
      
      const headers = ['Name', 'Email', 'Attendance', 'Plus One', 'Plus One Name', 'Dietary Restrictions', 'Message', 'Submitted At'];
      const csvRows = [headers.join(',')];

      rsvps.forEach(rsvp => {
        const row = [
          `"${rsvp.name || ''}"`,
          `"${rsvp.email || ''}"`,
          `"${rsvp.attendance || ''}"`,
          `"${rsvp.plusOne ? 'Yes' : 'No'}"`,
          `"${rsvp.plusOneName || ''}"`,
          `"${rsvp.dietary || ''}"`,
          `"${rsvp.message || ''}"`,
          `"${rsvp.createdAt ? new Date(rsvp.createdAt).toLocaleString() : ''}"`,
        ];
        csvRows.push(row.join(','));
      });

      return csvRows.join('\n');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to export RSVPs');
    }
  }
}