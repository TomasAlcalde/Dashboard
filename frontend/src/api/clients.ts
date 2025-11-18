import { useQuery } from '@tanstack/react-query';

import apiClient from './client';

export type Classification = {
  sentiment: number;
  urgency: number;
  budget_tier?: string | null;
  buyer_role?: string | null;
  use_case?: string | null;
  origin: string;
  automatization?: boolean | null;
  pains?: string[] | null;
  risks?: string[] | null;
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

export type PainStat = {
  pain: string;
  total: number;
};

export type PainDistribution = {
  items: PainStat[];
};

export type SellerConversionStat = {
  seller: string;
  closed: number;
  total: number;
  conversion: number;
};

export type SellerConversionResponse = {
  items: SellerConversionStat[];
};

export type OriginStat = {
  origin: string;
  total: number;
};

export type OriginDistribution = {
  items: OriginStat[];
};

export type AutomatizationOutcome = {
  automatization: boolean;
  closed: number;
  open: number;
};

export type AutomatizationOutcomeSeries = {
  items: AutomatizationOutcome[];
};

export type SentimentConversionStat = {
  sentiment: number;
  closed: number;
  open: number;
};

export type SentimentConversionSeries = {
  items: SentimentConversionStat[];
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
  pains: ['metrics', 'pains', 'distribution'] as const,
  sellerConversion: ['metrics', 'seller-conversion'] as const,
  origins: ['metrics', 'origins'] as const,
  automatization: ['metrics', 'automatization-outcomes'] as const,
  sentimentConversion: ['metrics', 'sentiment-conversion'] as const,
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

export async function fetchPainDistribution(): Promise<PainDistribution> {
  const { data } = await apiClient.get<PainDistribution>('/metrics/pains/distribution');
  return data;
}

export async function fetchSellerConversion(): Promise<SellerConversionResponse> {
  const { data } = await apiClient.get<SellerConversionResponse>('/metrics/seller-conversion');
  return data;
}

export async function fetchOriginDistribution(): Promise<OriginDistribution> {
  const { data } = await apiClient.get<OriginDistribution>('/metrics/origins');
  return data;
}

export async function fetchAutomatizationOutcomes(): Promise<AutomatizationOutcomeSeries> {
  const { data } = await apiClient.get<AutomatizationOutcomeSeries>('/metrics/automatization-outcomes');
  return data;
}

export async function fetchSentimentConversion(): Promise<SentimentConversionSeries> {
  const { data } = await apiClient.get<SentimentConversionSeries>('/metrics/sentiment-conversion');
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

export function usePainDistribution() {
  return useQuery({
    queryKey: keys.pains,
    queryFn: fetchPainDistribution,
  });
}

export function useSellerConversion() {
  return useQuery({
    queryKey: keys.sellerConversion,
    queryFn: fetchSellerConversion,
  });
}

export function useOriginDistribution() {
  return useQuery({
    queryKey: keys.origins,
    queryFn: fetchOriginDistribution,
  });
}

export function useAutomatizationOutcomes() {
  return useQuery({
    queryKey: keys.automatization,
    queryFn: fetchAutomatizationOutcomes,
  });
}

export function useSentimentConversion() {
  return useQuery({
    queryKey: keys.sentimentConversion,
    queryFn: fetchSentimentConversion,
  });
}
