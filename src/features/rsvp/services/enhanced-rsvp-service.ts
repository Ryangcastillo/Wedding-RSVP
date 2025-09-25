/**
 * Enhanced RSVP Service Implementation
 * Production-ready RSVP service using the service layer architecture
 * 
 * Reference: CONST-P4 (Type Safety), CONST-P6 (Error Handling), CONST-P12 (Admin Interface)
 */

import { ExtendedBaseService } from '@/lib/base-service';
import { apiClient } from '@/lib/api-client';
import { RSVP, RSVPFormData } from '@/shared/types/rsvp';

// Extended RSVP interface for the service layer that matches BaseEntity requirements
export interface ServiceRSVP extends Omit<RSVP, 'createdAt' | 'updatedAt' | 'submittedAt'> {
  id: string;
  createdAt: string;
  updatedAt: string;
  submittedAt: string;
}

// Service layer request types
export type CreateRSVPRequest = Omit<RSVPFormData, 'id'>;

export type UpdateRSVPRequest = Partial<Omit<RSVPFormData, 'id'>>;

export interface RSVPStats {
  total: number;
  attending: number;
  notAttending: number;
  pending: number;
  attendingPercentage: number;
  totalGuests: number;
  attendingGuests: number;
}

export interface DietaryRequirement {
  requirement: string;
  count: number;
  guests: string[];
}

export interface RSVPAnalytics {
  stats: RSVPStats;
  dietaryRequirements: DietaryRequirement[];
  recentActivity: Array<{
    id: string;
    guestName: string;
    action: 'created' | 'updated' | 'confirmed';
    timestamp: string;
    details?: string;
  }>;
  responseTimeline: Array<{
    date: string;
    responses: number;
    cumulative: number;
  }>;
}

class EnhancedRSVPService extends ExtendedBaseService<ServiceRSVP> {
  constructor() {
    super({
      baseEndpoint: '/rsvps',
      cacheTimeout: 2 * 60 * 1000, // 2 minutes for RSVP data
      enableCache: true
    });
  }

  /**
   * Create RSVP with form data
   */
  async createRSVP(formData: RSVPFormData): Promise<ServiceRSVP> {
    return this.handleServiceError(async () => {
      // Transform form data to service RSVP format
      const rsvpData = {
        name: formData.name,
        email: formData.email,
        attendance: formData.attendance,
        dietary: formData.dietary,
        plusOne: formData.plusOne,
        plusOneName: formData.plusOneName,
        message: formData.message,
        submittedAt: new Date().toISOString()
      };

      const response = await this.create(rsvpData);
      
      // Clear analytics cache when new RSVP is created
      this.clearCache('analytics');
      this.clearCache('stats');
      
      return response;
    }, 'create RSVP');
  }

  /**
   * Update RSVP with form data
   */
  async updateRSVP(id: string, formData: Partial<RSVPFormData>): Promise<ServiceRSVP> {
    return this.handleServiceError(async () => {
      const updateData = {
        name: formData.name,
        email: formData.email,
        attendance: formData.attendance,
        dietary: formData.dietary,
        plusOne: formData.plusOne,
        plusOneName: formData.plusOneName,
        message: formData.message
      };

      // Remove undefined values
      const cleanData = Object.fromEntries(
        Object.entries(updateData).filter(([, value]) => value !== undefined)
      );

      const response = await this.update(id, cleanData);
      
      // Clear analytics cache when RSVP is updated
      this.clearCache('analytics');
      this.clearCache('stats');
      
      return response;
    }, 'update RSVP');
  }

  /**
   * Get RSVP by email
   */
  async getByEmail(email: string): Promise<ServiceRSVP | null> {
    return this.handleServiceError<ServiceRSVP | null>(async () => {
      const cacheKey = this.getCacheKey('getByEmail', email);
      const cached = this.getCache<ServiceRSVP>(cacheKey);
      if (cached) return cached;

      try {
        const response = await apiClient.get<ServiceRSVP>(`${this.endpoint}/by-email/${encodeURIComponent(email)}`);
        this.setCache(cacheKey, response.data);
        return response.data;
      } catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
          return null;
        }
        throw error;
      }
    }, `fetch RSVP with email ${email}`);
  }

  /**
   * Get comprehensive RSVP statistics
   */
  async getStats(): Promise<RSVPStats> {
    return this.handleServiceError<RSVPStats>(async () => {
      const cacheKey = this.getCacheKey('stats');
      const cached = this.getCache<RSVPStats>(cacheKey);
      if (cached) return cached;

      const response = await apiClient.get<RSVPStats>(`${this.endpoint}/stats`);
      this.setCache(cacheKey, response.data);
      return response.data;
    }, 'fetch RSVP statistics');
  }

  /**
   * Get analytics data with dietary requirements and timeline
   */
  async getAnalytics(): Promise<RSVPAnalytics> {
    return this.handleServiceError<RSVPAnalytics>(async () => {
      const cacheKey = this.getCacheKey('analytics');
      const cached = this.getCache<RSVPAnalytics>(cacheKey);
      if (cached) return cached;

      const response = await apiClient.get<RSVPAnalytics>(`${this.endpoint}/analytics`);
      this.setCache(cacheKey, response.data, 5 * 60 * 1000); // 5 minute cache
      return response.data;
    }, 'fetch RSVP analytics');
  }

  /**
   * Get RSVPs with specific attendance status
   */
  async getByAttendanceStatus(attendance: 'yes' | 'no' | 'maybe'): Promise<ServiceRSVP[]> {
    return this.handleServiceError(async () => {
      const params = { attendance };
      return await this.getAll(params);
    }, `fetch ${attendance} RSVPs`);
  }

  /**
   * Search RSVPs by name or email
   */
  async searchRSVPs(query: string): Promise<ServiceRSVP[]> {
    return this.search(query, {});
  }

  /**
   * Get RSVPs requiring dietary accommodations
   */
  async getWithDietaryRequirements(): Promise<ServiceRSVP[]> {
    return this.handleServiceError(async () => {
      const params = { hasDietary: 'true' };
      return await this.getAll(params);
    }, 'fetch RSVPs with dietary requirements');
  }

  /**
   * Get recent RSVP activity
   */
  async getRecentActivity(limit: number = 10): Promise<ServiceRSVP[]> {
    return this.handleServiceError(async () => {
      const params = { 
        orderBy: 'updatedAt',
        order: 'desc',
        limit: limit.toString()
      };
      return await this.getAll(params);
    }, 'fetch recent RSVP activity');
  }

  /**
   * Export RSVPs to CSV format
   */
  async exportToCSV(filter: 'all' | 'yes' | 'no' | 'maybe' = 'all'): Promise<string> {
    return this.handleServiceError<string>(async () => {
      const params: Record<string, string> = filter !== 'all' ? { attendance: filter } : {};
      const response = await apiClient.get<string>(`${this.endpoint}/export/csv`, params);
      return response.data;
    }, 'export RSVPs to CSV');
  }

  /**
   * Send reminder emails to non-responders
   */
  async sendReminders(rsvpIds?: string[]): Promise<{ sent: number; failed: number }> {
    return this.handleServiceError<{ sent: number; failed: number }>(async () => {
      const body = rsvpIds ? { rsvpIds } : {};
      const response = await apiClient.post<{ sent: number; failed: number }>(`${this.endpoint}/send-reminders`, body);
      return response.data;
    }, 'send RSVP reminders');
  }

  /**
   * Bulk update attendance status
   */
  async bulkUpdateAttendance(updates: Array<{ id: string; attendance: 'yes' | 'no' | 'maybe' }>): Promise<ServiceRSVP[]> {
    return this.handleServiceError<ServiceRSVP[]>(async () => {
      const response = await apiClient.put<ServiceRSVP[]>(`${this.endpoint}/bulk-attendance`, { updates });
      this.clearCache(); // Clear all cache after bulk update
      return response.data;
    }, 'bulk update attendance');
  }

  /**
   * Convert service RSVP to display RSVP format
   */
  private convertToDisplayRSVP(serviceRSVP: ServiceRSVP): RSVP {
    return {
      ...serviceRSVP,
      createdAt: new Date(serviceRSVP.createdAt),
      updatedAt: new Date(serviceRSVP.updatedAt),
      submittedAt: new Date(serviceRSVP.submittedAt)
    };
  }

  /**
   * Get all RSVPs in display format
   */
  async getAllForDisplay(): Promise<RSVP[]> {
    const serviceRSVPs = await this.getAll();
    return serviceRSVPs.map(rsvp => this.convertToDisplayRSVP(rsvp));
  }

  /**
   * Get RSVP by ID in display format
   */
  async getByIdForDisplay(id: string): Promise<RSVP> {
    const serviceRSVP = await this.getById(id);
    return this.convertToDisplayRSVP(serviceRSVP);
  }
}

// Export singleton instance
export const enhancedRSVPService = new EnhancedRSVPService();