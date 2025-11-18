import { useQuery } from '@tanstack/react-query';

import apiClient from './client';

export type Classification = {
  sentiment: string;
  urgency: string;
  budget_tier: string;
  buyer_role: string;
  use_case: string;
  objections?: string | null;
  competitors?: string | null;
  fit_score: number;
  close_probability: number;
};

export type TranscriptRecord = {
  id: number;
  client_id: number;
  assigned_seller?: string | null;
  meeting_date?: string | null;
  closed: boolean;
  transcript?: string | null;
  classification?: Classification | null;
};

export type ClientRecord = {
  id: number;
  name: string;
  email_hash?: string | null;
  phone_hash?: string | null;
  transcripts?: TranscriptRecord[];
};

export type ClientListResponse = {
  total: number;
  items: ClientRecord[];
};

export type MetricsOverview = {
  total_clients: number;
  classified_clients: number;
  open_opportunities: number;
  closed_wins: number;
};

export type MetricsFunnel = {
  discovery: number;
  evaluation: number;
  negotiation: number;
  closed: number;
};

export type MonthlyConversion = {
  month: string;
  closed: number;
  total: number;
  conversion: number;
};

export type ConversionMetrics = {
  monthly: MonthlyConversion[];
};

export type UrgencyBudgetCell = {
  urgency: number;
  budget_tier: string;
  total: number;
  closed: number;
  conversion: number;
};

export type UrgencyBudgetHeatmap = {
  cells: UrgencyBudgetCell[];
};

export type UseCaseStat = {
  use_case: string;
  total: number;
};

export type UseCaseDistribution = {
  items: UseCaseStat[];
};

export type UseCaseStatus = "all" | "closed" | "open";

export type ClientFilters = {
  dateRange?: string;
  seller?: string;
  segment?: string;
};

const keys = {
  clients: (filters: ClientFilters) => ['clients', filters] as const,
  overview: ['metrics', 'overview'] as const,
  funnel: ['metrics', 'funnel'] as const,
  conversions: ['metrics', 'conversions'] as const,
  urgencyBudget: ['metrics', 'urgency-budget'] as const,
  useCases: (status: UseCaseStatus) => ['metrics', 'use-cases', status] as const,
} as const;

export async function fetchClients(filters: ClientFilters = {}): Promise<ClientListResponse> {
  const { data } = await apiClient.get<ClientListResponse>('/clients', {
    params: {
      seller: filters.seller !== 'all' ? filters.seller : undefined,
      date_range: filters.dateRange === 'all' ? undefined : filters.dateRange,
    },
  });
  return data;
}

export async function fetchMetricsOverview(): Promise<MetricsOverview> {
  const { data } = await apiClient.get<MetricsOverview>('/metrics/overview');
  return data;
}

export async function fetchMetricsFunnel(): Promise<MetricsFunnel> {
  const { data } = await apiClient.get<MetricsFunnel>('/metrics/funnel');
  return data;
}

export async function fetchConversionMetrics(): Promise<ConversionMetrics> {
  const { data } = await apiClient.get<ConversionMetrics>('/metrics/conversions');
  return data;
}

export async function fetchUrgencyBudgetHeatmap(): Promise<UrgencyBudgetHeatmap> {
  const { data } = await apiClient.get<UrgencyBudgetHeatmap>('/metrics/urgency-budget');
  return data;
}

export async function fetchUseCaseDistribution(
  status: UseCaseStatus = 'all'
): Promise<UseCaseDistribution> {
  const { data } = await apiClient.get<UseCaseDistribution>('/metrics/use-cases', {
    params: { status },
  });
  return data;
}

export function useClients(filters: ClientFilters) {
  return useQuery({
    queryKey: keys.clients(filters),
    queryFn: () => fetchClients(filters),
    select: (payload) => payload,
  });
}

export function useMetricsOverview() {
  return useQuery({
    queryKey: keys.overview,
    queryFn: fetchMetricsOverview,
  });
}

export function useMetricsFunnel() {
  return useQuery({
    queryKey: keys.funnel,
    queryFn: fetchMetricsFunnel,
  });
}

export function useConversionMetrics() {
  return useQuery({
    queryKey: keys.conversions,
    queryFn: fetchConversionMetrics,
  });
}

export function useUrgencyBudgetHeatmap() {
  return useQuery({
    queryKey: keys.urgencyBudget,
    queryFn: fetchUrgencyBudgetHeatmap,
  });
}

export function useUseCaseDistribution(status: UseCaseStatus) {
  return useQuery({
    queryKey: keys.useCases(status),
    queryFn: () => fetchUseCaseDistribution(status),
  });
}
