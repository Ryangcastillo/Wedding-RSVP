/**
 * API Client Infrastructure
 * Centralized HTTP client with interceptors, error handling, and type safety
 * 
 * Reference: CONST-P5 (Security First), CONST-P4 (Type Safety), CONST-P6 (Error Handling)
 */

// Note: AuthService integration commented out for now, will be implemented when needed
// import { AuthService } from '@/features/auth';

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ApiError extends Error {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, unknown>;
}

export class ApiErrorClass extends Error implements ApiError {
  status: number;
  code?: string;
  details?: Record<string, unknown>;

  constructor(message: string, status: number, code?: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Create request headers with authentication
   */
  private async createHeaders(additionalHeaders: Record<string, string> = {}): Promise<Record<string, string>> {
    const headers = { ...this.defaultHeaders, ...additionalHeaders };
    
    // Add authentication token if available
    // Note: AuthService integration will be implemented when needed
    // const authService = AuthService.getInstance();
    // const token = await authService.getToken();
    // if (token) {
    //   headers.Authorization = `Bearer ${token}`;
    // }

    return headers;
  }

  /**
   * Handle API responses and errors
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    let data: unknown;
    try {
      data = isJson ? await response.json() : await response.text();
    } catch {
      throw new ApiErrorClass('Failed to parse response', response.status);
    }

    if (!response.ok) {
      const responseData = data as { message?: string; code?: string; errors?: Record<string, unknown>; details?: Record<string, unknown> };
      const error = new ApiErrorClass(
        responseData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        responseData.code,
        responseData.errors || responseData.details
      );
      throw error;
    }

    const responseData = data as { message?: string };
    return {
      data: data as T,
      status: response.status,
      message: responseData.message
    };
  }

  /**
   * Generic request method
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit & { params?: Record<string, string> } = {}
  ): Promise<ApiResponse<T>> {
    const { params, headers = {}, ...fetchOptions } = options;
    
    let url = `${this.baseURL}${endpoint}`;
    
    // Add query parameters
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    const requestHeaders = await this.createHeaders(headers as Record<string, string>);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: requestHeaders,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error) {
        // Network or other fetch errors
        const apiError = new ApiErrorClass(error.message, 0, 'NETWORK_ERROR');
        throw apiError;
      }
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: unknown, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: unknown, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      headers
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body?: unknown, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      headers
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Upload file
   */
  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const headers = await this.createHeaders();
    delete headers['Content-Type']; // Let browser set the correct content-type for multipart

    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers
    });
  }
}

// Singleton instance
export const apiClient = new ApiClient();

/**
 * API Error Handler Utility
 */
export class ApiErrorHandler {
  static handleError(error: ApiError): string {
    switch (error.status) {
      case 400:
        return error.details ? 
          Object.values(error.details).flat().join(', ') : 
          error.message || 'Bad request';
      case 401:
        // Handle authentication errors
        // Note: AuthService integration will be implemented when needed
        // AuthService.getInstance().logout();
        return 'Your session has expired. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'This action conflicts with existing data.';
      case 422:
        return error.details ?
          Object.values(error.details).flat().join(', ') :
          'Validation failed. Please check your input.';
      case 500:
        return 'An internal server error occurred. Please try again later.';
      case 0:
        return 'Unable to connect to the server. Please check your internet connection.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }

  static isNetworkError(error: ApiError): boolean {
    return error.status === 0 || error.code === 'NETWORK_ERROR';
  }

  static isAuthenticationError(error: ApiError): boolean {
    return error.status === 401;
  }

  static isValidationError(error: ApiError): boolean {
    return error.status === 400 || error.status === 422;
  }
}