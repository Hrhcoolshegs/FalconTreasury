import { create } from 'zustand';
import { GlobalFilters } from '../types';

interface StoreState {
  isAuthenticated: boolean;
  user: { email: string; name: string; department: string } | null;
  filters: GlobalFilters;
  sidebarCollapsed: boolean;
  aiConciergeOpen: boolean;
  darkMode: boolean;

  setAuthenticated: (value: boolean) => void;
  setUser: (user: { email: string; name: string; department: string } | null) => void;
  updateFilters: (filters: Partial<GlobalFilters>) => void;
  resetFilters: () => void;
  toggleSidebar: () => void;
  toggleAIConcierge: () => void;
  toggleDarkMode: () => void;
}

const defaultFilters: GlobalFilters = {
  dateRange: null,
  desk: null,
  counterparty: null,
  currency: null,
  product: null,
  region: null,
  exposureRange: null,
  riskCategory: null,
  sentimentBucket: null,
  tradeStatus: null,
  tradeSizeRange: null,
  trader: null,
  predictionMode: null,
};

export const useStore = create<StoreState>((set) => ({
  isAuthenticated: false,
  user: null,
  filters: defaultFilters,
  sidebarCollapsed: false,
  aiConciergeOpen: false,
  darkMode: false,

  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setUser: (user) => set({ user }),
  updateFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () => set({ filters: defaultFilters }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  toggleAIConcierge: () => set((state) => ({ aiConciergeOpen: !state.aiConciergeOpen })),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));
