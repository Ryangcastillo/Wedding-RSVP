/**
 * Enhanced RSVP Hook
 * Integrates with enhanced RSVP service for production-ready RSVP management
 * 
 * Reference: CONST-P2 (AI-Driven Development), CONST-P4 (Type Safety)
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  enhancedRSVPService, 
  ServiceRSVP, 
  RSVPStats, 
  RSVPAnalytics,
  CreateRSVPRequest,
  UpdateRSVPRequest 
} from '../services/enhanced-rsvp-service';

export interface EnhancedRSVPState {
  rsvps: ServiceRSVP[];
  loading: boolean;
  error: string | null;
  stats: RSVPStats | null;
  analytics: RSVPAnalytics | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface RSVPFilters {
  attendance?: 'yes' | 'no' | 'maybe';
  search?: string;
  sortBy?: 'name' | 'email' | 'attendance' | 'submittedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

/**
 * Enhanced RSVP hook using service layer
 * Provides comprehensive RSVP management functionality
 */
export function useEnhancedRSVP() {
  const [state, setState] = useState<EnhancedRSVPState>({
    rsvps: [],
    loading: true,
    error: null,
    stats: null,
    analytics: null,
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
  });

  /**
   * Update state helper
   */
  const updateState = useCallback((updates: Partial<EnhancedRSVPState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Set error state
   */
  const setError = useCallback((error: string | null) => {
    updateState({ error, loading: false });
  }, [updateState]);

  /**
   * Load RSVPs with filters and pagination
   */
  const loadRSVPs = useCallback(async (filters: RSVPFilters = {}) => {
    try {
      updateState({ loading: true, error: null });

      const result = await enhancedRSVPService.getAll({
        page: filters.page || 1,
        limit: filters.limit || 50,
        search: filters.search,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        attendance: filters.attendance,
      });

      updateState({
        rsvps: result.rsvps,
        totalCount: result.total,
        currentPage: result.page,
        totalPages: result.totalPages,
        loading: false,
        error: null
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load RSVPs';
      setError(errorMessage);
      return { rsvps: [], total: 0, page: 1, totalPages: 0 };
    }
  }, [updateState, setError]);

  /**
   * Load RSVP statistics
   */
  const loadStats = useCallback(async () => {
    try {
      const stats = await enhancedRSVPService.getStats();
      updateState({ stats, error: null });
      return stats;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load RSVP stats';
      console.error(errorMessage);
      return null;
    }
  }, [updateState]);

  /**
   * Load RSVP analytics
   */
  const loadAnalytics = useCallback(async (period: '7d' | '30d' | '90d' | '1y' = '30d') => {
    try {
      const analytics = await enhancedRSVPService.getAnalytics(period);
      updateState({ analytics, error: null });
      return analytics;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load RSVP analytics';
      console.error(errorMessage);
      return null;
    }
  }, [updateState]);

  /**
   * Create new RSVP
   */
  const createRSVP = useCallback(async (data: CreateRSVPRequest): Promise<ServiceRSVP | null> => {
    try {
      updateState({ loading: true, error: null });

      const newRSVP = await enhancedRSVPService.create(data);

      // Add to local state
      setState(prev => ({
        ...prev,
        rsvps: [newRSVP, ...prev.rsvps],
        totalCount: prev.totalCount + 1,
        loading: false,
        error: null
      }));

      // Reload stats
      loadStats();

      return newRSVP;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create RSVP';
      setError(errorMessage);
      return null;
    }
  }, [updateState, setError, loadStats]);

  /**
   * Update existing RSVP
   */
  const updateRSVP = useCallback(async (id: string, updates: UpdateRSVPRequest): Promise<ServiceRSVP | null> => {
    try {
      updateState({ loading: true, error: null });

      const updatedRSVP = await enhancedRSVPService.update(id, updates);

      // Update in local state
      setState(prev => ({
        ...prev,
        rsvps: prev.rsvps.map(rsvp => rsvp.id === id ? updatedRSVP : rsvp),
        loading: false,
        error: null
      }));

      // Reload stats
      loadStats();

      return updatedRSVP;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update RSVP';
      setError(errorMessage);
      return null;
    }
  }, [updateState, setError, loadStats]);

  /**
   * Delete RSVP
   */
  const deleteRSVP = useCallback(async (id: string): Promise<boolean> => {
    try {
      updateState({ loading: true, error: null });

      await enhancedRSVPService.delete(id);

      // Remove from local state
      setState(prev => ({
        ...prev,
        rsvps: prev.rsvps.filter(rsvp => rsvp.id !== id),
        totalCount: prev.totalCount - 1,
        loading: false,
        error: null
      }));

      // Reload stats
      loadStats();

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete RSVP';
      setError(errorMessage);
      return false;
    }
  }, [updateState, setError, loadStats]);

  /**
   * Get RSVP by email
   */
  const getRSVPByEmail = useCallback(async (email: string): Promise<ServiceRSVP | null> => {
    try {
      const rsvp = await enhancedRSVPService.getByEmail(email);
      return rsvp;
    } catch (error) {
      console.error('Failed to get RSVP by email:', error);
      return null;
    }
  }, []);

  /**
   * Search RSVPs
   */
  const searchRSVPs = useCallback(async (
    query: string, 
    options: { limit?: number; offset?: number } = {}
  ) => {
    try {
      updateState({ loading: true, error: null });

      const result = await enhancedRSVPService.search(query, options);

      updateState({
        rsvps: result.items,
        totalCount: result.total,
        loading: false,
        error: null
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search RSVPs';
      setError(errorMessage);
      return { items: [], total: 0 };
    }
  }, [updateState, setError]);

  /**
   * Export RSVPs to CSV
   */
  const exportToCSV = useCallback(async (filter: 'all' | 'yes' | 'no' | 'maybe' = 'all'): Promise<string | null> => {
    try {
      const csvData = await enhancedRSVPService.exportToCSV(filter);
      return csvData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to export RSVPs';
      console.error(errorMessage);
      return null;
    }
  }, []);

  /**
   * Send reminder emails
   */
  const sendReminders = useCallback(async (rsvpIds?: string[]): Promise<{ sent: number; failed: number } | null> => {
    try {
      updateState({ loading: true, error: null });

      const result = await enhancedRSVPService.sendReminders(rsvpIds);

      updateState({ loading: false, error: null });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reminders';
      setError(errorMessage);
      return null;
    }
  }, [updateState, setError]);

  /**
   * Bulk update attendance
   */
  const bulkUpdateAttendance = useCallback(async (
    updates: Array<{ id: string; attendance: 'yes' | 'no' | 'maybe' }>
  ): Promise<ServiceRSVP[] | null> => {
    try {
      updateState({ loading: true, error: null });

      const updatedRSVPs = await enhancedRSVPService.bulkUpdateAttendance(updates);

      // Update local state
      updateState({
        rsvps: prev => prev.rsvps.map(rsvp => {
          const updated = updatedRSVPs.find(u => u.id === rsvp.id);
          return updated || rsvp;
        }),
        loading: false,
        error: null
      });

      // Reload stats
      loadStats();

      return updatedRSVPs;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to bulk update attendance';
      setError(errorMessage);
      return null;
    }
  }, [updateState, setError, loadStats]);

  /**
   * Initialize data on mount
   */
  useEffect(() => {
    const init = async () => {
      await Promise.all([
        loadRSVPs(),
        loadStats(),
        loadAnalytics()
      ]);
    };

    init();
  }, [loadRSVPs, loadStats, loadAnalytics]);

  return {
    // State
    ...state,
    
    // Actions
    loadRSVPs,
    loadStats,
    loadAnalytics,
    createRSVP,
    updateRSVP,
    deleteRSVP,
    getRSVPByEmail,
    searchRSVPs,
    exportToCSV,
    sendReminders,
    bulkUpdateAttendance,
    
    // Utilities
    refresh: () => loadRSVPs(),
    refreshStats: loadStats,
    refreshAnalytics: loadAnalytics,
  };
}

/**
 * Hook for RSVP form management
 * Provides form state and validation for RSVP submission
 */
export function useRSVPForm() {
  const [formData, setFormData] = useState<CreateRSVPRequest>({
    name: '',
    email: '',
    attendance: 'yes',
    guestCount: 1,
    dietaryRestrictions: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /**
   * Update form field
   */
  const updateField = useCallback((field: keyof CreateRSVPRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
    // Clear success when user makes changes
    if (success) setSuccess(false);
  }, [error, success]);

  /**
   * Validate form data
   */
  const validateForm = useCallback((): string | null => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Valid email is required';
    if (formData.guestCount < 1) return 'At least 1 guest is required';
    if (formData.guestCount > 10) return 'Maximum 10 guests allowed';
    return null;
  }, [formData]);

  /**
   * Submit RSVP form
   */
  const submitForm = useCallback(async (): Promise<boolean> => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return false;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const result = await enhancedRSVPService.create(formData);
      
      if (result) {
        setSuccess(true);
        // Optionally reset form
        // setFormData({ name: '', email: '', attendance: 'yes', guestCount: 1, dietaryRestrictions: '', message: '' });
        return true;
      } else {
        setError('Failed to submit RSVP');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit RSVP';
      setError(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  /**
   * Reset form
   */
  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      email: '',
      attendance: 'yes',
      guestCount: 1,
      dietaryRestrictions: '',
      message: '',
    });
    setError(null);
    setSuccess(false);
    setIsSubmitting(false);
  }, []);

  return {
    // Form state
    formData,
    isSubmitting,
    error,
    success,
    
    // Form actions
    updateField,
    submitForm,
    resetForm,
    validateForm,
    
    // Utilities
    isValid: !validateForm(),
  };
}