// lib/api/recommendations.ts
import { RecommendationResponse } from '@/lib/types/api'; // Adjust the import path as necessary

export async function fetchMentorRecommendations(assessmentId: string): Promise<RecommendationResponse[]> {
    const response = await fetch(`/api/career-assessment/${assessmentId}/recommendations`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch recommendations');
    }
    
    return response.json();
  }