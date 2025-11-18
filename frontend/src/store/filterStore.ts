import { create } from 'zustand';

export type FilterSlice = {
  dateRange: 'all' | '7d' | '30d' | '90d';
  seller: string;
  segment: string;
  setDateRange: (value: FilterSlice['dateRange']) => void;
  setSeller: (value: string) => void;
  setSegment: (value: string) => void;
};

export const useFilterStore = create<FilterSlice>((set) => ({
  dateRange: '30d',
  seller: 'all',
  segment: 'all',
  setDateRange: (value) => set({ dateRange: value }),
  setSeller: (value) => set({ seller: value }),
  setSegment: (value) => set({ segment: value }),
}));
