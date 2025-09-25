import { BaseService } from '@/lib/base-service';
import { apiClient } from '@/lib/api-client';

// Service layer types for authentication (API representation)
export interface ServiceUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  isActive: boolean;
  lastLogin?: string; // ISO string date
  createdAt: string;
  updatedAt: string;
}

export interface ServiceAuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: string; // ISO string date
  tokenType: 'Bearer';
}

export interface ServiceLoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ServiceLoginResponse {
  user: ServiceUser;
  tokens: ServiceAuthToken;
  sessionId: string;
}

export interface ServiceSession {
  id: string;
  userId: string;
  isActive: boolean;
  expiresAt: string; // ISO string date
  userAgent?: string;
  ipAddress?: string;
  createdAt: string;
  lastActivity: string;
}

// Authentication statistics interface
export interface AuthStats {
  totalUsers: number;
  activeUsers: number; // Active in last 30 days
  adminUsers: number;
  activeSessions: number;
  recentLogins: number; // Last 24 hours
  failedLoginAttempts: number; // Last 24 hours
}

// User management interfaces
export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
  role: 'admin' | 'user';
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: 'admin' | 'user';
  isActive?: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

/**
 * Enhanced Authentication Service using service layer architecture
 * Provides comprehensive authentication and user management operations
 */
export class EnhancedAuthService extends BaseService<ServiceUser> {
  private currentUser: ServiceUser | null = null;
  private currentTokens: ServiceAuthToken | null = null;
  private sessionCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    super({ 
      baseEndpoint: 'auth',
      cacheTimeout: 30 * 60 * 1000, // 30 minutes for user data
      enableCache: true 
    });
    this.initializeAuth();
  }

  /**
   * Initialize authentication state from stored tokens
   */
  private initializeAuth(): void {
    if (typeof window !== 'undefined') {
      const storedTokens = localStorage.getItem('auth_tokens');
      const storedUser = localStorage.getItem('current_user');
      
      if (storedTokens && storedUser) {
        try {
          this.currentTokens = JSON.parse(storedTokens);
          this.currentUser = JSON.parse(storedUser);
          
          // Start session monitoring
          this.startSessionMonitoring();
        } catch (error) {
          console.error('Failed to restore auth state:', error);
          this.clearAuthState();
        }
      }
    }
  }

  /**
   * Login with email and password
   */
  async login(credentials: ServiceLoginCredentials): Promise<ServiceLoginResponse> {
    return this.handleServiceError<ServiceLoginResponse>(async () => {
      const response = await apiClient.post<ServiceLoginResponse>(`${this.endpoint}/login`, credentials);
      
      const { user, tokens, sessionId } = response.data;
      
      // Store authentication state
      this.currentUser = user;
      this.currentTokens = tokens;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_tokens', JSON.stringify(tokens));
        localStorage.setItem('current_user', JSON.stringify(user));
        localStorage.setItem('session_id', sessionId);
        
        // Store remember me preference
        if (credentials.rememberMe) {
          localStorage.setItem('remember_me', 'true');
        }
      }
      
      // Update API client with new token
      this.updateApiClientToken(tokens.accessToken);
      
      // Start session monitoring
      this.startSessionMonitoring();
      
      return response.data;
    }, 'login user');
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    return this.handleServiceError<void>(async () => {
      if (this.currentTokens) {
        // Attempt to revoke token on server
        try {
          await apiClient.post(`${this.endpoint}/logout`, {
            refreshToken: this.currentTokens.refreshToken
          });
        } catch (error) {
          console.warn('Failed to revoke token on server:', error);
        }
      }
      
      // Clear local state regardless of server response
      this.clearAuthState();
    }, 'logout user');
  }

  /**
   * Refresh authentication tokens
   */
  async refreshTokens(): Promise<ServiceAuthToken> {
    return this.handleServiceError<ServiceAuthToken>(async () => {
      if (!this.currentTokens?.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<ServiceAuthToken>(`${this.endpoint}/refresh`, {
        refreshToken: this.currentTokens.refreshToken
      });
      
      const newTokens = response.data;
      
      // Update stored tokens
      this.currentTokens = newTokens;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_tokens', JSON.stringify(newTokens));
      }
      
      // Update API client with new token
      this.updateApiClientToken(newTokens.accessToken);
      
      return newTokens;
    }, 'refresh authentication tokens');
  }

  /**
   * Validate current session
   */
  async validateSession(): Promise<ServiceUser> {
    return this.handleServiceError<ServiceUser>(async () => {
      const response = await apiClient.get<ServiceUser>(`${this.endpoint}/validate`);
      
      // Update current user data
      this.currentUser = response.data;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('current_user', JSON.stringify(response.data));
      }
      
      return response.data;
    }, 'validate session');
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): ServiceUser | null {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null && this.currentTokens !== null;
  }

  /**
   * Check if current user has admin role
   */
  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return this.currentTokens?.accessToken || null;
  }

  /**
   * User management - Create new user (admin only)
   */
  async createUser(userData: CreateUserRequest): Promise<ServiceUser> {
    return this.handleServiceError<ServiceUser>(async () => {
      const response = await apiClient.post<ServiceUser>(`${this.endpoint}/users`, userData);
      
      // Clear user cache
      this.clearCache('users');
      
      return response.data;
    }, 'create user');
  }

  /**
   * User management - Get all users (admin only)
   */
  async getAllUsers(options: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    role?: 'admin' | 'user';
    isActive?: boolean;
  } = {}): Promise<{ users: ServiceUser[]; total: number; page: number; totalPages: number }> {
    return this.handleServiceError<{
      users: ServiceUser[];
      total: number;
      page: number;
      totalPages: number;
    }>(async () => {
      const cacheKey = this.getCacheKey('users', options);
      const cached = this.getCache<{
        users: ServiceUser[];
        total: number;
        page: number;
        totalPages: number;
      }>(cacheKey);
      if (cached) return cached;

      const params: Record<string, string> = {};
      if (options.page) params.page = options.page.toString();
      if (options.limit) params.limit = options.limit.toString();
      if (options.search) params.search = options.search;
      if (options.role) params.role = options.role;
      if (options.isActive !== undefined) params.isActive = options.isActive.toString();

      const response = await apiClient.get<{
        users: ServiceUser[];
        total: number;
        page: number;
        totalPages: number;
      }>(`${this.endpoint}/users`, params);
      
      // Cache for 5 minutes
      this.setCache(cacheKey, response.data, 5 * 60 * 1000);
      
      return response.data;
    }, 'fetch all users');
  }

  /**
   * User management - Update user (admin only)
   */
  async updateUser(userId: string, updates: UpdateUserRequest): Promise<ServiceUser> {
    return this.handleServiceError<ServiceUser>(async () => {
      const response = await apiClient.put<ServiceUser>(`${this.endpoint}/users/${userId}`, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      
      // Clear user cache
      this.clearCache('users');
      this.clearCache(userId);
      
      // Update current user if updating self
      if (this.currentUser?.id === userId) {
        this.currentUser = response.data;
        if (typeof window !== 'undefined') {
          localStorage.setItem('current_user', JSON.stringify(response.data));
        }
      }
      
      return response.data;
    }, 'update user');
  }

  /**
   * User management - Delete user (admin only)
   */
  async deleteUser(userId: string): Promise<void> {
    return this.handleServiceError<void>(async () => {
      await apiClient.delete(`${this.endpoint}/users/${userId}`);
      
      // Clear user cache
      this.clearCache('users');
      this.clearCache(userId);
    }, 'delete user');
  }

  /**
   * Password reset - Request reset
   */
  async requestPasswordReset(request: PasswordResetRequest): Promise<{ success: boolean; message: string }> {
    return this.handleServiceError<{ success: boolean; message: string }>(async () => {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        `${this.endpoint}/password-reset/request`, 
        request
      );
      
      return response.data;
    }, 'request password reset');
  }

  /**
   * Password reset - Confirm reset with token
   */
  async confirmPasswordReset(request: PasswordResetConfirm): Promise<{ success: boolean; message: string }> {
    return this.handleServiceError<{ success: boolean; message: string }>(async () => {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        `${this.endpoint}/password-reset/confirm`,
        request
      );
      
      return response.data;
    }, 'confirm password reset');
  }

  /**
   * Get authentication statistics (admin only)
   */
  async getAuthStats(): Promise<AuthStats> {
    return this.handleServiceError<AuthStats>(async () => {
      const cacheKey = 'auth_stats';
      const cached = this.getCache<AuthStats>(cacheKey);
      if (cached) return cached;

      const response = await apiClient.get<AuthStats>(`${this.endpoint}/stats`);
      
      // Cache for 5 minutes
      this.setCache(cacheKey, response.data, 5 * 60 * 1000);
      
      return response.data;
    }, 'fetch authentication statistics');
  }

  /**
   * Get user sessions (admin only)
   */
  async getUserSessions(userId?: string): Promise<ServiceSession[]> {
    return this.handleServiceError<ServiceSession[]>(async () => {
      const endpoint = userId ? 
        `${this.endpoint}/sessions/user/${userId}` : 
        `${this.endpoint}/sessions`;
        
      const response = await apiClient.get<ServiceSession[]>(endpoint);
      return response.data;
    }, 'fetch user sessions');
  }

  /**
   * Revoke user session (admin only)
   */
  async revokeSession(sessionId: string): Promise<void> {
    return this.handleServiceError<void>(async () => {
      await apiClient.delete(`${this.endpoint}/sessions/${sessionId}`);
    }, 'revoke user session');
  }

  /**
   * Change password for current user
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return this.handleServiceError<{ success: boolean; message: string }>(async () => {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        `${this.endpoint}/change-password`,
        { currentPassword, newPassword }
      );
      
      return response.data;
    }, 'change password');
  }

  /**
   * Update current user profile
   */
  async updateProfile(updates: { name?: string; email?: string }): Promise<ServiceUser> {
    return this.handleServiceError<ServiceUser>(async () => {
      if (!this.currentUser) {
        throw new Error('No authenticated user');
      }

      const response = await apiClient.put<ServiceUser>(`${this.endpoint}/profile`, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      
      // Update current user
      this.currentUser = response.data;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('current_user', JSON.stringify(response.data));
      }
      
      return response.data;
    }, 'update profile');
  }

  /**
   * Private helper methods
   */
  private clearAuthState(): void {
    this.currentUser = null;
    this.currentTokens = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_tokens');
      localStorage.removeItem('current_user');
      localStorage.removeItem('session_id');
      localStorage.removeItem('remember_me');
    }
    
    // Clear API client token
    this.updateApiClientToken(null);
    
    // Stop session monitoring
    this.stopSessionMonitoring();
    
    // Clear all caches
    this.clearCache();
  }

  private updateApiClientToken(token: string | null): void {
    // This would be implemented in the API client to update the Authorization header
    // For now, we'll just store it for future use
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('api_token', token);
      } else {
        localStorage.removeItem('api_token');
      }
    }
  }

  private startSessionMonitoring(): void {
    this.stopSessionMonitoring(); // Clear any existing interval
    
    // Check session validity every 15 minutes
    this.sessionCheckInterval = setInterval(async () => {
      try {
        await this.validateSession();
      } catch (error) {
        console.warn('Session validation failed:', error);
        // Attempt token refresh
        try {
          await this.refreshTokens();
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          this.clearAuthState();
        }
      }
    }, 15 * 60 * 1000);
  }

  private stopSessionMonitoring(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
  }

  /**
   * Cleanup method for component unmounting
   */
  dispose(): void {
    this.stopSessionMonitoring();
  }
}

// Export singleton instance
export const enhancedAuthService = new EnhancedAuthService();