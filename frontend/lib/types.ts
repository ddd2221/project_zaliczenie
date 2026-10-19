export interface Category {
  id: number;
  name: string;
  slug: string;
  icon_name: string;
  events_count?: number;
}

export interface Venue {
  id: number;
  name: string;
  city: string;
  address: string;
  capacity: number;
}

export interface Organizer {
  id: number;
  username: string;
  email: string;
}

export interface EventItem {
  id: number;
  title: string;
  slug: string;
  description?: string;
  category: Category;
  venue: Venue;
  organizer?: Organizer;
  start_time: string;
  end_time?: string;
  total_capacity: number;
  remaining_spots: number;
  price: string | number;
  is_sold_out: boolean;
  reserved_percentage: number;
  image_url: string;
  user_registered?: boolean;
  created_at: string;
}

export interface RegistrationItem {
  id: number;
  ticket_code: string;
  event: EventItem;
  status: 'CONFIRMED' | 'CANCELLED';
  created_at: string;
  cancelled_at?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
  user?: {
    id: number;
    username: string;
    email: string;
  };
}
