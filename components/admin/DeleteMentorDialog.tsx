import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface DeleteMentorDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteMentorDialog = React.memo(({ 
  isOpen, 
  isLoading, 
  onClose, 
  onConfirm 
}: DeleteMentorDialogProps) => (
  <AlertDialog open={isOpen}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Hapus Mentor</AlertDialogTitle>
        <AlertDialogDescription>
          Apakah Anda yakin ingin menghapus mentor ini? Tindakan ini tidak dapat dibatalkan.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onClose}>Batal</AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          disabled={isLoading}
        >
          {isLoading ? 'Menghapus...' : 'Hapus'}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
));

DeleteMentorDialog.displayName = 'DeleteMentorDialog';
