// components/client/mentor/MentorList.tsx
import { MentorCard } from "./MentorCard";

type MentorListProps = {
  recommendations: Array<{
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
  }>;
};

export const MentorList = ({ recommendations }: MentorListProps) => {
  return (
    <div className="grid gap-6">
      {recommendations.map((rec) => (
        <MentorCard
          key={rec.id}
          id={rec.mentor.id}
          fullName={rec.mentor.fullName}
          jobRole={rec.mentor.jobRole}
          company={rec.mentor.company}
          education={rec.mentor.education}
          expertise={rec.mentor.expertise}
          matchingScore={rec.matchingScore}
          matchingCriteria={rec.matchingCriteria}
        />
      ))}
    </div>
  );
};