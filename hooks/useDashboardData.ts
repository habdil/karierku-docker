// hooks/useDashboardData.ts
import useSWR from 'swr';
import type { DashboardAnalytics, RecentActivities } from '@/lib/types/dashboard';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useDashboardData() {
  const { data: analytics, error: analyticsError } = useSWR<DashboardAnalytics>(
    '/api/admin/dashboard/analytics',
    fetcher
  );

  const { data: activities, error: activitiesError } = useSWR<RecentActivities>(
    '/api/admin/dashboard/recent-activities',
    fetcher
  );

  return {
    analytics,
    activities,
    isLoading: !analytics && !analyticsError,
    isError: analyticsError || activitiesError
  };
}