'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MFDSelect } from './form-fields/mfd-select';
import { Loader2 } from 'lucide-react';

// Validation schema
const createKeluargaSchema = z.object({
  namaKepalaKeluarga: z.string().min(2, 'Family head name must be at least 2 characters'),
  anggotaKeluarga: z.number().min(1, 'Number of family members must be at least 1'),
  nomorKartuKeluarga: z.string().length(16, 'Family card number must be 16 digits').regex(/^\d+$/, 'Must contain only numbers'),
  alamat: z.string().min(10, 'Address must be at least 10 characters'),
  idMFD: z.number().min(1, 'MFD location is required'),
  catatan: z.string().optional(),
});

export type KeluargaFormData = z.infer<typeof createKeluargaSchema>;

interface KeluargaFormProps {
  initialData?: Partial<KeluargaFormData> & { id?: number };
  onSubmit: (data: KeluargaFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function KeluargaForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: KeluargaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<KeluargaFormData>({
    resolver: zodResolver(createKeluargaSchema),
    defaultValues: {
      namaKepalaKeluarga: initialData?.namaKepalaKeluarga || '',
      anggotaKeluarga: initialData?.anggotaKeluarga || 1,
      nomorKartuKeluarga: initialData?.nomorKartuKeluarga || '',
      alamat: initialData?.alamat || '',
      idMFD: initialData?.idMFD || 0,
      catatan: initialData?.catatan || '',
    },
  });

  const idMFD = watch('idMFD');

  const handleFormSubmit = async (data: KeluargaFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Family Head Name */}
      <div className="space-y-2">
        <Label htmlFor="namaKepalaKeluarga">
          Family Head Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="namaKepalaKeluarga"
          {...register('namaKepalaKeluarga')}
          placeholder="Enter family head name"
          disabled={isLoading}
          className={errors.namaKepalaKeluarga ? 'border-red-500' : ''}
        />
        {errors.namaKepalaKeluarga && (
          <p className="text-sm text-red-500">{errors.namaKepalaKeluarga.message}</p>
        )}
      </div>

      {/* Number of Family Members */}
      <div className="space-y-2">
        <Label htmlFor="anggotaKeluarga">
          Number of Family Members <span className="text-red-500">*</span>
        </Label>
        <Input
          id="anggotaKeluarga"
          type="number"
          min="1"
          {...register('anggotaKeluarga', { valueAsNumber: true })}
          placeholder="Enter number of family members"
          disabled={isLoading}
          className={errors.anggotaKeluarga ? 'border-red-500' : ''}
        />
        {errors.anggotaKeluarga && (
          <p className="text-sm text-red-500">{errors.anggotaKeluarga.message}</p>
        )}
      </div>

      {/* Family Card Number */}
      <div className="space-y-2">
        <Label htmlFor="nomorKartuKeluarga">
          Family Card Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="nomorKartuKeluarga"
          {...register('nomorKartuKeluarga')}
          placeholder="Enter 16-digit family card number"
          maxLength={16}
          disabled={isLoading}
          className={errors.nomorKartuKeluarga ? 'border-red-500' : ''}
        />
        {errors.nomorKartuKeluarga && (
          <p className="text-sm text-red-500">{errors.nomorKartuKeluarga.message}</p>
        )}
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="alamat">
          Address <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="alamat"
          {...register('alamat')}
          placeholder="Enter complete address"
          rows={3}
          disabled={isLoading}
          className={errors.alamat ? 'border-red-500' : ''}
        />
        {errors.alamat && (
          <p className="text-sm text-red-500">{errors.alamat.message}</p>
        )}
      </div>

      {/* MFD Location */}
      <div className="space-y-2">
        <Label htmlFor="idMFD">
          MFD Location <span className="text-red-500">*</span>
        </Label>
        <MFDSelect
          value={idMFD}
          onChange={(value) => setValue('idMFD', value, { shouldValidate: true })}
          error={errors.idMFD?.message}
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="catatan">Notes</Label>
        <Textarea
          id="catatan"
          {...register('catatan')}
          placeholder="Enter additional notes (optional)"
          rows={2}
          disabled={isLoading}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="min-h-[44px]"
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={isLoading}
          className="min-h-[44px]"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
          {initialData?.id ? 'Update Family' : 'Create Family'}
        </Button>
      </div>
    </form>
  );
}
