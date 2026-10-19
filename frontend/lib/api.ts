import { Category, Venue, EventItem, RegistrationItem } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('localpulse_access_token');
};

export const setAuthTokens = (access: string, refresh: string, username?: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('localpulse_access_token', access);
  localStorage.setItem('localpulse_refresh_token', refresh);
  if (username) {
    localStorage.setItem('localpulse_username', username);
  }
};

export const clearAuthTokens = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('localpulse_access_token');
  localStorage.removeItem('localpulse_refresh_token');
  localStorage.removeItem('localpulse_username');
};

export const getCurrentUsername = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('localpulse_username');
};

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = 'API request failed';
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.message || JSON.stringify(errJson);
    } catch {
      errorDetail = await response.text();
    }
    throw new Error(errorDetail);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  // Events
  async getEvents(params: Record<string, string> = {}): Promise<{ results: EventItem[]; count: number }> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });
    const qs = searchParams.toString();
    return apiRequest<{ results: EventItem[]; count: number }>(`/events/${qs ? `?${qs}` : ''}`);
  },

  async getEvent(id: number | string): Promise<EventItem> {
    return apiRequest<EventItem>(`/events/${id}/`);
  },

  async registerEvent(id: number | string): Promise<{ message: string; remaining_spots: number; registration: RegistrationItem }> {
    return apiRequest<{ message: string; remaining_spots: number; registration: RegistrationItem }>(
      `/events/${id}/register/`,
      { method: 'POST' }
    );
  },

  async createEvent(data: Record<string, any>): Promise<EventItem> {
    return apiRequest<EventItem>('/events/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Registrations / Passes
  async getMyRegistrations(): Promise<{ results: RegistrationItem[]; count: number } | RegistrationItem[]> {
    const res = await apiRequest<any>('/registrations/');
    if (Array.isArray(res)) return res;
    return res.results ? res.results : [];
  },

  async cancelRegistration(id: number | string): Promise<{ message: string; remaining_spots: number }> {
    return apiRequest<{ message: string; remaining_spots: number }>(`/registrations/${id}/cancel/`, {
      method: 'POST',
    });
  },

  // Taxonomies
  async getCategories(): Promise<Category[]> {
    return apiRequest<Category[]>('/categories/');
  },

  async getVenues(): Promise<Venue[]> {
    return apiRequest<Venue[]>('/venues/');
  },

  // Auth
  async login(credentials: { username: string; password: string }): Promise<any> {
    const res = await apiRequest<any>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res.access) {
      setAuthTokens(res.access, res.refresh, res.user?.username || credentials.username);
    }
    return res;
  },

  async registerUser(userData: { username: string; email: string; password: string; password_confirm: string }): Promise<any> {
    return apiRequest<any>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};
