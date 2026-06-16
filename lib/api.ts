import { supabase } from './supabase';
import { Event, RSVP } from '@/types/database';

const API_BASE = '/api';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers: Record<string, string> = {};
  
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers as Record<string, string>,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Terjadi kesalahan');
  }

  return response.json();
}

export const eventsAPI = {
  async getAll(): Promise<Event[]> {
    return fetchAPI('/events');
  },

  async getByUser(userId: string): Promise<Event[]> {
    return fetchAPI(`/events?user_id=${userId}`);
  },

  async getByPath(eventPath: string): Promise<Event> {
    return fetchAPI(`/events?event_path=${eventPath}`);
  },

  async getById(id: string): Promise<Event> {
    return fetchAPI(`/events/${id}`);
  },

  async create(event: any): Promise<Event> {
    return fetchAPI('/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  },

  async update(id: string, event: any): Promise<Event> {
    return fetchAPI(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(event),
    });
  },

  async delete(id: string): Promise<void> {
    return fetchAPI(`/events/${id}`, {
      method: 'DELETE',
    });
  },
};

export const rsvpsAPI = {
  async getByEvent(eventId: string): Promise<RSVP[]> {
    return fetchAPI(`/rsvps?event_id=${eventId}`);
  },

  async create(rsvp: any): Promise<RSVP> {
    return fetchAPI('/rsvps', {
      method: 'POST',
      body: JSON.stringify(rsvp),
    });
  },
};

export async function uploadFile(file: File, folder: string = 'general'): Promise<{ url: string; path: string }> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('Unauthorized');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  
  const type = file.type.startsWith('image/') ? 'image' : 
               file.type.startsWith('audio/') ? 'music' : 'video';
  formData.append('type', type);

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Upload gagal');
  }

  return response.json();
}

export async function deleteFile(url: string): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Unauthorized');

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Gagal menghapus');
  }
}
