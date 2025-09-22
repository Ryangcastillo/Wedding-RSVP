/**
 * Content Management Dashboard Component
 * Admin interface for managing wedding content
 * 
 * Reference: CONST-P12 (Admin Interface), CONST-P4 (Type Safety)
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card';
import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/input';
import { Alert, AlertDescription } from '@/shared/components/alert';
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/shared/components/modal';
import { 
  useWeddingEvents, 
  useWeddingStories, 
  useWeddingRegistries,
  useWeddingInfo 
} from '../hooks/use-content';
import { ContentFormData, EditableContent } from '../types';

interface ContentManagementProps {
  className?: string;
}

export function ContentManagement({ className }: ContentManagementProps) {
  const [activeTab, setActiveTab] = useState<'events' | 'stories' | 'registries' | 'info'>('events');
  const [showDialog, setShowDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<EditableContent | null>(null);

  const events = useWeddingEvents();
  const stories = useWeddingStories();
  const registries = useWeddingRegistries();
  const weddingInfo = useWeddingInfo();

  const tabs = [
    { id: 'events', label: 'Events', icon: '📅', count: events.events.length },
    { id: 'stories', label: 'Stories', icon: '📖', count: stories.stories.length },
    { id: 'registries', label: 'Registries', icon: '🎁', count: registries.registries.length },
    { id: 'info', label: 'Wedding Info', icon: '💒', count: 1 }
  ];

  const handleCreate = (type: string) => {
    setEditingItem(null);
    setActiveTab(type as 'events' | 'stories' | 'registries' | 'info');
    setShowDialog(true);
  };

  const handleEdit = (item: EditableContent) => {
    setEditingItem(item);
    setShowDialog(true);
  };

  const renderEventsList = () => (
    <div className="space-y-4">
      {events.loading ? (
        <div className="text-center py-8">Loading events...</div>
      ) : events.events.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <div className="text-3xl mb-2">📅</div>
          <p>No events created yet</p>
          <Button className="mt-4" onClick={() => handleCreate('events')}>
            Create First Event
          </Button>
        </div>
      ) : (
        events.events.map((event) => (
          <Card key={event.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-lg mb-2">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                  <div className="text-sm space-y-1">
                    <div>📅 {new Date(event.date).toLocaleDateString()} at {event.startTime}</div>
                    <div>📍 {event.location}</div>
                    {event.dressCode && <div>👔 {event.dressCode}</div>}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      event.isPublic ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                    }`}>
                      {event.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => events.deleteEvent(event.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  const renderStoriesList = () => (
    <div className="space-y-4">
      {stories.loading ? (
        <div className="text-center py-8">Loading stories...</div>
      ) : stories.stories.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <div className="text-3xl mb-2">📖</div>
          <p>No stories created yet</p>
          <Button className="mt-4" onClick={() => handleCreate('stories')}>
            Create First Story
          </Button>
        </div>
      ) : (
        stories.stories.map((story) => (
          <Card key={story.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-lg mb-2">{story.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-3">{story.content}</p>
                  <div className="text-sm space-y-1">
                    {story.date && <div>📅 {new Date(story.date).toLocaleDateString()}</div>}
                    <div>✍️ By {story.author === 'both' ? 'Both' : story.author === 'bride' ? 'Bride' : 'Groom'}</div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      story.isPublic ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                    }`}>
                      {story.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(story)}>
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => stories.deleteStory(story.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  const renderRegistriesList = () => (
    <div className="space-y-4">
      {registries.loading ? (
        <div className="text-center py-8">Loading registries...</div>
      ) : registries.registries.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <div className="text-3xl mb-2">🎁</div>
          <p>No registries created yet</p>
          <Button className="mt-4" onClick={() => handleCreate('registries')}>
            Add First Registry
          </Button>
        </div>
      ) : (
        registries.registries.map((registry) => (
          <Card key={registry.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-lg mb-2">{registry.storeName}</h3>
                  {registry.description && (
                    <p className="text-sm text-muted-foreground mb-2">{registry.description}</p>
                  )}
                  <div className="text-sm">
                    <a 
                      href={registry.storeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      🔗 Visit Registry
                    </a>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      registry.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                    }`}>
                      {registry.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(registry)}>
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => registries.deleteRegistry(registry.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  const renderWeddingInfo = () => (
    <div className="space-y-6">
      {weddingInfo.loading ? (
        <div className="text-center py-8">Loading wedding information...</div>
      ) : weddingInfo.weddingInfo ? (
        <Card>
          <CardHeader>
            <CardTitle>Wedding Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Bride</h4>
                <p>{weddingInfo.weddingInfo.brideNames.join(' ')}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Groom</h4>
                <p>{weddingInfo.weddingInfo.groomNames.join(' ')}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Wedding Date</h4>
                <p>{new Date(weddingInfo.weddingInfo.weddingDate).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">RSVP Deadline</h4>
                <p>{new Date(weddingInfo.weddingInfo.rsvpDeadline).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Ceremony</h4>
                <p className="text-sm">{weddingInfo.weddingInfo.ceremony.venue}</p>
                <p className="text-sm text-muted-foreground">{weddingInfo.weddingInfo.ceremony.address}</p>
                <p className="text-sm">Time: {weddingInfo.weddingInfo.ceremony.time}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Reception</h4>
                <p className="text-sm">{weddingInfo.weddingInfo.reception.venue}</p>
                <p className="text-sm text-muted-foreground">{weddingInfo.weddingInfo.reception.address}</p>
                <p className="text-sm">Time: {weddingInfo.weddingInfo.reception.time}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Button 
                onClick={() => weddingInfo.weddingInfo && handleEdit(weddingInfo.weddingInfo)}
                disabled={!weddingInfo.weddingInfo}
              >
                Edit Wedding Information
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <div className="text-3xl mb-2">💒</div>
          <p>Wedding information not found</p>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'events':
        return renderEventsList();
      case 'stories':
        return renderStoriesList();
      case 'registries':
        return renderRegistriesList();
      case 'info':
        return renderWeddingInfo();
      default:
        return renderEventsList();
    }
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Content Management</h2>
          <p className="text-muted-foreground">Manage your wedding website content</p>
        </div>
        
        {activeTab !== 'info' && (
          <Button onClick={() => handleCreate(activeTab)}>
            Add New {activeTab.slice(0, -1)}
          </Button>
        )}
      </div>

      {/* Error Messages */}
      {(events.error || stories.error || registries.error || weddingInfo.error) && (
        <Alert variant="destructive">
          <AlertDescription>
            {events.error || stories.error || registries.error || weddingInfo.error}
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'events' | 'stories' | 'registries' | 'info')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {renderContent()}

      {/* Content Creation/Edit Dialog */}
      <ContentFormDialog 
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        type={activeTab}
        item={editingItem}
        onSuccess={() => {
          setShowDialog(false);
          setEditingItem(null);
          // Refresh data
          if (activeTab === 'events') events.fetchEvents();
          if (activeTab === 'stories') stories.fetchStories();
          if (activeTab === 'registries') registries.fetchRegistries();
          if (activeTab === 'info') weddingInfo.fetchWeddingInfo();
        }}
      />
    </div>
  );
}

// Content Form Dialog Component
interface ContentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  item?: EditableContent | null;
  onSuccess: () => void;
}

function ContentFormDialog({ isOpen, onClose, type, item, onSuccess }: ContentFormDialogProps) {
  const [formData, setFormData] = useState<ContentFormData>({
    title: '',
    content: '',
    description: '',
    isPublic: true,
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    address: '',
    dressCode: '',
    notes: '',
    imageUrl: '',
    author: 'both',
    storeName: '',
    storeUrl: '',
    isActive: true
  });

  const events = useWeddingEvents();
  const stories = useWeddingStories();
  const registries = useWeddingRegistries();

  // Pre-populate form when editing
  React.useEffect(() => {
    if (item) {
      const formData: ContentFormData = {
        title: '',
        description: '',
        isPublic: true,
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        address: '',
        dressCode: '',
        notes: '',
        imageUrl: '',
        content: '',
        author: 'both',
        storeName: '',
        storeUrl: '',
        isActive: true
      };

      // Populate based on item type
      if ('title' in item) formData.title = item.title;
      if ('description' in item) formData.description = item.description || '';
      if ('isPublic' in item) formData.isPublic = item.isPublic;
      if ('date' in item) formData.date = item.date;
      if ('startTime' in item) formData.startTime = item.startTime;
      if ('endTime' in item) formData.endTime = item.endTime || '';
      if ('location' in item) formData.location = item.location;
      if ('address' in item) formData.address = item.address;
      if ('dressCode' in item) formData.dressCode = item.dressCode || '';
      if ('notes' in item) formData.notes = item.notes || '';
      if ('imageUrl' in item) formData.imageUrl = item.imageUrl || '';
      if ('content' in item) formData.content = item.content;
      if ('author' in item) formData.author = item.author;
      if ('storeName' in item) formData.storeName = item.storeName;
      if ('storeUrl' in item) formData.storeUrl = item.storeUrl;
      if ('isActive' in item) formData.isActive = item.isActive;

      setFormData(formData);
    } else {
      // Reset form for new items
      setFormData({
        title: '',
        content: '',
        description: '',
        isPublic: true,
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        address: '',
        dressCode: '',
        notes: '',
        imageUrl: '',
        author: 'both',
        storeName: '',
        storeUrl: '',
        isActive: true
      });
    }
  }, [item, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let success = false;
    
    if (item) {
      // Edit existing item
      if (type === 'events') success = await events.updateEvent(item.id, formData);
      if (type === 'stories') success = await stories.updateStory(item.id, formData);
      if (type === 'registries') success = await registries.updateRegistry(item.id, formData);
    } else {
      // Create new item
      if (type === 'events') success = await events.createEvent(formData);
      if (type === 'stories') success = await stories.createStory(formData);
      if (type === 'registries') success = await registries.createRegistry(formData);
    }
    
    if (success) {
      onSuccess();
    }
  };

  if (!isOpen) return null;

  const renderFormFields = () => {
    switch (type) {
      case 'events':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Event Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter event title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter event description"
                rows={3}
                className="w-full px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date *</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Time *</label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Location *</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Venue name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Address *</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Full address"
                required
              />
            </div>
          </>
        );
        
      case 'stories':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Story Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter story title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Story Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Tell your story..."
                rows={5}
                className="w-full px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Author</label>
                <select
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value as 'bride' | 'groom' | 'both'})}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="both">Both</option>
                  <option value="bride">Bride</option>
                  <option value="groom">Groom</option>
                </select>
              </div>
            </div>
          </>
        );
        
      case 'registries':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Store Name *</label>
              <Input
                value={formData.storeName}
                onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                placeholder="Enter store name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Store URL *</label>
              <Input
                type="url"
                value={formData.storeUrl}
                onChange={(e) => setFormData({...formData, storeUrl: e.target.value})}
                placeholder="https://..."
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Brief description of items"
              />
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-2xl">
        <ModalHeader>
          <ModalTitle>
            {item ? 'Edit' : 'Create New'} {type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1)}
          </ModalTitle>
        </ModalHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderFormFields()}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={type === 'registries' ? formData.isActive : formData.isPublic}
                onChange={(e) => setFormData({
                  ...formData, 
                  [type === 'registries' ? 'isActive' : 'isPublic']: e.target.checked
                })}
                className="w-4 h-4 text-primary rounded"
              />
              <label htmlFor="isPublic" className="text-sm font-medium">
                {type === 'registries' ? 'Active' : 'Public'}
              </label>
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {item ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
}