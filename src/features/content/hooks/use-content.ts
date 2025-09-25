/**
 * Content Management Hooks
 * React hooks for managing wedding content
 * 
 * Reference: CONST-P2 (AI-Driven Development), CONST-P4 (Type Safety)
 */

import { useState, useCallback, useEffect } from 'react';
import { WeddingEvent, WeddingStory, WeddingRegistry, WeddingInfo, ContentFormData } from '../types';
import { ContentService } from '../services/content-service';

// Hook for managing wedding events
export function useWeddingEvents() {
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ContentService.getEvents();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (data: ContentFormData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const newEvent = await ContentService.createEvent(data);
      setEvents(prev => [...prev, newEvent].sort((a, b) => a.order - b.order));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEvent = useCallback(async (id: string, data: Partial<ContentFormData>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const updatedEvent = await ContentService.updateEvent(id, data);
      setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEvent = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await ContentService.deleteEvent(id);
      setEvents(prev => prev.filter(event => event.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    clearError: () => setError(null)
  };
}

// Hook for managing wedding stories
export function useWeddingStories() {
  const [stories, setStories] = useState<WeddingStory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ContentService.getStories();
      setStories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stories');
    } finally {
      setLoading(false);
    }
  }, []);

  const createStory = useCallback(async (data: ContentFormData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const newStory = await ContentService.createStory(data);
      setStories(prev => [...prev, newStory].sort((a, b) => a.order - b.order));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create story');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStory = useCallback(async (id: string, data: Partial<ContentFormData>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const updatedStory = await ContentService.updateStory(id, data);
      setStories(prev => prev.map(story => story.id === id ? updatedStory : story));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update story');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteStory = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await ContentService.deleteStory(id);
      setStories(prev => prev.filter(story => story.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete story');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  return {
    stories,
    loading,
    error,
    fetchStories,
    createStory,
    updateStory,
    deleteStory,
    clearError: () => setError(null)
  };
}

// Hook for managing wedding registries
export function useWeddingRegistries() {
  const [registries, setRegistries] = useState<WeddingRegistry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRegistries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ContentService.getRegistries();
      setRegistries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch registries');
    } finally {
      setLoading(false);
    }
  }, []);

  const createRegistry = useCallback(async (data: ContentFormData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const newRegistry = await ContentService.createRegistry(data);
      setRegistries(prev => [...prev, newRegistry].sort((a, b) => a.order - b.order));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create registry');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRegistry = useCallback(async (id: string, data: Partial<ContentFormData>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const updatedRegistry = await ContentService.updateRegistry(id, data);
      setRegistries(prev => prev.map(registry => registry.id === id ? updatedRegistry : registry));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update registry');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRegistry = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await ContentService.deleteRegistry(id);
      setRegistries(prev => prev.filter(registry => registry.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete registry');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistries();
  }, [fetchRegistries]);

  return {
    registries,
    loading,
    error,
    fetchRegistries,
    createRegistry,
    updateRegistry,
    deleteRegistry,
    clearError: () => setError(null)
  };
}

// Hook for managing wedding info
export function useWeddingInfo() {
  const [weddingInfo, setWeddingInfo] = useState<WeddingInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeddingInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ContentService.getWeddingInfo();
      setWeddingInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wedding info');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateWeddingInfo = useCallback(async (data: Partial<WeddingInfo>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const updated = await ContentService.updateWeddingInfo(data);
      setWeddingInfo(updated);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update wedding info');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeddingInfo();
  }, [fetchWeddingInfo]);

  return {
    weddingInfo,
    loading,
    error,
    fetchWeddingInfo,
    updateWeddingInfo,
    clearError: () => setError(null)
  };
}