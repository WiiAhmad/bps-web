'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserSelect } from './form-fields/user-select';
import { DatePickerField } from './form-fields/date-picker-field';
import { Loader2 } from 'lucide-react';

// Validation schema
const createKetPetugasSchema = z.object({
  tanggalPendataan: z.string().min(1, 'Data collection date is required'),
  namaPendata: z.string().min(2, 'Collector name must be at least 2 characters'),
  kodePendata: z.number().min(1, 'Data collector is required'),
  tanggalPemeriksaan: z.string().min(1, 'Inspection date is required'),
  namaPemeriksa: z.string().min(2, 'Inspector name must be at least 2 characters'),
  kodePemeriksa: z.number().min(1, 'Inspector is required'),
  hasilPendataan: z.string().min(1, 'Survey result is required'),
  idKeluarga: z.number(),
});

export type KetPetugasFormData = z.infer<typeof createKetPetugasSchema>;

interface KetPetugasFormProps {
  initialData?: Partial<KetPetugasFormData> & { id?: number };
  idKeluarga: number;
  onSubmit: (data: KetPetugasFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function KetPetugasForm({
  initialData,
  idKeluarga,
  onSubmit,
  onCancel,
  isLoading = false,
}: KetPetugasFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<KetPetugasFormData>({
    resolver: zodResolver(createKetPetugasSchema),
    defaultValues: {
      tanggalPendataan: initialData?.tanggalPendataan || '',
      namaPendata: initialData?.namaPendata || '',
      kodePendata: initialData?.kodePendata || 0,
      tanggalPemeriksaan: initialData?.tanggalPemeriksaan || '',
      namaPemeriksa: initialData?.namaPemeriksa || '',
      kodePemeriksa: initialData?.kodePemeriksa || 0,
      hasilPendataan: initialData?.hasilPendataan || '',
      idKeluarga,
    },
  });

  const kodePendata = watch('kodePendata');
  const kodePemeriksa = watch('kodePemeriksa');

  const handleFormSubmit = async (data: KetPetugasFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Data Collection Date */}
      <div className="space-y-2">
        <Label htmlFor="tanggalPendataan">
          Data Collection Date <span className="text-red-500">*</span>
        </Label>
        <DatePickerField
          value={watch('tanggalPendataan')}
          onChange={(value) => setValue('tanggalPendataan', value, { shouldValidate: true })}
          error={errors.tanggalPendataan?.message}
        />
      </div>

      {/* Data Collector Name */}
      <div className="space-y-2">
        <Label htmlFor="namaPendata">
          Data Collector Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="namaPendata"
          {...register('namaPendata')}
          placeholder="Enter data collector name"
          disabled={isLoading}
          className={errors.namaPendata ? 'border-red-500' : ''}
        />
        {errors.namaPendata && (
          <p className="text-sm text-red-500">{errors.namaPendata.message}</p>
        )}
      </div>

      {/* Data Collector (User) */}
      <div className="space-y-2">
        <Label htmlFor="kodePendata">
          Data Collector <span className="text-red-500">*</span>
        </Label>
        <UserSelect
          value={kodePendata}
          onChange={(value) => setValue('kodePendata', value, { shouldValidate: true })}
          error={errors.kodePendata?.message}
        />
      </div>

      {/* Inspection Date */}
      <div className="space-y-2">
        <Label htmlFor="tanggalPemeriksaan">
          Inspection Date <span className="text-red-500">*</span>
        </Label>
        <DatePickerField
          value={watch('tanggalPemeriksaan')}
          onChange={(value) => setValue('tanggalPemeriksaan', value, { shouldValidate: true })}
          error={errors.tanggalPemeriksaan?.message}
        />
      </div>

      {/* Inspector Name */}
      <div className="space-y-2">
        <Label htmlFor="namaPemeriksa">
          Inspector Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="namaPemeriksa"
          {...register('namaPemeriksa')}
          placeholder="Enter inspector name"
          disabled={isLoading}
          className={errors.namaPemeriksa ? 'border-red-500' : ''}
        />
        {errors.namaPemeriksa && (
          <p className="text-sm text-red-500">{errors.namaPemeriksa.message}</p>
        )}
      </div>

      {/* Inspector (User) */}
      <div className="space-y-2">
        <Label htmlFor="kodePemeriksa">
          Inspector <span className="text-red-500">*</span>
        </Label>
        <UserSelect
          value={kodePemeriksa}
          onChange={(value) => setValue('kodePemeriksa', value, { shouldValidate: true })}
          error={errors.kodePemeriksa?.message}
        />
      </div>

      {/* Survey Result */}
      <div className="space-y-2">
        <Label htmlFor="hasilPendataan">
          Survey Result <span className="text-red-500">*</span>
        </Label>
        <Input
          id="hasilPendataan"
          {...register('hasilPendataan')}
          placeholder="Enter survey result"
          disabled={isLoading}
          className={errors.hasilPendataan ? 'border-red-500' : ''}
        />
        {errors.hasilPendataan && (
          <p className="text-sm text-red-500">{errors.hasilPendataan.message}</p>
        )}
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
          {initialData?.id ? 'Update Survey Officer Info' : 'Create Survey Officer Info'}
        </Button>
      </div>
    </form>
  );
}
