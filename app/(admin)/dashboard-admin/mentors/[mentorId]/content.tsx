"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Trash2, Loader2 } from "lucide-react"; // Tambahkan Loader2
import { mentorService } from "@/lib/services/mentorService";
import { MentorFormValues, Mentor } from "@/lib/types/mentor";
import { DeleteMentorDialog } from "@/components/admin/DeleteMentorDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { MentorForm } from "@/components/admin/AddMentorForm";
import { LoadingBars } from "@/components/ui/loading-bars";

export default function EditMentorContent({ 
  params 
}: { 
  params: { mentorId: string } 
}) {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // State terpisah untuk loading delete

  // Queries
  const { data: mentor, isError, error, isLoading: isLoadingMentor } = useQuery<Mentor, Error>({
    queryKey: ['mentor', params.mentorId],
    queryFn: () => mentorService.getMentor(params.mentorId),
  });

  // Mutations
  const updateMutation = useMutation<Mentor, Error, MentorFormValues>({
    mutationFn: (data: MentorFormValues) => 
      mentorService.updateMentor(params.mentorId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor', params.mentorId] });
      toast({
        title: "Success",
        description: "Mentor data has been updated successfully",
      });
      router.refresh();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update mentor data",
      });
    },
  });

  const deleteMutation = useMutation<void, Error, void>({
    mutationFn: () => mentorService.deleteMentor(params.mentorId),
    onSuccess: () => {
      setIsDeleting(false); // Reset state setelah selesai
      toast({
        title: "Success",
        description: "Mentor has been deleted successfully",
      });
      router.push("/dashboard-admin/mentors");
    },
    onError: () => {
      setIsDeleting(false); // Reset state jika error
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete mentor",
      });
    },
  });

  const onSubmit = useCallback(async (data: MentorFormValues) => {
    await updateMutation.mutateAsync(data);
  }, [updateMutation]);

  const handleDelete = useCallback(() => {
    setIsDeleting(true); // Set loading state saat mulai delete
    deleteMutation.mutate();
    setIsDeleteDialogOpen(false);
  }, [deleteMutation]);

  if (isError) {
    return (
      <div className="container space-y-4 py-10">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="group flex items-center gap-2 hover:bg-transparent hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Mentors
        </Button>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error?.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoadingMentor) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <LoadingBars text="Loading mentor data..." />
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="container space-y-4 py-10">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="group flex items-center gap-2 hover:bg-transparent hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Mentors
        </Button>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Mentor not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container space-y-6 py-10">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="group flex items-center gap-2 hover:bg-transparent hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Mentors
      </Button>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Edit Mentor</h1>
          <p className="text-muted-foreground">
            Update mentor information and account status
          </p>
        </div>

        <Button 
          variant="destructive" 
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={isDeleting}
          className="flex items-center gap-2"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          {isDeleting ? 'Deleting...' : 'Delete Mentor'}
        </Button>
      </div>

      <DeleteMentorDialog
        isOpen={isDeleteDialogOpen}
        isLoading={isDeleting}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />

      <div className="mt-8">
        <MentorForm
          type="edit"
          initialData={{
            fullName: mentor.fullName,
            phoneNumber: mentor.phoneNumber,
            education: mentor.education,
            maritalStatus: mentor.maritalStatus,
            company: mentor.company,
            jobRole: mentor.jobRole,
            motivation: mentor.motivation || "",
            status: mentor.status,
          }}
          onSubmit={onSubmit}
          isLoading={updateMutation.isPending}
        />
      </div>
    </div>
  );
}