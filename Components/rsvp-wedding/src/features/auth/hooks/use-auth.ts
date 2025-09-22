/**
 * Authentication Hooks
 * Custom React hooks for managing authentication state
 * 
 * Reference: CONST-P2 (AI-Driven Development), CONST-P5 (Security First)
 */

import { useState, useEffect, useCallback } from 'react';
import { AdminLoginData, AuthResponse, User } from '@/shared/types/auth';
import { AuthService } from '../services/auth-service';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

/**
 * Main authentication hook
 * Manages authentication state and provides auth methods
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const isAuth = AuthService.isAuthenticated();
        if (isAuth) {
          // Validate token if user appears to be authenticated
          const isValid = await AuthService.validateToken();
          setState(prev => ({
            ...prev,
            isAuthenticated: isValid,
            loading: false,
          }));
        } else {
          setState(prev => ({
            ...prev,
            isAuthenticated: false,
            loading: false,
          }));
        }
      } catch {
        setState(prev => ({
          ...prev,
          isAuthenticated: false,
          loading: false,
          error: 'Failed to initialize authentication',
        }));
      }
    };

    initAuth();
  }, []);

  /**
   * Login with credentials
   */
  const login = useCallback(async (credentials: AdminLoginData): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response: AuthResponse = await AuthService.login(credentials);

      if (response.success) {
        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          user: response.user || null,
          loading: false,
          error: null,
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          isAuthenticated: false,
          user: null,
          loading: false,
          error: response.message || 'Login failed',
        }));
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: errorMessage,
      }));
      return false;
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true }));

    try {
      await AuthService.logout();
      setState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });
    } catch {
      // Even if logout API fails, clear local state
      setState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    login,
    logout,
    clearError,
  };
}

/**
 * Hook for login form management
 */
export function useLoginForm() {
  const [credentials, setCredentials] = useState<AdminLoginData>({ password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error, clearError } = useAuth();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();

    try {
      const success = await login(credentials);
      if (success) {
        // Reset form on successful login
        setCredentials({ password: '' });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [credentials, login, clearError]);

  const handleInputChange = useCallback((field: keyof AdminLoginData, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  }, []);

  return {
    credentials,
    isSubmitting,
    error,
    handleSubmit,
    handleInputChange,
    clearError,
  };
}

/**
 * Hook to protect routes that require authentication
 */
export function useRequireAuth() {
  const { isAuthenticated, loading } = useAuth();

  return {
    isAuthenticated,
    loading,
    shouldRedirect: !loading && !isAuthenticated,
  };
}