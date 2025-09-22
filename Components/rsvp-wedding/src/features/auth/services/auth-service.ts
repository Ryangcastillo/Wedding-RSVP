/**
 * Authentication API Service
 * Handles all authentication-related API calls with proper error handling
 * 
 * Reference: CONST-P5 (Security First), CONST-P8 (API First & Service Layer)
 */

import { AdminLoginData, AuthResponse } from '@/shared/types/auth';

const API_BASE = '/api/auth';

export class AuthService {
  /**
   * Admin login with credentials
   * @param credentials Login credentials
   * @returns Promise with auth response
   */
  static async login(credentials: AdminLoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Authentication failed' }));
        throw new Error(error.message || 'Authentication failed');
      }

      const data: AuthResponse = await response.json();
      
      // Store authentication state (secure token handling will be implemented later)
      if (data.success && data.token) {
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('authToken', data.token);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error during authentication');
    }
  }

  /**
   * Logout and clear authentication state
   */
  static async logout(): Promise<void> {
    try {
      // Call logout endpoint if it exists
      await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      }).catch(() => {
        // Ignore network errors on logout - still clear local state
      });
    } finally {
      // Always clear local authentication state
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('authToken');
    }
  }

  /**
   * Check if user is currently authenticated
   * @returns boolean indicating authentication status
   */
  static isAuthenticated(): boolean {
    const authStatus = localStorage.getItem('adminAuth');
    const token = localStorage.getItem('authToken');
    return authStatus === 'true' && token !== null;
  }

  /**
   * Get current authentication token
   * @returns token string or null
   */
  static getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Validate token and refresh if needed
   * @returns Promise<boolean> indicating if token is valid
   */
  static async validateToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch(`${API_BASE}/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Token is invalid, clear auth state
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      // Network error or token validation failed
      console.warn('Token validation failed:', error);
      return false;
    }
  }
}