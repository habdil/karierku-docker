// components/client/consultations/MentorList.tsx
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { MentorCard } from "./MentorCard";

interface Mentor {
  id: string;
  fullName: string;
  avatar?: string;
  company: string;
  jobRole: string;
  education: string;
  isAvailableNow?: boolean;
}

interface MentorListProps {
  mentors: Mentor[];
}

export function MentorList({ mentors }: MentorListProps) {
  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search mentors..."
          className="pl-10"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mentors.map((mentor) => (
          <MentorCard name={""} key={mentor.id} {...mentor} />
        ))}
      </div>
    </div>
  );
}
