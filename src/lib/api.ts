const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface DashboardData {
  totalBookings: number;
  activeReminders: number;
  revenue: number;
  changeInRevenue: number;
  changeInActiveReminders: number;
  changeInTotalBookings: number;
}

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

export async function getDashboard(companyId: string): Promise<DashboardData> {
  return apiRequest<DashboardData>(`/v1/api/companies/${companyId}/dashboard`);
}