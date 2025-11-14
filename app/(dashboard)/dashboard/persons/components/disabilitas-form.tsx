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
const createDisabilitasSchema = z.object({
  idKeluarga: z.number(),
  idAnggotaKeluarga: z.number().min(1, 'Family member is required'),
  disabilisitas: z.string().optional(),
  tunaDaksa: z.string().optional(),
  tunaWicara: z.string().optional(),
  tunaNetra: z.string().optional(),
  tunaLaras: z.string().optional(),
  tunaLainnyaStatus: z.string().optional(),
  tunaLainnyaNama: z.string().optional(),
});

export type DisabilitasFormData = z.infer<typeof createDisabilitasSchema>;

interface DisabilitasFormProps {
  initialData?: Partial<DisabilitasFormData> & { id?: number };
  idKeluarga: number;
  onSubmit: (data: DisabilitasFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function DisabilitasForm({
  initialData,
  idKeluarga,
  onSubmit,
  onCancel,
  isLoading = false,
}: DisabilitasFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DisabilitasFormData>({
    resolver: zodResolver(createDisabilitasSchema),
    defaultValues: {
      idKeluarga,
      idAnggotaKeluarga: initialData?.idAnggotaKeluarga || 0,
      disabilisitas: initialData?.disabilisitas || '',
      tunaDaksa: initialData?.tunaDaksa || '',
      tunaWicara: initialData?.tunaWicara || '',
      tunaNetra: initialData?.tunaNetra || '',
      tunaLaras: initialData?.tunaLaras || '',
      tunaLainnyaStatus: initialData?.tunaLainnyaStatus || '',
      tunaLainnyaNama: initialData?.tunaLainnyaNama || '',
    },
  });

  const idAnggotaKeluarga = watch('idAnggotaKeluarga');

  const handleFormSubmit = async (data: DisabilitasFormData) => {
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

      {/* Has Disability */}
      <div className="space-y-2">
        <Label htmlFor="disabilisitas">Has Disability</Label>
        <Input
          id="disabilisitas"
          {...register('disabilisitas')}
          placeholder="Enter yes or no"
          disabled={isLoading}
        />
      </div>

      {/* Disability Types Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Disability Types</h3>
        
        {/* Physical Disability */}
        <div className="space-y-2">
          <Label htmlFor="tunaDaksa">Physical Disability (Tuna Daksa)</Label>
          <Input
            id="tunaDaksa"
            {...register('tunaDaksa')}
            placeholder="Enter physical disability status"
            disabled={isLoading}
          />
        </div>

        {/* Speech Disability */}
        <div className="space-y-2">
          <Label htmlFor="tunaWicara">Speech Disability (Tuna Wicara)</Label>
          <Input
            id="tunaWicara"
            {...register('tunaWicara')}
            placeholder="Enter speech disability status"
            disabled={isLoading}
          />
        </div>

        {/* Visual Disability */}
        <div className="space-y-2">
          <Label htmlFor="tunaNetra">Visual Disability (Tuna Netra)</Label>
          <Input
            id="tunaNetra"
            {...register('tunaNetra')}
            placeholder="Enter visual disability status"
            disabled={isLoading}
          />
        </div>

        {/* Mental Disability */}
        <div className="space-y-2">
          <Label htmlFor="tunaLaras">Mental Disability (Tuna Laras)</Label>
          <Input
            id="tunaLaras"
            {...register('tunaLaras')}
            placeholder="Enter mental disability status"
            disabled={isLoading}
          />
        </div>

        {/* Other Disability Status */}
        <div className="space-y-2">
          <Label htmlFor="tunaLainnyaStatus">Other Disability Status</Label>
          <Input
            id="tunaLainnyaStatus"
            {...register('tunaLainnyaStatus')}
            placeholder="Enter other disability status"
            disabled={isLoading}
          />
        </div>

        {/* Other Disability Name */}
        <div className="space-y-2">
          <Label htmlFor="tunaLainnyaNama">Other Disability Name</Label>
          <Input
            id="tunaLainnyaNama"
            {...register('tunaLainnyaNama')}
            placeholder="Enter other disability name"
            disabled={isLoading}
          />
        </div>
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
          {initialData?.id ? 'Update Disability Information' : 'Create Disability Information'}
        </Button>
      </div>
    </form>
  );
}
