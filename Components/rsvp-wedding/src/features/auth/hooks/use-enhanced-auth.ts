/**
 * Enhanced Authentication Hook
 * Integrates with enhanced auth service for production-ready authentication
 * 
 * Reference: CONST-P2 (AI-Driven Development), CONST-P5 (Security First)
 */

import { useState, useEffect, useCallback } from 'react';
import { enhancedAuthService, ServiceUser, ServiceLoginCredentials, CreateUserRequest, UpdateUserRequest } from '../services/enhanced-auth-service';

export interface EnhancedAuthState {
  isAuthenticated: boolean;
  user: ServiceUser | null;
  loading: boolean;
  error: string | null;
}

/**
 * Enhanced authentication hook using service layer
 * Provides comprehensive authentication functionality with error handling
 */
export function useEnhancedAuth() {
  const [state, setState] = useState<EnhancedAuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  /**
   * Update state helper
   */
  const updateState = useCallback((updates: Partial<EnhancedAuthState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Set error state
   */
  const setError = useCallback((error: string | null) => {
    updateState({ error, loading: false });
  }, [updateState]);

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        updateState({ loading: true, error: null });
        
        const currentUser = enhancedAuthService.getCurrentUser();
        const isAuth = enhancedAuthService.isAuthenticated();
        
        if (isAuth && currentUser) {
          // Validate current session
          try {
            const validatedUser = await enhancedAuthService.validateSession();
            updateState({
              isAuthenticated: true,
              user: validatedUser,
              loading: false,
              error: null
            });
          } catch (validationError) {
            console.warn('Session validation failed:', validationError);
            // Session invalid, try refresh
            try {
              await enhancedAuthService.refreshTokens();
              const refreshedUser = enhancedAuthService.getCurrentUser();
              updateState({
                isAuthenticated: true,
                user: refreshedUser,
                loading: false,
                error: null
              });
            } catch (refreshError) {
              console.warn('Token refresh failed:', refreshError);
              // Complete auth failure
              updateState({
                isAuthenticated: false,
                user: null,
                loading: false,
                error: null
              });
            }
          }
        } else {
          updateState({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: null
          });
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setError('Failed to initialize authentication');
      }
    };

    initAuth();
  }, [updateState, setError]);

  /**
   * Login with credentials
   */
  const login = useCallback(async (credentials: ServiceLoginCredentials): Promise<boolean> => {
    try {
      updateState({ loading: true, error: null });
      
      const response = await enhancedAuthService.login(credentials);
      
      updateState({
        isAuthenticated: true,
        user: response.user,
        loading: false,
        error: null
      });
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      return false;
    }
  }, [updateState, setError]);

  /**
   * Logout current user
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      updateState({ loading: true, error: null });
      
      await enhancedAuthService.logout();
      
      updateState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear state even if logout fails
      updateState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      });
    }
  }, [updateState]);

  /**
   * Change password for current user
   */
  const changePassword = useCallback(async (
    currentPassword: string, 
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      updateState({ loading: true, error: null });
      
      const result = await enhancedAuthService.changePassword(currentPassword, newPassword);
      
      updateState({ loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password change failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [updateState, setError]);

  /**
   * Update current user profile
   */
  const updateProfile = useCallback(async (updates: { name?: string; email?: string }): Promise<boolean> => {
    try {
      updateState({ loading: true, error: null });
      
      const updatedUser = await enhancedAuthService.updateProfile(updates);
      
      updateState({
        user: updatedUser,
        loading: false,
        error: null
      });
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
      setError(errorMessage);
      return false;
    }
  }, [updateState, setError]);

  /**
   * Request password reset
   */
  const requestPasswordReset = useCallback(async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      updateState({ loading: true, error: null });
      
      const result = await enhancedAuthService.requestPasswordReset({ email });
      
      updateState({ loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset request failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [updateState, setError]);

  /**
   * Confirm password reset with token
   */
  const confirmPasswordReset = useCallback(async (
    token: string, 
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      updateState({ loading: true, error: null });
      
      const result = await enhancedAuthService.confirmPasswordReset({ token, newPassword });
      
      updateState({ loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset confirmation failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [updateState, setError]);

  /**
   * Check if current user is admin
   */
  const isAdmin = useCallback((): boolean => {
    return enhancedAuthService.isAdmin();
  }, []);

  /**
   * Get access token
   */
  const getAccessToken = useCallback((): string | null => {
    return enhancedAuthService.getAccessToken();
  }, []);

  return {
    // State
    ...state,
    
    // Actions
    login,
    logout,
    changePassword,
    updateProfile,
    requestPasswordReset,
    confirmPasswordReset,
    
    // Utilities
    isAdmin,
    getAccessToken,
  };
}

/**
 * Admin-specific authentication hook
 * Provides additional admin user management functionality
 */
export function useAdminAuth() {
  const baseAuth = useEnhancedAuth();
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  /**
   * Create new user (admin only)
   */
  const createUser = useCallback(async (userData: CreateUserRequest): Promise<ServiceUser | null> => {
    try {
      setAdminLoading(true);
      setAdminError(null);
      
      const newUser = await enhancedAuthService.createUser(userData);
      
      setAdminLoading(false);
      return newUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'User creation failed';
      setAdminError(errorMessage);
      setAdminLoading(false);
      return null;
    }
  }, []);

  /**
   * Get all users with pagination (admin only)
   */
  const getAllUsers = useCallback(async (options: {
    page?: number;
    limit?: number;
    search?: string;
    role?: 'admin' | 'user';
    isActive?: boolean;
  } = {}) => {
    try {
      setAdminLoading(true);
      setAdminError(null);
      
      const result = await enhancedAuthService.getAllUsers(options);
      
      setAdminLoading(false);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
      setAdminError(errorMessage);
      setAdminLoading(false);
      return { users: [], total: 0, page: 1, totalPages: 0 };
    }
  }, []);

  /**
   * Update user (admin only)
   */
  const updateUser = useCallback(async (userId: string, updates: UpdateUserRequest): Promise<ServiceUser | null> => {
    try {
      setAdminLoading(true);
      setAdminError(null);
      
      const updatedUser = await enhancedAuthService.updateUser(userId, updates);
      
      setAdminLoading(false);
      return updatedUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'User update failed';
      setAdminError(errorMessage);
      setAdminLoading(false);
      return null;
    }
  }, []);

  /**
   * Delete user (admin only)
   */
  const deleteUser = useCallback(async (userId: string): Promise<boolean> => {
    try {
      setAdminLoading(true);
      setAdminError(null);
      
      await enhancedAuthService.deleteUser(userId);
      
      setAdminLoading(false);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'User deletion failed';
      setAdminError(errorMessage);
      setAdminLoading(false);
      return false;
    }
  }, []);

  /**
   * Get authentication statistics (admin only)
   */
  const getAuthStats = useCallback(async () => {
    try {
      setAdminLoading(true);
      setAdminError(null);
      
      const stats = await enhancedAuthService.getAuthStats();
      
      setAdminLoading(false);
      return stats;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch auth stats';
      setAdminError(errorMessage);
      setAdminLoading(false);
      return null;
    }
  }, []);

  /**
   * Get user sessions (admin only)
   */
  const getUserSessions = useCallback(async (userId?: string) => {
    try {
      setAdminLoading(true);
      setAdminError(null);
      
      const sessions = await enhancedAuthService.getUserSessions(userId);
      
      setAdminLoading(false);
      return sessions;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sessions';
      setAdminError(errorMessage);
      setAdminLoading(false);
      return [];
    }
  }, []);

  /**
   * Revoke user session (admin only)
   */
  const revokeSession = useCallback(async (sessionId: string): Promise<boolean> => {
    try {
      setAdminLoading(true);
      setAdminError(null);
      
      await enhancedAuthService.revokeSession(sessionId);
      
      setAdminLoading(false);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Session revocation failed';
      setAdminError(errorMessage);
      setAdminLoading(false);
      return false;
    }
  }, []);

  return {
    // Base auth functionality
    ...baseAuth,
    
    // Admin-specific state
    adminLoading,
    adminError,
    
    // Admin-specific actions
    createUser,
    getAllUsers,
    updateUser,
    deleteUser,
    getAuthStats,
    getUserSessions,
    revokeSession,
  };
}

/**
 * Hook for managing authentication errors
 * Provides error handling utilities for auth operations
 */
export function useAuthError() {
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showError = useCallback((message: string) => {
    setError(message);
    setIsVisible(true);
  }, []);

  const hideError = useCallback(() => {
    setIsVisible(false);
    // Clear error after animation
    setTimeout(() => setError(null), 300);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setIsVisible(false);
  }, []);

  return {
    error,
    isVisible,
    showError,
    hideError,
    clearError,
  };
}