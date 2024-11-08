// app/(admin)/dashboard-admin/mentors/[mentorId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Save, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const mentorFormSchema = z.object({
  fullName: z.string().min(1, "Nama lengkap harus diisi"),
  phoneNumber: z.string().min(10, "Nomor telepon minimal 10 digit"),
  education: z.string().min(1, "Pendidikan harus diisi"),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED"]).optional(),
  company: z.string().min(1, "Nama perusahaan harus diisi"),
  jobRole: z.string().min(1, "Jabatan harus diisi"),
  motivation: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type MentorFormValues = z.infer<typeof mentorFormSchema>;

export default function EditMentorPage({ params }: { params: { mentorId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [mentor, setMentor] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<MentorFormValues>({
    resolver: zodResolver(mentorFormSchema),
    defaultValues: {
      status: "ACTIVE",
    },
  });

  // Fetch mentor data
  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await fetch(`/api/admin/mentors/${params.mentorId}`);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error);
        }

        setMentor(result.data);
        form.reset({
          fullName: result.data.fullName,
          phoneNumber: result.data.phoneNumber,
          education: result.data.education,
          maritalStatus: result.data.maritalStatus,
          company: result.data.company,
          jobRole: result.data.jobRole,
          motivation: result.data.motivation || "",
          status: result.data.status,
        });
      } catch (error) {
        setError("Gagal mengambil data mentor");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal mengambil data mentor",
        });
      }
    };

    fetchMentor();
  }, [params.mentorId, form]);

  const onSubmit = async (data: MentorFormValues) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/mentors/${params.mentorId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: "Success",
        description: "Data mentor berhasil diperbarui",
      });

      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memperbarui data mentor",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const response = await fetch(`/api/admin/mentors/${params.mentorId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: "Success",
        description: "Mentor berhasil dihapus",
      });

      router.push("/dashboard-admin/mentors");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menghapus mentor",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  if (error) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Mentor</h1>
            <p className="text-muted-foreground">
              Edit informasi mentor dan status akun
            </p>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={deleteLoading}>
              {deleteLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Hapus Mentor
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Mentor</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus mentor ini? Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Mentor</CardTitle>
          <CardDescription>
            Edit informasi profil mentor
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Account Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Status Akun</FormLabel>
                      <FormDescription>
                        Aktifkan atau nonaktifkan akun mentor
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value === "ACTIVE"}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? "ACTIVE" : "INACTIVE")
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Education & Marital Status */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pendidikan</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                            <SelectValue placeholder="Pilih status" />
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
              </div>

              {/* Work Info */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Perusahaan</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Motivation */}
              <FormField
                control={form.control}
                name="motivation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivasi</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter>
              <Button type="submit" disabled={loading} className="ml-auto">
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Save className="w-4 h-4 mr-2" />
                Simpan Perubahan
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}