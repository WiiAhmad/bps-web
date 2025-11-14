'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AnggotaKeluargaForm, type AnggotaKeluargaFormData } from './anggota-keluarga-form';
import { createAnggotaKeluargaAction, updateAnggotaKeluargaAction } from '../[id]/actions';
import { toast } from 'sonner';

interface AnggotaKeluargaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  idKeluarga: number;
  initialData?: Partial<AnggotaKeluargaFormData> & { id?: number };
  onSuccess: () => void;
}

export function AnggotaKeluargaDialog({
  open,
  onOpenChange,
  mode,
  idKeluarga,
  initialData,
  onSuccess,
}: AnggotaKeluargaDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: AnggotaKeluargaFormData) => {
    setIsLoading(true);
    try {
      let result;
      const formData = new FormData();
      
      // Append all form fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      
      if (mode === 'edit' && initialData?.id) {
        // Update existing anggota keluarga
        formData.append('id', initialData.id.toString());
        result = await updateAnggotaKeluargaAction(formData);
      } else {
        // Create new anggota keluarga
        result = await createAnggotaKeluargaAction(formData);
      }

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
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        aria-describedby="anggota-dialog-description"
      >
        <DialogHeader>
          <DialogTitle id="anggota-dialog-title">
            {mode === 'create' ? 'Add New Family Member' : 'Edit Family Member'}
          </DialogTitle>
          <DialogDescription id="anggota-dialog-description">
            {mode === 'create'
              ? 'Enter the family member information below to create a new record.'
              : 'Update the family member information below.'}
          </DialogDescription>
        </DialogHeader>
        <AnggotaKeluargaForm
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
