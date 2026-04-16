export interface User {
  id: string;
  email: string;
  full_name: string; // API: full_name instead of firstName/lastName
  avatar?: string;   // API: avatar instead of profilePicture
  is_verified?: boolean; // API field
  verification_status?: 'pending' | 'submitted' | 'approved' | 'rejected';
  date_joined?: string;
  last_seen?: string;
  phone?: string;
  country_code?: string;
  address?: string;
  city?: string;
  occupation?: string;
  bio?: string;
  balance?: number;
  currency_code?: string;
}

export interface AuthResponse {
  access: string;    // API: access instead of token
  refresh: string;   // API returns tokens separately
  user: User;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface OfferInterest {
  id: string;
  buyer: User;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  message: string;
  room?: string;
  created_at: string;
  responded_at?: string;
}

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  flag_emoji?: string;
  is_active: boolean;
}

export interface ExchangeRate {
  from_currency: Currency;
  to_currency: Currency;
  rate: number;
  fetched_at: string;
}

export interface Offer {
  id: string;
  owner: User;
  give_currency: Currency;
  give_amount: number;
  want_currency: Currency;
  want_amount: number;
  spread_percentage: number;
  offer_type: 'buy' | 'sell';
  status: 'active' | 'paused' | 'closed' | 'expired';
  is_active: boolean;
  notes?: string;
  city?: string;
  country_code?: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  offer?: string | Offer;
  room?: string;
  seller: User;
  buyer: User;
  give_currency: Currency;
  give_amount: number;
  want_currency: Currency;
  want_amount: number;
  rate: number;
  status: 'pending' | 'completed' | 'cancelled' | 'disputed';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface RoomMember {
  id: string;
  user: User;
  is_admin: boolean;
  joined_at: string;
  last_read_at?: string;
}

export interface Message {
  id: string;
  room: string;
  sender: User;
  msg_type: 'text' | 'image' | 'file';
  content?: string;
  file_url?: string;
  file_name?: string;
  is_deleted: boolean;
  created_at: string;
}

export interface Room {
  id: string;
  offer?: Offer;
  room_type: 'p2p' | 'group' | 'support';
  status: 'active' | 'closed';
  members: RoomMember[];
  last_message?: Message;
  unread_count: number;
  created_at: string;
}

export interface DashboardStats {
  total_balance_aoa: number;
  total_balance_usd: number;
  transaction_count: number;
  active_offers: number;
  rates: ExchangeRate[];
}

export type LogSeverity = 'critical' | 'warning' | 'system' | 'info';

export interface LogEntry {
  id: string;
  action: string;
  actorName: string;
  actorRole: string;
  actorId: string;
  severity: LogSeverity;
  timestamp: string;
  icon: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  notif_type: 'trade' | 'security' | 'message' | 'system' | 'info';
  is_read: boolean;
  link?: string;
  created_at: string;
}

export interface NotificationPreferences {
  email_offers: boolean;
  email_security: boolean;
  email_promotions: boolean;
  push_messages: boolean;
  push_offers: boolean;
  push_security: boolean;
}
