// lib/types/consultations.ts
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
  client: {
    id: string;
    fullName: string;
    image?: string;
  };
  mentor: {
    expertise: any;
    id: string;
    fullName: string;
    image?: string;
  };
  startTime?: string;
  endTime?: string;
  zoomLink?: string;
  slotId?: string;
  lastMessageAt?: string;
  rating?: number;
  review?: string;
  messages: any[];
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