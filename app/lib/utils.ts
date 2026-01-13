// app/lib/utils.ts
// Utility functions for the Finance Dashboard

/**
 * Format a number as USD currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Format a date string to readable format
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * Format a date for input field (YYYY-MM-DD)
 */
export function formatDateForInput(date: string | Date): string {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}

/**
 * Check if an email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get invoice status color
 */
export function getStatusColor(
  status: string
): "pending" | "paid" | "overdue" {
  switch (status.toLowerCase()) {
    case "paid":
      return "paid";
    case "overdue":
      return "overdue";
    case "pending":
    default:
      return "pending";
  }
}

/**
 * Get status badge class
 */
export function getStatusBadgeClass(status: string): string {
  switch (status.toLowerCase()) {
    case "paid":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "overdue":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    case "pending":
    default:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
  }
}

/**
 * Calculate days until due date
 */
export function daysUntilDue(dueDate: string | Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Check if an invoice is overdue
 */
export function isOverdue(dueDate: string | Date): boolean {
  return daysUntilDue(dueDate) < 0;
}

/**
 * Generate a unique ID
 */
export function generateId(prefix: string = "id"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce function for search and filter inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Truncate text to a maximum length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength - 3) + "...";
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("authToken");
}

/**
 * Get current user email
 */
export function getCurrentUserEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("userEmail");
}

/**
 * Sort invoices by field
 */
export function sortInvoices<T extends Record<string, any>>(
  invoices: T[],
  field: string,
  order: "asc" | "desc" = "asc"
): T[] {
  return [...invoices].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (typeof aVal === "string") {
      return order === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    if (typeof aVal === "number") {
      return order === "asc" ? aVal - bVal : bVal - aVal;
    }

    return 0;
  });
}

/**
 * Filter invoices by status
 */
export function filterInvoicesByStatus<T extends Record<string, any>>(
  invoices: T[],
  status: string
): T[] {
  if (!status) return invoices;
  return invoices.filter((inv) => inv.status === status);
}
