import { ExtendedBaseService } from '@/lib/base-service';
import { apiClient } from '@/lib/api-client';

// Service layer types for content (API representation with string dates)
export interface ServiceContentItem {
  id: string;
  title: string;
  description: string;
  date?: string; // ISO string date for API
  location?: string;
  imageUrl?: string;
  url?: string;
  price?: number;
  store?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceEventItem extends ServiceContentItem {
  date: string; // Required for events
  location: string; // Required for events
}

export interface ServiceStoryItem extends ServiceContentItem {
  imageUrl: string; // Required for stories
}

export interface ServiceRegistryItem extends ServiceContentItem {
  url: string; // Required for registry items
  price: number; // Required for registry items
  store: string; // Required for registry items
}

export interface ServiceInfoItem extends ServiceContentItem {
  // Uses base interface - flexible info items with optional additional properties
  category?: string;
}

// Content statistics interface
export interface ContentStats {
  events: number;
  stories: number;
  registries: number;
  info: number;
  totalItems: number;
  recentlyAdded: number; // Added in last 7 days
}

// Content analytics interface
export interface ContentAnalytics {
  itemsByType: Record<string, number>;
  itemsByMonth: Array<{ month: string; count: number }>;
  popularItems: Array<{ id: string; title: string; views?: number }>;
  contentGrowth: Array<{ period: string; count: number }>;
}

/**
 * Enhanced Content Service using service layer architecture
 * Provides comprehensive content management operations with caching, analytics, and bulk operations
 */
export class EnhancedContentService extends ExtendedBaseService<ServiceContentItem> {
  constructor() {
    super({ baseEndpoint: 'content' });
  }

  /**
   * Get content items by type with caching
   */
  async getByType(
    type: 'events' | 'stories' | 'registries' | 'info',
    options: { useCache?: boolean } = {}
  ): Promise<ServiceContentItem[]> {
    const cacheKey = `type_${type}`;
    
    return this.handleServiceError<ServiceContentItem[]>(async () => {
      // Check cache first if enabled
      if (options.useCache !== false) {
        const cached = this.getCache<ServiceContentItem[]>(cacheKey);
        if (cached) return cached;
      }

      const response = await apiClient.get<ServiceContentItem[]>(`${this.endpoint}/type/${type}`);
      
      // Cache the results
      if (options.useCache !== false) {
        this.setCache(cacheKey, response.data);
      }
      
      return response.data;
    }, `fetch ${type} content`);
  }

  /**
   * Create content item with type-specific validation
   */
  async createByType(
    type: 'events' | 'stories' | 'registries' | 'info',
    data: Omit<ServiceContentItem, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ServiceContentItem> {
    return this.handleServiceError<ServiceContentItem>(async () => {
      const payload = {
        ...data,
        type,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await apiClient.post<ServiceContentItem>(`${this.endpoint}/type/${type}`, payload);
      
      // Clear type-specific cache
      this.clearCache(`type_${type}`);
      this.clearCache(); // Clear all cache
      
      return response.data;
    }, `create ${type} content`);
  }

  /**
   * Update content item by type
   */
  async updateByType(
    type: 'events' | 'stories' | 'registries' | 'info',
    id: string,
    data: Partial<ServiceContentItem>
  ): Promise<ServiceContentItem> {
    return this.handleServiceError<ServiceContentItem>(async () => {
      const payload = {
        ...data,
        updatedAt: new Date().toISOString()
      };

      const response = await apiClient.put<ServiceContentItem>(`${this.endpoint}/type/${type}/${id}`, payload);
      
      // Clear relevant caches
      this.clearCache(`type_${type}`);
      this.clearCache(id);
      this.clearCache(); // Clear all cache
      
      return response.data;
    }, `update ${type} content`);
  }

  /**
   * Delete content item by type
   */
  async deleteByType(type: 'events' | 'stories' | 'registries' | 'info', id: string): Promise<void> {
    return this.handleServiceError<void>(async () => {
      await apiClient.delete(`${this.endpoint}/type/${type}/${id}`);
      
      // Clear relevant caches
      this.clearCache(`type_${type}`);
      this.clearCache(id);
      this.clearCache(); // Clear all cache
    }, `delete ${type} content`);
  }

  /**
   * Get content statistics
   */
  async getStats(): Promise<ContentStats> {
    return this.handleServiceError<ContentStats>(async () => {
      const cacheKey = 'content_stats';
      const cached = this.getCache<ContentStats>(cacheKey);
      if (cached) return cached;

      const response = await apiClient.get<ContentStats>(`${this.endpoint}/stats`);
      
      // Cache for 5 minutes
      this.setCache(cacheKey, response.data, 5 * 60 * 1000);
      
      return response.data;
    }, 'fetch content statistics');
  }

  /**
   * Get content analytics data
   */
  async getAnalytics(period: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<ContentAnalytics> {
    return this.handleServiceError<ContentAnalytics>(async () => {
      const cacheKey = `analytics_${period}`;
      const cached = this.getCache<ContentAnalytics>(cacheKey);
      if (cached) return cached;

      const response = await apiClient.get<ContentAnalytics>(`${this.endpoint}/analytics`, {
        period
      });
      
      // Cache for 1 hour
      this.setCache(cacheKey, response.data, 60 * 60 * 1000);
      
      return response.data;
    }, 'fetch content analytics');
  }

  /**
   * Search content across all types
   */
  async searchContent(
    query: string,
    options: {
      types?: Array<'events' | 'stories' | 'registries' | 'info'>;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<{ items: ServiceContentItem[]; total: number }> {
    return this.handleServiceError<{ items: ServiceContentItem[]; total: number }>(async () => {
      const params: Record<string, string> = { q: query };
      if (options.types) params.types = options.types.join(',');
      if (options.limit) params.limit = options.limit.toString();
      if (options.offset) params.offset = options.offset.toString();

      const response = await apiClient.get<{ items: ServiceContentItem[]; total: number }>(
        `${this.endpoint}/search`,
        params
      );
      
      return response.data;
    }, 'search content');
  }

  /**
   * Bulk update content items
   */
  async bulkUpdate(updates: Array<{ id: string; data: Partial<ServiceContentItem> }>): Promise<ServiceContentItem[]> {
    return this.handleServiceError<ServiceContentItem[]>(async () => {
      const payload = {
        updates: updates.map(update => ({
          ...update,
          data: {
            ...update.data,
            updatedAt: new Date().toISOString()
          }
        }))
      };

      const response = await apiClient.put<ServiceContentItem[]>(`${this.endpoint}/bulk-update`, payload);
      
      // Clear all cache after bulk update
      this.clearCache();
      
      return response.data;
    }, 'bulk update content');
  }

  /**
   * Bulk delete content items
   */
  async bulkDelete(ids: string[]): Promise<void> {
    return this.handleServiceError<void>(async () => {
      await apiClient.post(`${this.endpoint}/bulk-delete`, { ids });
      
      // Clear all cache after bulk delete
      this.clearCache();
    }, 'bulk delete content');
  }

  /**
   * Export content to JSON format
   */
  async exportToJSON(type?: 'events' | 'stories' | 'registries' | 'info'): Promise<string> {
    return this.handleServiceError<string>(async () => {
      const params: Record<string, string> = type ? { type } : {};
      const response = await apiClient.get<string>(`${this.endpoint}/export/json`, params);
      return response.data;
    }, 'export content to JSON');
  }

  /**
   * Import content from JSON data
   */
  async importFromJSON(data: ServiceContentItem[], options: { replace?: boolean } = {}): Promise<{
    imported: number;
    skipped: number;
    errors: string[];
  }> {
    return this.handleServiceError<{
      imported: number;
      skipped: number;
      errors: string[];
    }>(async () => {
      const payload = {
        data,
        options: {
          replace: options.replace || false
        }
      };

      const response = await apiClient.post<{
        imported: number;
        skipped: number;
        errors: string[];
      }>(`${this.endpoint}/import/json`, payload);
      
      // Clear all cache after import
      this.clearCache();
      
      return response.data;
    }, 'import content from JSON');
  }

  /**
   * Get content item with view tracking
   */
  async getWithViews(id: string): Promise<ServiceContentItem & { views: number }> {
    return this.handleServiceError<ServiceContentItem & { views: number }>(async () => {
      const response = await apiClient.get<ServiceContentItem & { views: number }>(`${this.endpoint}/${id}/with-views`);
      return response.data;
    }, 'fetch content with views');
  }

  /**
   * Track content view
   */
  async trackView(id: string): Promise<void> {
    return this.handleServiceError<void>(async () => {
      await apiClient.post(`${this.endpoint}/${id}/view`);
    }, 'track content view');
  }
}

// Export singleton instance
export const enhancedContentService = new EnhancedContentService();