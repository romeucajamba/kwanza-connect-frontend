export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  balance?: number;
  currency?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'transfer';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  description?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
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
