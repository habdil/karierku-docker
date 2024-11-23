import { ConsultationSlot } from "@prisma/client";

// lib/types/api.ts
export type RecommendationResponse = {
    id: string;
    mentor: {
      id: string;
      fullName: string;
      jobRole: string;
      company: string;
      education: string;
      expertise: Array<{
        area: string;
        tags: string[];
      }>;
    };
    matchingScore: number;
    matchingCriteria: {
      expertiseMatch: Array<{
        area: string;
        matchingTags: string[];
      }>;
    };
  };

// lib/types/api.ts
export interface MentorExpertise {
  area: string;
  level: number;
  tags: string[];
}

export interface ConsultationInfo {
  id: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  zoomLink: string | null;
}

export interface MentorResponse {
  availableSlots: ConsultationSlot[] | undefined;
  id: string;
  fullName: string;
  image: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  jobRole: string;
  company: string;
  education: string;
  motivation: string | null;
  expertise: MentorExpertise[];
  hasAvailableSlot: boolean;
  nextAvailableSlot: string | null; // Changed from Date to string
  consultation: ConsultationInfo | null;
}

export interface PaginationInfo {
  total: number;
  pages: number;
  page: number;
  limit: number;
}

export interface MentorsResponse {
  mentors: MentorResponse[];
  pagination: PaginationInfo;
}