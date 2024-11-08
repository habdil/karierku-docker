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