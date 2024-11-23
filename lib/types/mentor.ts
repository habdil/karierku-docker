import { z } from "zod";

export const mentorFormSchema = z.object({
  fullName: z.string().min(1, "Nama lengkap harus diisi"),
  phoneNumber: z.string().min(10, "Nomor telepon minimal 10 digit"),
  education: z.string().min(1, "Pendidikan harus diisi"),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED"]).optional(),
  company: z.string().min(1, "Nama perusahaan harus diisi"),
  jobRole: z.string().min(1, "Jabatan harus diisi"),
  motivation: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type MentorFormValues = z.infer<typeof mentorFormSchema>;

export interface Mentor extends MentorFormValues {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}