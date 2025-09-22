/**
 * Base Service Classes
 * Abstract base classes providing common CRUD operations and patterns
 * 
 * Reference: CONST-P4 (Type Safety), CONST-P6 (Error Handling), CONST-P5 (Security First)
 */

import { apiClient, ApiResponse, ApiErrorClass, ApiErrorHandler } from './api-client';

// Base entity interface that all entities should extend
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Service configuration options
export interface ServiceConfig {
  baseEndpoint: string;
  cacheTimeout?: number;
  enableCache?: boolean;
}

// Cache entry structure
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Abstract base service providing common CRUD operations
 */
export abstract class BaseService<T extends BaseEntity> {
  protected endpoint: string;
  protected cache: Map<string, CacheEntry<unknown>>;
  protected cacheTimeout: number;
  protected enableCache: boolean;

  constructor(config: ServiceConfig) {
    this.endpoint = config.baseEndpoint;
    this.cacheTimeout = config.cacheTimeout || 5 * 60 * 1000; // 5 minutes default
    this.enableCache = config.enableCache ?? true;
    this.cache = new Map();
  }

  /**
   * Cache management utilities
   */
  protected getCacheKey(method: string, ...params: unknown[]): string {
    return `${this.endpoint}:${method}:${JSON.stringify(params)}`;
  }

  protected setCache<U>(key: string, data: U, ttl?: number): void {
    if (!this.enableCache) return;
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.cacheTimeout
    });
  }

  protected getCache<U>(key: string): U | null {
    if (!this.enableCache) return null;
    
    const entry = this.cache.get(key) as CacheEntry<U> | undefined;
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  protected clearCache(pattern?: string): void {
    if (pattern) {
      const keys = Array.from(this.cache.keys());
      keys.forEach(key => {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      });
    } else {
      this.cache.clear();
    }
  }

  /**
   * Error handling wrapper
   */
  protected async handleServiceError<U>(
    operation: () => Promise<U>,
    context: string
  ): Promise<U> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof ApiErrorClass) {
        const friendlyMessage = ApiErrorHandler.handleError(error);
        console.error(`Service error in ${context}:`, error);
        throw new Error(friendlyMessage);
      }
      
      if (error instanceof Error) {
        console.error(`Unexpected error in ${context}:`, error);
        throw new Error(`Failed to ${context}: ${error.message}`);
      }
      
      console.error(`Unknown error in ${context}:`, error);
      throw new Error(`An unexpected error occurred while ${context}`);
    }
  }

  /**
   * Get all entities
   */
  async getAll(params?: Record<string, string>): Promise<T[]> {
    return this.handleServiceError(async () => {
      const cacheKey = this.getCacheKey('getAll', params);
      const cached = this.getCache<T[]>(cacheKey);
      if (cached) return cached;

      const response: ApiResponse<T[]> = await apiClient.get(this.endpoint, params);
      this.setCache(cacheKey, response.data);
      return response.data;
    }, 'fetch all items');
  }

  /**
   * Get entity by ID
   */
  async getById(id: string): Promise<T> {
    return this.handleServiceError(async () => {
      const cacheKey = this.getCacheKey('getById', id);
      const cached = this.getCache<T>(cacheKey);
      if (cached) return cached;

      const response: ApiResponse<T> = await apiClient.get(`${this.endpoint}/${id}`);
      this.setCache(cacheKey, response.data);
      return response.data;
    }, `fetch item with ID ${id}`);
  }

  /**
   * Create new entity
   */
  async create(data: Omit<T, keyof BaseEntity>): Promise<T> {
    return this.handleServiceError(async () => {
      const response: ApiResponse<T> = await apiClient.post(this.endpoint, data);
      this.clearCache('getAll'); // Clear list cache
      return response.data;
    }, 'create new item');
  }

  /**
   * Update entity
   */
  async update(id: string, data: Partial<Omit<T, keyof BaseEntity>>): Promise<T> {
    return this.handleServiceError(async () => {
      const response: ApiResponse<T> = await apiClient.put(`${this.endpoint}/${id}`, data);
      this.clearCache(); // Clear all cache for this service
      return response.data;
    }, `update item with ID ${id}`);
  }

  /**
   * Partially update entity
   */
  async patch(id: string, data: Partial<Omit<T, keyof BaseEntity>>): Promise<T> {
    return this.handleServiceError(async () => {
      const response: ApiResponse<T> = await apiClient.patch(`${this.endpoint}/${id}`, data);
      this.clearCache(); // Clear all cache for this service
      return response.data;
    }, `partially update item with ID ${id}`);
  }

  /**
   * Delete entity
   */
  async delete(id: string): Promise<void> {
    return this.handleServiceError(async () => {
      await apiClient.delete(`${this.endpoint}/${id}`);
      this.clearCache(); // Clear all cache for this service
    }, `delete item with ID ${id}`);
  }

  /**
   * Check if entity exists
   */
  async exists(id: string): Promise<boolean> {
    return this.handleServiceError(async () => {
      try {
        await this.getById(id);
        return true;
      } catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
          return false;
        }
        throw error;
      }
    }, `check if item with ID ${id} exists`);
  }

  /**
   * Bulk operations
   */
  async bulkCreate(items: Array<Omit<T, keyof BaseEntity>>): Promise<T[]> {
    return this.handleServiceError(async () => {
      const response: ApiResponse<T[]> = await apiClient.post(`${this.endpoint}/bulk`, { items });
      this.clearCache('getAll'); // Clear list cache
      return response.data;
    }, 'bulk create items');
  }

  async bulkUpdate(updates: Array<{ id: string; data: Partial<Omit<T, keyof BaseEntity>> }>): Promise<T[]> {
    return this.handleServiceError(async () => {
      const response: ApiResponse<T[]> = await apiClient.put(`${this.endpoint}/bulk`, { updates });
      this.clearCache(); // Clear all cache for this service
      return response.data;
    }, 'bulk update items');
  }

  async bulkDelete(ids: string[]): Promise<void> {
    return this.handleServiceError(async () => {
      await apiClient.delete(`${this.endpoint}/bulk?ids=${ids.join(',')}`);
      this.clearCache(); // Clear all cache for this service
    }, 'bulk delete items');
  }
}

/**
 * Extended base service for services that need additional common functionality
 */
export abstract class ExtendedBaseService<T extends BaseEntity> extends BaseService<T> {
  /**
   * Search entities
   */
  async search(query: string, filters?: Record<string, string>): Promise<T[]> {
    return this.handleServiceError(async () => {
      const params = { q: query, ...filters };
      const cacheKey = this.getCacheKey('search', params);
      const cached = this.getCache<T[]>(cacheKey);
      if (cached) return cached;

      const response: ApiResponse<T[]> = await apiClient.get(`${this.endpoint}/search`, params);
      this.setCache(cacheKey, response.data, 60000); // 1 minute cache for searches
      return response.data;
    }, `search items with query "${query}"`);
  }

  /**
   * Get paginated results
   */
  async getPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: Record<string, string>
  ): Promise<{ items: T[]; total: number; page: number; totalPages: number }> {
    return this.handleServiceError(async () => {
      const params = { 
        page: page.toString(), 
        limit: limit.toString(),
        ...filters 
      };
      const cacheKey = this.getCacheKey('getPaginated', params);
      const cached = this.getCache<{ items: T[]; total: number; page: number; totalPages: number }>(cacheKey);
      if (cached) return cached;

      const response: ApiResponse<{ items: T[]; total: number; page: number; totalPages: number }> = 
        await apiClient.get(`${this.endpoint}/paginated`, params);
      this.setCache(cacheKey, response.data);
      return response.data;
    }, `fetch paginated results (page ${page})`);
  }

  /**
   * Get entities with relationships loaded
   */
  async getWithRelations(id: string, relations: string[]): Promise<T> {
    return this.handleServiceError(async () => {
      const params = { include: relations.join(',') };
      const cacheKey = this.getCacheKey('getWithRelations', id, relations);
      const cached = this.getCache<T>(cacheKey);
      if (cached) return cached;

      const response: ApiResponse<T> = await apiClient.get(`${this.endpoint}/${id}`, params);
      this.setCache(cacheKey, response.data);
      return response.data;
    }, `fetch item with relations: ${relations.join(', ')}`);
  }
}