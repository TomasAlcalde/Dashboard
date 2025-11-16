import apiClient from './client';

export type DashboardSummary = {
  totalUsers: number;
  activeSessions: number;
  conversionRate: number;
};

export async function fetchDashboardSummary(timeframe: "7d" | "30d"): Promise<DashboardSummary> {
  const { data } = await apiClient.get<DashboardSummary>('/dashboard', {
    params: { timeframe }
  });

  return data;
}