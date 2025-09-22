/**
 * Content Management Service
 * API service for managing wedding content
 * 
 * Reference: CONST-P4 (Type Safety), CONST-P1 (Modular Architecture)
 */

import { 
  WeddingEvent, 
  WeddingStory, 
  WeddingRegistry, 
  WeddingInfo,
  ContentFormData 
} from '../types';

// Mock data - in real implementation, this would come from an API/database
const mockEvents: WeddingEvent[] = [
  {
    id: '1',
    title: 'Wedding Ceremony',
    description: 'Join us as we exchange vows in an intimate ceremony surrounded by family and friends.',
    date: '2025-06-15',
    startTime: '14:00',
    endTime: '15:00',
    location: 'Grand Cathedral',
    address: '123 Wedding St, Love City, LC 12345',
    dressCode: 'Formal',
    notes: 'Please arrive 15 minutes early for seating',
    isPublic: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Cocktail Reception',
    description: 'Celebrate with us at our cocktail reception with dinner, dancing, and festivities!',
    date: '2025-06-15',
    startTime: '16:30',
    endTime: '22:00',
    location: 'Grand Ballroom',
    address: '456 Reception Ave, Love City, LC 12345',
    dressCode: 'Cocktail Attire',
    isPublic: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockStories: WeddingStory[] = [
  {
    id: '1',
    title: 'How We Met',
    content: 'It was a beautiful spring day when our paths first crossed at the local coffee shop. Little did we know that shared love for morning lattes would turn into a lifetime of adventures together.',
    date: '2022-03-15',
    author: 'both',
    isPublic: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'The Proposal',
    content: 'Under the stars at our favorite hiking spot, with the city lights twinkling below, the question was asked and answered with tears of joy. It was perfect in every way.',
    date: '2024-08-20',
    author: 'groom',
    isPublic: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockRegistries: WeddingRegistry[] = [
  {
    id: '1',
    storeName: 'Williams Sonoma',
    storeUrl: 'https://www.williams-sonoma.com',
    description: 'Home essentials and kitchen items',
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    storeName: 'Crate & Barrel',
    storeUrl: 'https://www.crateandbarrel.com',
    description: 'Furniture and home decor',
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockWeddingInfo: WeddingInfo = {
  id: '1',
  brideNames: ['Sarah', 'Johnson'],
  groomNames: ['Michael', 'Smith'],
  weddingDate: '2025-06-15',
  ceremony: {
    venue: 'Grand Cathedral',
    address: '123 Wedding St, Love City, LC 12345',
    time: '14:00',
    description: 'Beautiful historic cathedral with stunning stained glass'
  },
  reception: {
    venue: 'Grand Ballroom',
    address: '456 Reception Ave, Love City, LC 12345',
    time: '16:30',
    description: 'Elegant ballroom perfect for dancing the night away'
  },
  rsvpDeadline: '2025-05-01',
  maxGuests: 150,
  theme: {
    primaryColor: '#8B5A3C',
    secondaryColor: '#E8DCC0',
    fontFamily: 'serif'
  },
  contact: {
    email: 'wedding@sarahandmichael.com',
    phone: '+1 (555) 123-4567',
    website: 'https://sarahandmichael.com'
  },
  updatedAt: new Date().toISOString()
};

export class ContentService {
  // Wedding Events
  static async getEvents(): Promise<WeddingEvent[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockEvents.sort((a, b) => a.order - b.order);
  }

  static async createEvent(data: ContentFormData): Promise<WeddingEvent> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newEvent: WeddingEvent = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description || '',
      date: data.date || '',
      startTime: data.startTime || '',
      endTime: data.endTime,
      location: data.location || '',
      address: data.address || '',
      dressCode: data.dressCode,
      notes: data.notes,
      isPublic: data.isPublic,
      order: mockEvents.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockEvents.push(newEvent);
    return newEvent;
  }

  static async updateEvent(id: string, data: Partial<ContentFormData>): Promise<WeddingEvent> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockEvents.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Event not found');
    
    mockEvents[index] = {
      ...mockEvents[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return mockEvents[index];
  }

  static async deleteEvent(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockEvents.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Event not found');
    mockEvents.splice(index, 1);
  }

  // Wedding Stories
  static async getStories(): Promise<WeddingStory[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockStories.sort((a, b) => a.order - b.order);
  }

  static async createStory(data: ContentFormData): Promise<WeddingStory> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newStory: WeddingStory = {
      id: Date.now().toString(),
      title: data.title,
      content: data.content || '',
      imageUrl: data.imageUrl,
      date: data.date,
      author: data.author || 'both',
      isPublic: data.isPublic,
      order: mockStories.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockStories.push(newStory);
    return newStory;
  }

  static async updateStory(id: string, data: Partial<ContentFormData>): Promise<WeddingStory> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockStories.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Story not found');
    
    mockStories[index] = {
      ...mockStories[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return mockStories[index];
  }

  static async deleteStory(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockStories.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Story not found');
    mockStories.splice(index, 1);
  }

  // Wedding Registries
  static async getRegistries(): Promise<WeddingRegistry[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockRegistries.filter(r => r.isActive).sort((a, b) => a.order - b.order);
  }

  static async createRegistry(data: ContentFormData): Promise<WeddingRegistry> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newRegistry: WeddingRegistry = {
      id: Date.now().toString(),
      storeName: data.storeName || '',
      storeUrl: data.storeUrl || '',
      description: data.description,
      logo: data.logo,
      isActive: data.isActive ?? true,
      order: mockRegistries.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockRegistries.push(newRegistry);
    return newRegistry;
  }

  static async updateRegistry(id: string, data: Partial<ContentFormData>): Promise<WeddingRegistry> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockRegistries.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Registry not found');
    
    mockRegistries[index] = {
      ...mockRegistries[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return mockRegistries[index];
  }

  static async deleteRegistry(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockRegistries.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Registry not found');
    mockRegistries.splice(index, 1);
  }

  // Wedding Info
  static async getWeddingInfo(): Promise<WeddingInfo> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockWeddingInfo;
  }

  static async updateWeddingInfo(data: Partial<WeddingInfo>): Promise<WeddingInfo> {
    await new Promise(resolve => setTimeout(resolve, 500));
    Object.assign(mockWeddingInfo, {
      ...data,
      updatedAt: new Date().toISOString()
    });
    return mockWeddingInfo;
  }
}