import { z } from 'zod';

// Common validation schemas and types
export const emailSchema = z.string().email('Invalid email address');

export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters');

export const idSchema = z.string().uuid('Invalid ID format');

// Common types
export type Email = z.infer<typeof emailSchema>;
export type Name = z.infer<typeof nameSchema>;
export type ID = z.infer<typeof idSchema>;

export interface BaseEntity {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}