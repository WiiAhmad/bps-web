'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { HousingBlok2Form, type HousingBlok2FormData } from './housing-blok2-form';
import { toast } from 'sonner';

interface HousingBlok2DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  idKeluarga: number;
  initialData?: Partial<HousingBlok2FormData> & { id?: number };
  onSuccess: () => void;
  onSubmitAction: (data: HousingBlok2FormData & { id?: number }) => Promise<{ success: boolean; error?: string; message?: string }>;
}

export function HousingBlok2Dialog({
  open,
  onOpenChange,
  mode,
  idKeluarga,
  initialData,
  onSuccess,
  onSubmitAction,
}: HousingBlok2DialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: HousingBlok2FormData) => {
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
            {mode === 'create' ? 'Add Agricultural & Livestock Data' : 'Edit Agricultural & Livestock Data'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Enter the agricultural and livestock information below.'
              : 'Update the agricultural and livestock information below.'}
          </DialogDescription>
        </DialogHeader>
        <HousingBlok2Form
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
