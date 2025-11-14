'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AnggotaSelect } from './form-fields/anggota-select';
import { Loader2 } from 'lucide-react';

// Validation schema
const createKetenagakerjaanSchema = z.object({
  idAnggotaKeluarga: z.number().min(1, 'Family member is required'),
  bekerja: z.string().optional(),
  lapanganUsaha: z.string().optional(),
  statusPekerjaan: z.string().optional(),
  kegiatanUtama: z.string().optional(),
  lengkap: z.string().optional(),
});

export type KetenagakerjaanFormData = z.infer<typeof createKetenagakerjaanSchema>;

interface KetenagakerjaanFormProps {
  initialData?: Partial<KetenagakerjaanFormData> & { id?: number };
  idKeluarga: number;
  onSubmit: (data: KetenagakerjaanFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function KetenagakerjaanForm({
  initialData,
  idKeluarga,
  onSubmit,
  onCancel,
  isLoading = false,
}: KetenagakerjaanFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<KetenagakerjaanFormData>({
    resolver: zodResolver(createKetenagakerjaanSchema),
    defaultValues: {
      idAnggotaKeluarga: initialData?.idAnggotaKeluarga || 0,
      bekerja: initialData?.bekerja || '',
      lapanganUsaha: initialData?.lapanganUsaha || '',
      statusPekerjaan: initialData?.statusPekerjaan || '',
      kegiatanUtama: initialData?.kegiatanUtama || '',
      lengkap: initialData?.lengkap || '',
    },
  });

  const idAnggotaKeluarga = watch('idAnggotaKeluarga');

  const handleFormSubmit = async (data: KetenagakerjaanFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Family Member Selection */}
      <div className="space-y-2">
        <Label htmlFor="idAnggotaKeluarga">
          Family Member <span className="text-red-500">*</span>
        </Label>
        <AnggotaSelect
          value={idAnggotaKeluarga}
          onChange={(value) => setValue('idAnggotaKeluarga', value, { shouldValidate: true })}
          idKeluarga={idKeluarga}
          error={errors.idAnggotaKeluarga?.message}
        />
      </div>

      {/* Working Status */}
      <div className="space-y-2">
        <Label htmlFor="bekerja">Working Status</Label>
        <Input
          id="bekerja"
          {...register('bekerja')}
          placeholder="Enter working status"
          disabled={isLoading}
        />
      </div>

      {/* Business Field */}
      <div className="space-y-2">
        <Label htmlFor="lapanganUsaha">Business Field</Label>
        <Input
          id="lapanganUsaha"
          {...register('lapanganUsaha')}
          placeholder="Enter business field"
          disabled={isLoading}
        />
      </div>

      {/* Employment Status */}
      <div className="space-y-2">
        <Label htmlFor="statusPekerjaan">Employment Status</Label>
        <Input
          id="statusPekerjaan"
          {...register('statusPekerjaan')}
          placeholder="Enter employment status"
          disabled={isLoading}
        />
      </div>

      {/* Main Activity */}
      <div className="space-y-2">
        <Label htmlFor="kegiatanUtama">Main Activity</Label>
        <Input
          id="kegiatanUtama"
          {...register('kegiatanUtama')}
          placeholder="Enter main activity"
          disabled={isLoading}
        />
      </div>

      {/* Complete Status */}
      <div className="space-y-2">
        <Label htmlFor="lengkap">Complete Status</Label>
        <Input
          id="lengkap"
          {...register('lengkap')}
          placeholder="Enter complete status"
          disabled={isLoading}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData?.id ? 'Update Employment Data' : 'Create Employment Data'}
        </Button>
      </div>
    </form>
  );
}
