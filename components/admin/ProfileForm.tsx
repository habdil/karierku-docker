// components/mentor/profile/ProfileForm.tsx
"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useMentorProfile } from "@/hooks/useMentorProfile";

// Form Schema
const profileFormSchema = z.object({
  fullName: z
    .string()
    .min(1, "Nama lengkap harus diisi")
    .max(100, "Nama terlalu panjang"),
  phoneNumber: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(15, "Nomor telepon maksimal 15 digit"),
  education: z
    .string()
    .min(1, "Pendidikan harus diisi")
    .max(200, "Pendidikan terlalu panjang"),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED"]).optional(),
  company: z
    .string()
    .min(1, "Nama perusahaan harus diisi")
    .max(100, "Nama perusahaan terlalu panjang"),
  jobRole: z
    .string()
    .min(1, "Jabatan harus diisi")
    .max(100, "Jabatan terlalu panjang"),
  motivation: z
    .string()
    .max(500, "Motivasi terlalu panjang")
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const { loading, fetchProfile, updateProfile } = useMentorProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const loadProfile = async () => {
      const profile = await fetchProfile();
      if (profile) {
        form.reset({
          fullName: profile.fullName,
          phoneNumber: profile.phoneNumber,
          education: profile.education,
          maritalStatus: profile.maritalStatus as any,
          company: profile.company,
          jobRole: profile.jobRole,
          motivation: profile.motivation || "",
        });
      }
    };

    loadProfile();
  }, [form.reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    await updateProfile(data);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>
          Perbarui informasi profile Anda sebagai mentor
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama lengkap Anda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon</FormLabel>
                    <FormControl>
                      <Input placeholder="Nomor telepon Anda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pendidikan</FormLabel>
                  <FormControl>
                    <Input placeholder="Riwayat pendidikan terakhir" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maritalStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Pernikahan</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status pernikahan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SINGLE">Single</SelectItem>
                      <SelectItem value="MARRIED">Menikah</SelectItem>
                      <SelectItem value="DIVORCED">Bercerai</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perusahaan</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama perusahaan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jabatan</FormLabel>
                    <FormControl>
                      <Input placeholder="Jabatan/posisi Anda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="motivation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivasi</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Bagikan motivasi Anda untuk membantu mentee" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={loading}
            >
              Reset
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Simpan Perubahan
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}