// hooks/useMentorDetail.ts
import { useState, useEffect } from 'react';
import { MentorResponse } from '@/lib/types/api';

export function useMentorDetail(mentorId: string) {
  const [mentor, setMentor] = useState<MentorResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMentorDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/client/consultations/${mentorId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch mentor details');
        }
        const data = await response.json();
        setMentor(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (mentorId) {
      fetchMentorDetail();
    }
  }, [mentorId]);

  const bookSlot = async (slotId: string) => {
    try {
      const response = await fetch(`/api/client/consultations/${mentorId}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slotId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to book slot');
      }

      const result = await response.json();
      return result;
    } catch (err) {
      throw err;
    }
  };

  return {
    mentor,
    loading,
    error,
    bookSlot,
  };
}