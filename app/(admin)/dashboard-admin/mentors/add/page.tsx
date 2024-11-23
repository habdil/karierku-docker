"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { MentorForm } from "@/components/admin/AddMentorForm";

interface AddMentorFormValues {
  email: string;
  username: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  education: string;
  maritalStatus: "SINGLE" | "MARRIED" | "DIVORCED";
  company: string;
  jobRole: string;
  motivation?: string;
}

export default function AddMentorPageContent() {
  const router = useRouter();
  const { toast } = useToast();

  const addMutation = useMutation({
    mutationFn: async (data: AddMentorFormValues) => {
      const response = await fetch("/api/admin/mentors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create mentor");
      }

      return result.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Mentor berhasil ditambahkan",
      });
      router.push("/dashboard-admin/mentors");
      router.refresh();
    },
    onError: (error: Error) => {
      const errorMessage = error.message.includes("already exists")
        ? error.message
        : "Gagal menambahkan mentor. Silakan coba lagi.";

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    },
  });

  const onSubmit = useCallback(async (data: AddMentorFormValues) => {
    await addMutation.mutateAsync(data);
  }, [addMutation]);

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Tambah Mentor Baru</h1>
        <p className="text-muted-foreground">
          Tambahkan mentor baru dengan mengisi form di bawah ini.
        </p>
      </div>
      
      <MentorForm
        type="add"
        onSubmit={onSubmit}
        isLoading={addMutation.isPending}
      />
    </div>
  );
}