export type Role = 'Admin' | 'Manager';
export type Currency = 'BDT' | 'USD';
export type Mode = 'Sandbox' | 'Live';
export type TxStatus = 'Pending' | 'Success' | 'Failed' | 'Cancelled';

export interface User {
  id: string;
  email: string;
  passwordHash: string; // Simulated hash
  role: Role;
  name: string;
}

export interface Gateway {
  id: string;
  name: string;
  store_id: string;
  prefix: string;
  secret_key: string;
  payment_url: string;
  verify_url: string;
  ipn_url: string;
  currency: Currency;
  mode: Mode;
  active: boolean;
}

export interface Project {
  id: string;
  name: string;
  api_key: string;
  client_id: string;
  secret_key: string;
}

export interface LogEntry {
  timestamp: string;
  message: string;
  actor?: string; // e.g. "System", "Gateway", "User"
}

export interface Transaction {
  id: string;
  project_id: string;
  amount: number;
  transaction_id: string; // UUID
  status: TxStatus;
  date: string;
  customer_email?: string;
  payment_method?: string;
  logs?: LogEntry[];
  notes?: string;
}

export interface Payout {
  id: string;
  project_id: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Processed';
}

export interface Financial {
  project_id: string;
  project_name: string;
  total_earned: number;
  released_amount: number;
  balance: number;
}