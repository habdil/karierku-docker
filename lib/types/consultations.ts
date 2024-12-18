export interface ConsultationSlot {
  id: string;
  mentorId: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  isBooked: boolean;
  maxBookings: number;
  isRecurring: boolean;
  recurringDays: number[];
}

export interface ConsultationDetails {
  id: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  startTime?: Date;
  endTime?: Date;
  lastMessageAt?: Date;
  zoomLink?: string | null;
  mentor: {
    id: string;
    fullName: string;
    image?: string | null;
    expertise: MentorExpertise[];
  };
  client: {
    id: string;
    fullName: string;
    image?: string | null;
  };
  slot?: {
    startTime: Date;
    endTime: Date;
  };
}


export interface ConsultationMessage {
  id: string;
  senderId: string;
  content: string;
  type: 'TEXT' | 'FILE' | 'SYSTEM';
  createdAt: Date;
  readAt?: Date;
}

export interface ConsultationRequest {
  slotId: string;
  message?: string;
}

export interface ConsultationResponse {
  message: string;
  status: boolean;
  consultationId?: string;
}

export interface MentorExpertise {
  id: string;
  area: string;
  level: number;
}

// Additional types
export interface ConsultationFeedback {
  id: string;
  consultationId: string;
  rating: number;
  review?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConsultationSchedule {
  slotId: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  meetingUrl?: string;
  reminderSent: boolean;
}

export interface ConsultationStats {
  totalSessions: number;
  avgRating: number;
  completionRate: number;
  totalDuration: number;
}

export interface ConsultationFilters {
  status?: ConsultationDetails['status'];
  startDate?: Date;
  endDate?: Date;
  mentorId?: string;
  clientId?: string;
}

export interface ConsultationPagination {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  hasMore: boolean;
}