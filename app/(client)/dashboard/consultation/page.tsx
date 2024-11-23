'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import ListMentor from '@/components/client/consultations/ListMentor';
import { useMentors } from '@/hooks/useMentors';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EXPERTISE_OPTIONS = [
  { label: 'All Expertise', value: 'all' },
  { label: 'Web Development', value: 'web-development' },
  { label: 'Mobile Development', value: 'mobile-development' },
  { label: 'Data Science', value: 'data-science' },
  { label: 'UI/UX Design', value: 'ui-ux' },
];

export default function ConsultationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentExpertise, setCurrentExpertise] = useState('all');
  
  const { mentors, loading, error, pagination } = useMentors({
    search: searchQuery,
    expertise: currentExpertise === 'all' ? undefined : currentExpertise,
  });

  const handleChatClick = (mentorId: string) => {
    console.log('Opening chat with mentor:', mentorId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Available Mentors</h1>
        <p className="text-muted-foreground">
          Connect with our experienced mentors for guidance
        </p>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search mentors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={currentExpertise}
            onValueChange={setCurrentExpertise}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Choose expertise" />
            </SelectTrigger>
            <SelectContent>
              {EXPERTISE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats Section */}
        <div className="flex gap-4">
          <Badge variant="success">
            {pagination.total} Mentors Available
          </Badge>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="text-red-500 p-4 rounded-lg bg-red-50">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-48 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : (
        <ListMentor 
          mentors={mentors}
          onChatClick={handleChatClick}
        />
      )}
    </div>
  );
}