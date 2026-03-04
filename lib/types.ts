export type Event = {
  id: string;
  user_id: string;
  name: string;
  sport_type: string;
  date: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  venues?: Venue[];
};

export type Venue = {
  id: string;
  event_id: string;
  name: string;
  address: string | null;
  created_at: string;
};

export type ActionResponse<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};