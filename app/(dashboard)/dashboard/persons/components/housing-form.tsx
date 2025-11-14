'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

// Validation schema
const createHousingSchema = z.object({
  idKeluarga: z.number(),
  luasLantai: z.number().optional(),
  statusBangunan: z.string().optional(),
  buktiKepemilikan: z.string().optional(),
  sumberAirMinum: z.string().optional(),
  fasilitasBAB: z.string().optional(),
  peneranganUtama: z.string().optional(),
  daya: z.string().optional(),
});

export type HousingFormData = z.infer<typeof createHousingSchema>;

interface HousingFormProps {
  initialData?: Partial<HousingFormData> & { id?: number };
  idKeluarga: number;
  onSubmit: (data: HousingFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function HousingForm({
  initialData,
  idKeluarga,
  onSubmit,
  onCancel,
  isLoading = false,
}: HousingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HousingFormData>({
    resolver: zodResolver(createHousingSchema),
    defaultValues: {
      idKeluarga,
      luasLantai: initialData?.luasLantai || undefined,
      statusBangunan: initialData?.statusBangunan || '',
      buktiKepemilikan: initialData?.buktiKepemilikan || '',
      sumberAirMinum: initialData?.sumberAirMinum || '',
      fasilitasBAB: initialData?.fasilitasBAB || '',
      peneranganUtama: initialData?.peneranganUtama || '',
      daya: initialData?.daya || '',
    },
  });

  const handleFormSubmit = async (data: HousingFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Floor Area */}
      <div className="space-y-2">
        <Label htmlFor="luasLantai">Floor Area (m²)</Label>
        <Input
          id="luasLantai"
          type="number"
          step="0.01"
          {...register('luasLantai', { valueAsNumber: true })}
          placeholder="Enter floor area"
          disabled={isLoading}
        />
      </div>

      {/* Building Status */}
      <div className="space-y-2">
        <Label htmlFor="statusBangunan">Building Status</Label>
        <Input
          id="statusBangunan"
          {...register('statusBangunan')}
          placeholder="Enter building status"
          disabled={isLoading}
        />
      </div>

      {/* Ownership Proof */}
      <div className="space-y-2">
        <Label htmlFor="buktiKepemilikan">Ownership Proof</Label>
        <Input
          id="buktiKepemilikan"
          {...register('buktiKepemilikan')}
          placeholder="Enter ownership proof"
          disabled={isLoading}
        />
      </div>

      {/* Water Source */}
      <div className="space-y-2">
        <Label htmlFor="sumberAirMinum">Water Source</Label>
        <Input
          id="sumberAirMinum"
          {...register('sumberAirMinum')}
          placeholder="Enter water source"
          disabled={isLoading}
        />
      </div>

      {/* Toilet Facility */}
      <div className="space-y-2">
        <Label htmlFor="fasilitasBAB">Toilet Facility</Label>
        <Input
          id="fasilitasBAB"
          {...register('fasilitasBAB')}
          placeholder="Enter toilet facility"
          disabled={isLoading}
        />
      </div>

      {/* Main Lighting */}
      <div className="space-y-2">
        <Label htmlFor="peneranganUtama">Main Lighting</Label>
        <Input
          id="peneranganUtama"
          {...register('peneranganUtama')}
          placeholder="Enter main lighting"
          disabled={isLoading}
        />
      </div>

      {/* Electricity Power */}
      <div className="space-y-2">
        <Label htmlFor="daya">Electricity Power</Label>
        <Input
          id="daya"
          {...register('daya')}
          placeholder="Enter electricity power"
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
          {initialData?.id ? 'Update Housing Data' : 'Create Housing Data'}
        </Button>
      </div>
    </form>
  );
}
