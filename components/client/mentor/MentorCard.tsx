// components/client/mentor/MentorCard.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Briefcase, GraduationCap, Star } from "lucide-react";
import { useRouter } from "next/navigation";

type MentorExpertise = {
  area: string;
  tags: string[];
};

type MentorCardProps = {
  id: string;
  fullName: string;
  jobRole: string;
  company: string;
  education: string;
  expertise: MentorExpertise[];
  matchingScore: number;
  matchingCriteria: {
    expertiseMatch: Array<{
      area: string;
      matchingTags: string[];
    }>;
  };
};

export const MentorCard = ({
  id,
  fullName,
  jobRole,
  company,
  education,
  expertise,
  matchingScore,
  matchingCriteria,
}: MentorCardProps) => {
  const router = useRouter();
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={`/api/client/avatar/${id}`} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{fullName}</CardTitle>
              <CardDescription>
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4" />
                  <span>{jobRole} at {company}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4" />
                  <span>{education}</span>
                </div>
              </CardDescription>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="text-lg font-semibold">
                {matchingScore}% Match
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Bidang Keahlian</h4>
            <div className="flex flex-wrap gap-2">
              {expertise.map((exp, idx) => (
                <Badge key={idx} variant="default">
                  {exp.area}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Kecocokan dengan Anda</h4>
            <div className="space-y-2">
              {matchingCriteria.expertiseMatch.map((match, idx) => (
                <div key={idx}>
                  <div className="text-sm text-muted-foreground mb-1">
                    {match.area}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {match.matchingTags.map((tag, tagIdx) => (
                      <Badge key={tagIdx} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full text-white"
          onClick={() => router.push(`/dashboard/consultation/${id}`)}
        >
          Mulai Konsultasi
        </Button>
      </CardFooter>
    </Card>
  );
};