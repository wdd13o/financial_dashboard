// app/lib/types.ts
// Type definitions for the Finance Dashboard

export interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string; // For multi-user support
}

export type InvoiceStatus = "pending" | "paid" | "overdue";

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  userId: string;
  email: string;
  token: string;
}

export interface DashboardStats {
  totalInvoices: number;
  totalAmount: number;
  pendingAmount: number;
  paidAmount: number;
  overdueAmount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FormError {
  field: string;
  message: string;
}

export interface CreateInvoiceInput {
  clientName: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
  description: string;
}

export interface UpdateInvoiceInput extends Partial<CreateInvoiceInput> {
  id: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  email: string;
  password: string;
  confirmPassword: string;
}
