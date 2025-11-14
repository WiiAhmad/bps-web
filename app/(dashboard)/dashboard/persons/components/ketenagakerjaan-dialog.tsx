'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { KetenagakerjaanForm, type KetenagakerjaanFormData } from './ketenagakerjaan-form';
import { toast } from 'sonner';

interface KetenagakerjaanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  idKeluarga: number;
  initialData?: Partial<KetenagakerjaanFormData> & { id?: number };
  onSuccess: () => void;
  onSubmitAction: (data: KetenagakerjaanFormData & { id?: number }) => Promise<{ success: boolean; error?: string; message?: string }>;
}

export function KetenagakerjaanDialog({
  open,
  onOpenChange,
  mode,
  idKeluarga,
  initialData,
  onSuccess,
  onSubmitAction,
}: KetenagakerjaanDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: KetenagakerjaanFormData) => {
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
            {mode === 'create' ? 'Add Employment Data' : 'Edit Employment Data'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Enter the employment information below.'
              : 'Update the employment information below.'}
          </DialogDescription>
        </DialogHeader>
        <KetenagakerjaanForm
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
