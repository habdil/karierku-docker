// lib/types/dashboard.ts
export interface DashboardAnalytics {
  overview: {
    totalUsers: number;
    activeMentors: number;
    upcomingEvents: number;
    totalConsultations: number;
    totalCareerAssessments: number;
  };
  userGrowth: Array<{
    createdAt: string;
    _count: { id: number };
  }>;
}

export interface RecentActivities {
  recentUsers: Array<{
    id: string;
    email: string;
    createdAt: string;
    client?: {
      fullName: string;
      image?: string;
    };
    mentor?: {
      fullName: string;
      image?: string;
    };
  }>;
  recentConsultations: Array<{
    id: string;
    status: string;
    createdAt: string;
    client: {
      fullName: string;
    };
    mentor: {
      fullName: string;
    };
  }>;
  recentEvents: Array<{
    id: string;
    title: string;
    createdAt: string;
    admin: {
      fullName: string;
    };
  }>;
}