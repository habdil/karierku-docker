export interface AnalyticsOverviewProps {
    data: {
      totalMentors: number;
      totalClients: number;
      totalEvents: number;
    }
  }
  
  export interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
  }