/**
 * Content Management Types
 * Type definitions for wedding content management
 * 
 * Reference: CONST-P4 (Type Safety), CONST-P12 (Admin Interface)
 */

export interface WeddingEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime?: string;
  location: string;
  address: string;
  dressCode?: string;
  notes?: string;
  isPublic: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface WeddingStory {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  date?: string;
  author: 'bride' | 'groom' | 'both';
  isPublic: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface WeddingPhoto {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  category: 'engagement' | 'couple' | 'family' | 'other';
  isHero: boolean;
  isPublic: boolean;
  order: number;
  uploadedAt: string;
}

export interface WeddingRegistry {
  id: string;
  storeName: string;
  storeUrl: string;
  description?: string;
  logo?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface WeddingInfo {
  id: string;
  brideNames: string[];
  groomNames: string[];
  weddingDate: string;
  ceremony: {
    venue: string;
    address: string;
    time: string;
    description?: string;
  };
  reception: {
    venue: string;
    address: string;
    time: string;
    description?: string;
  };
  rsvpDeadline: string;
  maxGuests: number;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  contact: {
    email: string;
    phone?: string;
    website?: string;
  };
  updatedAt: string;
}

export interface ContentFormData {
  title: string;
  content?: string;
  description?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  address?: string;
  dressCode?: string;
  notes?: string;
  isPublic: boolean;
  imageUrl?: string;
  author?: 'bride' | 'groom' | 'both';
  category?: string;
  storeName?: string;
  storeUrl?: string;
  logo?: string;
  isActive?: boolean;
}

/**
 * Union type for editable content items
 */
export type EditableContent = WeddingEvent | WeddingStory | WeddingRegistry | WeddingInfo;

/**
 * Tab types for content management
 */
export type ContentTab = 'events' | 'stories' | 'registries' | 'info';