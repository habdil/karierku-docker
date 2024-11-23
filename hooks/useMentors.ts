// hooks/useMentors.ts
import { useEffect, useState } from 'react';
import { MentorResponse, PaginationInfo, MentorsResponse } from '@/lib/types/api';

interface UseMentorsProps {
  search?: string;
  status?: string;
  expertise?: string;
  page?: number;
  limit?: number;
}

export function useMentors({
  search,
  status = 'ACTIVE',
  expertise,
  page = 1,
  limit = 10,
}: UseMentorsProps = {}) {
  const [mentors, setMentors] = useState<MentorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    pages: 0,
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (status) params.append('status', status);
        if (expertise) params.append('expertise', expertise);
        params.append('page', page.toString());
        params.append('limit', limit.toString());

        const response = await fetch(`/api/client/consultations?${params}`);
        if (!response.ok) throw new Error('Failed to fetch mentors');

        const data: MentorsResponse = await response.json();
        setMentors(data.mentors);
        setPagination(data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [search, status, expertise, page, limit]);

  return { mentors, loading, error, pagination };
}