/**
 * RSVP Custom Hooks
 * React hooks for managing RSVP form state and submission
 * 
 * Reference: CONST-P2 (AI-Driven Development), CONST-P4 (Type Safety)
 */

import { useState, useCallback, useEffect } from 'react';
import { RSVPFormData, rsvpFormSchema, RSVP } from '@/shared/types/rsvp';
import { RSVPService, RSVPSubmissionResponse } from '../services/rsvp-service';
import { ZodError } from 'zod';

export interface RSVPFormState {
  data: RSVPFormData;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isSubmitted: boolean;
  submissionError: string | null;
  submissionSuccess: string | null;
}

/**
 * Hook for managing RSVP form state and submission
 */
export function useRSVPForm(initialData?: Partial<RSVPFormData>) {
  const [state, setState] = useState<RSVPFormState>({
    data: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      attendance: initialData?.attendance || 'yes',
      dietary: initialData?.dietary || '',
      plusOne: initialData?.plusOne || false,
      plusOneName: initialData?.plusOneName || '',
      message: initialData?.message || '',
    },
    errors: {},
    isSubmitting: false,
    isSubmitted: false,
    submissionError: null,
    submissionSuccess: null,
  });

  /**
   * Update form field value
   */
  const updateField = useCallback(<K extends keyof RSVPFormData>(
    field: K,
    value: RSVPFormData[K]
  ) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value },
      errors: { ...prev.errors, [field]: '' }, // Clear field error
      submissionError: null, // Clear submission errors
    }));
  }, []);

  /**
   * Validate form data using Zod schema
   */
  const validateForm = useCallback((data: RSVPFormData): { isValid: boolean; errors: Record<string, string> } => {
    try {
      rsvpFormSchema.parse(data);
      return { isValid: true, errors: {} };
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach(issue => {
          const path = issue.path.join('.');
          errors[path] = issue.message;
        });
        return { isValid: false, errors };
      }
      return { isValid: false, errors: { general: 'Validation failed' } };
    }
  }, []);

  /**
   * Submit RSVP form
   */
  const submitForm = useCallback(async (): Promise<boolean> => {
    setState(prev => ({ ...prev, isSubmitting: true, submissionError: null }));

    try {
      // Validate form data
      const validation = validateForm(state.data);
      if (!validation.isValid) {
        setState(prev => ({
          ...prev,
          errors: validation.errors,
          isSubmitting: false,
          submissionError: 'Please fix the errors above',
        }));
        return false;
      }

      // Submit to API
      const response: RSVPSubmissionResponse = await RSVPService.submitRSVP(state.data);

      setState(prev => ({
        ...prev,
        isSubmitting: false,
        isSubmitted: true,
        submissionSuccess: response.message,
        submissionError: null,
        errors: {},
      }));

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit RSVP';
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        submissionError: errorMessage,
      }));
      return false;
    }
  }, [state.data, validateForm]);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setState({
      data: {
        name: '',
        email: '',
        attendance: 'yes',
        dietary: '',
        plusOne: false,
        plusOneName: '',
        message: '',
      },
      errors: {},
      isSubmitting: false,
      isSubmitted: false,
      submissionError: null,
      submissionSuccess: null,
    });
  }, []);

  /**
   * Clear messages (success/error)
   */
  const clearMessages = useCallback(() => {
    setState(prev => ({
      ...prev,
      submissionError: null,
      submissionSuccess: null,
    }));
  }, []);

  return {
    ...state,
    updateField,
    submitForm,
    resetForm,
    clearMessages,
    validateForm,
  };
}

/**
 * Hook for managing RSVP list (admin functionality)
 */
export function useRSVPList() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all RSVPs
   */
  const fetchRSVPs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await RSVPService.getRSVPs();
      setRsvps(response.rsvps);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch RSVPs';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Search RSVPs
   */
  const searchRSVPs = useCallback(async (query: {
    name?: string;
    email?: string;
    attendance?: 'yes' | 'no' | 'maybe';
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await RSVPService.searchRSVPs(query);
      setRsvps(response.rsvps);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search RSVPs';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete an RSVP
   */
  const deleteRSVP = useCallback(async (id: string): Promise<boolean> => {
    try {
      await RSVPService.deleteRSVP(id);
      setRsvps(prev => prev.filter(rsvp => rsvp.id !== id));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete RSVP';
      setError(errorMessage);
      return false;
    }
  }, []);

  /**
   * Export RSVPs as CSV
   */
  const exportRSVPs = useCallback(async (): Promise<void> => {
    try {
      const csvData = await RSVPService.exportRSVPs();
      
      // Create and download file
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `wedding-rsvps-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export RSVPs';
      setError(errorMessage);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchRSVPs();
  }, [fetchRSVPs]);

  return {
    rsvps,
    loading,
    error,
    fetchRSVPs,
    searchRSVPs,
    deleteRSVP,
    exportRSVPs,
    clearError: () => setError(null),
  };
}

/**
 * Hook for RSVP analytics (admin functionality)
 */
export function useRSVPAnalytics(rsvps: RSVP[]) {
  const analytics = {
    total: rsvps.length,
    attending: rsvps.filter(rsvp => rsvp.attendance === 'yes').length,
    notAttending: rsvps.filter(rsvp => rsvp.attendance === 'no').length,
    maybe: rsvps.filter(rsvp => rsvp.attendance === 'maybe').length,
    plusOnes: rsvps.filter(rsvp => rsvp.plusOne).length,
    dietaryRestrictions: rsvps.filter(rsvp => rsvp.dietary && rsvp.dietary.trim().length > 0).length,
    attendanceRate: rsvps.length > 0 ? Math.round((rsvps.filter(rsvp => rsvp.attendance === 'yes').length / rsvps.length) * 100) : 0,
  };

  const recentRSVPs = rsvps
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const dietaryRequests = rsvps
    .filter(rsvp => rsvp.dietary && rsvp.dietary.trim().length > 0)
    .map(rsvp => ({ name: rsvp.name, dietary: rsvp.dietary }));

  return {
    analytics,
    recentRSVPs,
    dietaryRequests,
  };
}