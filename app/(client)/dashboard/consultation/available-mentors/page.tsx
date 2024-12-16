// app/(client)/dashboard/consultation/available-mentors/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { LoadingBars } from "@/components/ui/loading-bars";
import { Briefcase, GraduationCap, Search, Star } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface AvailableMentor {
  id: string;
  userId: string;
  fullName: string;
  education: string;
  company: string;
  jobRole: string;
  expertise: {
    area: string;
    level: number;
    tags: string[];
  }[];
  rating?: number;
  totalConsultations?: number;
  nextAvailableSlot?: string;
  image?: string;
}

const expertise_options = [
  { value: "all", label: "All Expertise" },
  { value: "web-development", label: "Web Development" },
  { value: "mobile-development", label: "Mobile Development" },
  { value: "data-science", label: "Data Science" },
  { value: "ui-ux", label: "UI/UX Design" },
  { value: "machine-learning", label: "Machine Learning" },
  { value: "devops", label: "DevOps" },
  { value: "cloud-computing", label: "Cloud Computing" },
];

export default function AvailableMentorsPage() {
  const [mentors, setMentors] = useState<AvailableMentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expertise, setExpertise] = useState("all");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const { toast } = useToast();

  useEffect(() => {
    fetchMentors();
  }, [debouncedSearch, expertise]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (debouncedSearch) queryParams.set("search", debouncedSearch);
      if (expertise !== "all") queryParams.set("expertise", expertise);

      const res = await fetch(`/api/client/mentors?${queryParams.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);
      setMentors(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load mentors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMentorClick = (mentorId: string) => {
    window.location.href = `/dashboard/consultation/${mentorId}`;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Available Mentors</h1>
        <p className="text-muted-foreground">
          Find and connect with experienced mentors in your field of interest
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search mentors by name or expertise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={expertise} onValueChange={setExpertise}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select expertise" />
          </SelectTrigger>
          <SelectContent>
            {expertise_options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingBars />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentors.map((mentor) => (
            <Card
              key={mentor.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleMentorClick(mentor.id)}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{mentor.fullName}</h3>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      {mentor.rating && (
                        <>
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{mentor.rating.toFixed(1)}</span>
                          {mentor.totalConsultations && (
                            <span className="text-sm">
                              ({mentor.totalConsultations} consultations)
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{mentor.jobRole} at {mentor.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span>{mentor.education}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map((exp) => (
                      <Badge key={exp.area} variant="default">
                        {exp.area}
                        {exp.level && <span className="ml-1">• Lv.{exp.level}</span>}
                      </Badge>
                    ))}
                  </div>

                  {mentor.nextAvailableSlot && (
                    <div className="text-sm text-green-600">
                      Next available: {new Date(mentor.nextAvailableSlot).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && mentors.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No mentors found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
}