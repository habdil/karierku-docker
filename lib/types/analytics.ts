export interface AnalyticsOverview {
    totalMentors: number;
    totalClients: number;
    totalEvents: number;
  }
  
  export interface CareerStatusData {
    status: string;
    count: number;
  }
  
  export interface RegistrationData {
    date: string;
    count: number;
  }
  
  export interface ConsultationStats {
    status: string;
    _count: {
      id: number;
    };
  }
  
  export interface EventParticipation {
    eventId: string;
    _count: {
      id: number;
    };
  }
  
  export interface AnalyticsData {
    overview: AnalyticsOverview;
    careerStatus: CareerStatusData[];
    monthlyRegistrations: RegistrationData[];
    consultationStats: ConsultationStats[];
    eventParticipation: EventParticipation[];
  }