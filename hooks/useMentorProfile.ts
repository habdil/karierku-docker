// hooks/useMentorProfile.ts
import { useState } from "react";
import { useToast } from "./use-toast";

interface MentorProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  education: string;
  maritalStatus?: string;
  company: string;
  jobRole: string;
  motivation?: string;
  expertise: Array<{
    area: string;
    tags: string[];
  }>;
  stats: {
    totalConsultations: number;
    completedConsultations: number;
    activeConsultations: number;
  };
}

interface UpdateProfileData {
  fullName: string;
  phoneNumber: string;
  education: string;
  maritalStatus?: string;
  company: string;
  jobRole: string;
  motivation?: string;
}

export function useMentorProfile() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchProfile = async (): Promise<MentorProfile | null> => {
    try {
      setLoading(true);
      const response = await fetch("/api/mentor/profile");
      
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengambil data profile",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await fetch("/api/mentor/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      toast({
        title: "Success",
        description: "Profile berhasil diperbarui",
      });
      
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal memperbarui profile",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchProfile,
    updateProfile,
  };
}