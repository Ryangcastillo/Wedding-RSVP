/**
 * Content Management Feature Exports
 * Centralized exports for the content management feature
 * 
 * Reference: CONST-P12 (Admin Interface), CONST-P4 (Type Safety)
 */

// Components
export { ContentManagement } from './components';

// Hooks
export {
  useWeddingEvents,
  useWeddingStories,
  useWeddingRegistries,
  useWeddingInfo
} from './hooks/use-content';

// Services
export { ContentService } from './services/content-service';

// Types
export type {
  WeddingEvent,
  WeddingStory,
  WeddingPhoto,
  WeddingRegistry,
  WeddingInfo,
  ContentFormData,
  EditableContent
} from './types';