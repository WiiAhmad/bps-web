'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { KeluargaForm, type KeluargaFormData } from './keluarga-form';
import { createKeluargaAction, updateKeluargaAction } from '../actions';
import { toast } from 'sonner';

interface KeluargaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  initialData?: Partial<KeluargaFormData> & { id?: number };
  onSuccess: () => void;
}

export function KeluargaDialog({
  open,
  onOpenChange,
  mode,
  initialData,
  onSuccess,
}: KeluargaDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: KeluargaFormData) => {
    setIsLoading(true);
    try {
      let result;
      const formData = new FormData();
      
      if (mode === 'edit' && initialData?.id) {
        // Update existing keluarga
        formData.append('id', initialData.id.toString());
        formData.append('namaKepalaKeluarga', data.namaKepalaKeluarga);
        formData.append('anggotaKeluarga', data.anggotaKeluarga.toString());
        formData.append('nomorKartuKeluarga', data.nomorKartuKeluarga);
        formData.append('alamat', data.alamat);
        formData.append('idMFD', data.idMFD.toString());
        formData.append('catatan', data.catatan || '');
        
        result = await updateKeluargaAction(formData);
      } else {
        // Create new keluarga
        formData.append('namaKepalaKeluarga', data.namaKepalaKeluarga);
        formData.append('anggotaKeluarga', data.anggotaKeluarga.toString());
        formData.append('nomorKartuKeluarga', data.nomorKartuKeluarga);
        formData.append('alamat', data.alamat);
        formData.append('idMFD', data.idMFD.toString());
        formData.append('catatan', data.catatan || '');
        
        result = await createKeluargaAction(formData);
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
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        aria-describedby="keluarga-dialog-description"
      >
        <DialogHeader>
          <DialogTitle id="keluarga-dialog-title">
            {mode === 'create' ? 'Add New Family' : 'Edit Family'}
          </DialogTitle>
          <DialogDescription id="keluarga-dialog-description">
            {mode === 'create'
              ? 'Enter the family information below to create a new family record.'
              : 'Update the family information below.'}
          </DialogDescription>
        </DialogHeader>
        <KeluargaForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
