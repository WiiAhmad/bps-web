'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DisabilitasForm, type DisabilitasFormData } from './disabilitas-form';
import { toast } from 'sonner';

interface DisabilitasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  idKeluarga: number;
  initialData?: Partial<DisabilitasFormData> & { id?: number };
  onSuccess: () => void;
  onSubmitAction: (data: DisabilitasFormData & { id?: number }) => Promise<{ success: boolean; error?: string; message?: string }>;
}

export function DisabilitasDialog({
  open,
  onOpenChange,
  mode,
  idKeluarga,
  initialData,
  onSuccess,
  onSubmitAction,
}: DisabilitasDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: DisabilitasFormData) => {
    setIsLoading(true);
    try {
      const result = await onSubmitAction(
        mode === 'edit' && initialData?.id
          ? { id: initialData.id, ...data }
          : data
      );

      if (result.success) {
        toast.success(result.message || 'Operation completed successfully');
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(result.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add Disability Information' : 'Edit Disability Information'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Enter the disability information below.'
              : 'Update the disability information below.'}
          </DialogDescription>
        </DialogHeader>
        <DisabilitasForm
          initialData={initialData}
          idKeluarga={idKeluarga}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
