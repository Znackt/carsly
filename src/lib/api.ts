const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// ── Shared company ID (replace with auth context later) ───────────────────────
export const COMPANY_ID = '100';

// ── Generic request helper ────────────────────────────────────────────────────
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DashboardData {
  totalBookings: number;
  activeReminders: number;
  revenue: number;
  changeInRevenue: number;
  changeInActiveReminders: number;
  changeInTotalBookings: number;
}

export interface BookingRow {
  id: string;
  customerName: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  status: string;
}

export interface CustomerRow {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsAppNumber: string;
  city: string;
  status: string;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  billingCycle: string;
  isActive: boolean;
}

export interface Subscription {
  id: number;
  subscriptionCode: string;
  customerId: number;
  customerName: string;
  planId: number;
  planName: string;
  price: number;
  billingCycle: string;
  status: string;
  startsAt: string;
  endsAt: string;
  autoRenew: boolean;
  paymentMethod: string;
  paymentStatus: string;
}

export interface CreateCustomerPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsAppNumber: string;
  city: string;
}

export interface AssignSubscriptionPayload {
  planId: number;
  paymentMethod: string;
  autoRenew: boolean;
}

// ── API functions ─────────────────────────────────────────────────────────────

export function getDashboard(companyId: string): Promise<DashboardData> {
  return apiRequest<DashboardData>(`/v1/api/companies/${companyId}/dashboard`);
}

export function getBookings(
  companyId: string,
  period: string = 'today',
  startDate?: string,
  endDate?: string
): Promise<BookingRow[]> {
  const today = new Date().toLocaleDateString('en-GB').replace(/\//g, '-'); // dd-MM-yyyy
  const start = startDate ?? today;
  const end = endDate ?? today;
  return apiRequest<BookingRow[]>(
    `/v1/api/companies/${companyId}/bookings?period=${period}&startDate=${start}&endDate=${end}`
  );
}

export function getCustomers(companyId: string, search?: string): Promise<CustomerRow[]> {
  const q = search ? `?search=${encodeURIComponent(search)}` : '';
  return apiRequest<CustomerRow[]>(`/v1/api/companies/${companyId}/customers${q}`);
}

export function createCustomer(companyId: string, payload: CreateCustomerPayload): Promise<CustomerRow> {
  return apiRequest<CustomerRow>(`/v1/api/companies/${companyId}/customers`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getSubscriptionPlans(companyId: string): Promise<SubscriptionPlan[]> {
  return apiRequest<SubscriptionPlan[]>(`/v1/api/companies/${companyId}/subscription-plans`);
}

export function createSubscriptionPlan(companyId: string, payload: Omit<SubscriptionPlan, 'id' | 'isActive'>): Promise<SubscriptionPlan> {
  return apiRequest<SubscriptionPlan>(`/v1/api/companies/${companyId}/subscription-plans`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getCompanySubscriptions(companyId: string, status = 'ACTIVE'): Promise<Subscription[]> {
  return apiRequest<Subscription[]>(`/v1/api/companies/${companyId}/subscriptions?status=${status}`);
}

export function getCustomerSubscriptions(companyId: string, customerId: number): Promise<Subscription[]> {
  return apiRequest<Subscription[]>(`/v1/api/companies/${companyId}/customers/${customerId}/subscriptions`);
}

export function assignSubscription(
  companyId: string,
  customerId: number,
  payload: AssignSubscriptionPayload
): Promise<Subscription> {
  return apiRequest<Subscription>(
    `/v1/api/companies/${companyId}/customers/${customerId}/subscriptions`,
    { method: 'POST', body: JSON.stringify(payload) }
  );
}