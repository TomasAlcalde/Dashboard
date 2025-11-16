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

export type ClientFilters = {
  dateRange?: string;
  seller?: string;
  segment?: string;
};

const keys = {
  clients: (filters: ClientFilters) => ['clients', filters] as const,
  overview: ['metrics', 'overview'] as const,
  funnel: ['metrics', 'funnel'] as const,
} as const;

export async function fetchClients(filters: ClientFilters = {}): Promise<ClientListResponse> {
  const { data } = await apiClient.get<ClientListResponse>('/clients', {
    params: {
      seller: filters.seller,
      segment: filters.segment,
      range: filters.dateRange,
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
