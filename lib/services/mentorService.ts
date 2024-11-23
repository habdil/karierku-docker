import { MentorFormValues } from "../types/mentor";

export const mentorService = {
    getMentor: async (id: string) => {
      const response = await fetch(`/api/admin/mentors/${id}`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.data;
    },
  
    updateMentor: async (id: string, data: MentorFormValues) => {
      const response = await fetch(`/api/admin/mentors/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  
    deleteMentor: async (id: string) => {
      const response = await fetch(`/api/admin/mentors/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  };