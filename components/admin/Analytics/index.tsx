'use client';

export { Overview } from './AnalyticsOverview';
export { 
  CareerStatusChart, 
  RegistrationChart, 
  ConsultationChart,
  EventParticipationTable 
} from './AnalyticsCharts';

import { useAnalytics } from "@/hooks/useAnalytics";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingBars } from "@/components/ui/loading-bars";
import { Overview } from "./AnalyticsOverview";
import { 
  CareerStatusChart, 
  RegistrationChart, 
  ConsultationChart,
  EventParticipationTable 
} from "./AnalyticsCharts";

export function Analytics() {
  const { data, isLoading, error } = useAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingBars text="Memuat data analytics..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert>
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>No analytics data available.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <Overview data={data.overview} />
      
      <div className="grid gap-4 grid-cols-4">
        <CareerStatusChart data={data.careerStatus} />
        <ConsultationChart data={data.consultationStats} />
        <RegistrationChart data={data.monthlyRegistrations} />
        <EventParticipationTable data={data.eventParticipation} />
      </div>
    </div>
  );
}