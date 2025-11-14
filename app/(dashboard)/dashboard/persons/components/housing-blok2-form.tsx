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
const createHousingBlok2Schema = z.object({
  idKeluarga: z.number(),
  luasPertanianSawah: z.number().optional(),
  luasPertanianKebun: z.number().optional(),
  luasPertanianKolam: z.number().optional(),
  ayam: z.number().optional(),
  kambing: z.number().optional(),
  sapi: z.number().optional(),
});

export type HousingBlok2FormData = z.infer<typeof createHousingBlok2Schema>;

interface HousingBlok2FormProps {
  initialData?: Partial<HousingBlok2FormData> & { id?: number };
  idKeluarga: number;
  onSubmit: (data: HousingBlok2FormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function HousingBlok2Form({
  initialData,
  idKeluarga,
  onSubmit,
  onCancel,
  isLoading = false,
}: HousingBlok2FormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HousingBlok2FormData>({
    resolver: zodResolver(createHousingBlok2Schema),
    defaultValues: {
      idKeluarga,
      luasPertanianSawah: initialData?.luasPertanianSawah || undefined,
      luasPertanianKebun: initialData?.luasPertanianKebun || undefined,
      luasPertanianKolam: initialData?.luasPertanianKolam || undefined,
      ayam: initialData?.ayam || undefined,
      kambing: initialData?.kambing || undefined,
      sapi: initialData?.sapi || undefined,
    },
  });

  const handleFormSubmit = async (data: HousingBlok2FormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Agricultural Land Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Agricultural Land</h3>
        
        {/* Rice Field Area */}
        <div className="space-y-2">
          <Label htmlFor="luasPertanianSawah">Rice Field Area (m²)</Label>
          <Input
            id="luasPertanianSawah"
            type="number"
            step="0.01"
            {...register('luasPertanianSawah', { valueAsNumber: true })}
            placeholder="Enter rice field area"
            disabled={isLoading}
          />
        </div>

        {/* Garden Area */}
        <div className="space-y-2">
          <Label htmlFor="luasPertanianKebun">Garden Area (m²)</Label>
          <Input
            id="luasPertanianKebun"
            type="number"
            step="0.01"
            {...register('luasPertanianKebun', { valueAsNumber: true })}
            placeholder="Enter garden area"
            disabled={isLoading}
          />
        </div>

        {/* Pond Area */}
        <div className="space-y-2">
          <Label htmlFor="luasPertanianKolam">Pond Area (m²)</Label>
          <Input
            id="luasPertanianKolam"
            type="number"
            step="0.01"
            {...register('luasPertanianKolam', { valueAsNumber: true })}
            placeholder="Enter pond area"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Livestock Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Livestock</h3>
        
        {/* Chickens Count */}
        <div className="space-y-2">
          <Label htmlFor="ayam">Chickens Count</Label>
          <Input
            id="ayam"
            type="number"
            min="0"
            {...register('ayam', { valueAsNumber: true })}
            placeholder="Enter number of chickens"
            disabled={isLoading}
          />
        </div>

        {/* Goats Count */}
        <div className="space-y-2">
          <Label htmlFor="kambing">Goats Count</Label>
          <Input
            id="kambing"
            type="number"
            min="0"
            {...register('kambing', { valueAsNumber: true })}
            placeholder="Enter number of goats"
            disabled={isLoading}
          />
        </div>

        {/* Cattle Count */}
        <div className="space-y-2">
          <Label htmlFor="sapi">Cattle Count</Label>
          <Input
            id="sapi"
            type="number"
            min="0"
            {...register('sapi', { valueAsNumber: true })}
            placeholder="Enter number of cattle"
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
          {initialData?.id ? 'Update Agricultural Data' : 'Create Agricultural Data'}
        </Button>
      </div>
    </form>
  );
}
