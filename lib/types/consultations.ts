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
    client: any;
    id: string;
    status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    zoomLink?: string | null;
    createdAt: Date;
    updatedAt: Date;
    startTime?: string | Date | null; // Add this
    endTime?: string | Date | null; 
    lastMessageAt?: Date | null;
    slot: ConsultationSlot | null;
    mentor: {
      id: string;
      fullName: string;
      image?: string | null;
      expertise: MentorExpertise[];
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

