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
const createBantuanSchema = z.object({
  idKeluarga: z.number(),
  idAnggotaKeluarga: z.number().min(1, 'Recipient family member is required'),
  bantuan1tahunTerakhir: z.number().optional(),
  bantuanPKH: z.number().optional(),
  bantuanBPNT: z.number().optional(),
  bantuanBOS: z.number().optional(),
  bantuanBAPANAS: z.number().optional(),
  bantuanStunting: z.number().optional(),
  bantuanKIS: z.number().optional(),
  bantuanBLT: z.number().optional(),
  bantuanlainnyaStatus: z.number().optional(),
  bantuanlainnyaNama: z.number().optional(),
});

export type BantuanFormData = z.infer<typeof createBantuanSchema>;

interface BantuanFormProps {
  initialData?: Partial<BantuanFormData> & { id?: number };
  idKeluarga: number;
  onSubmit: (data: BantuanFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function BantuanForm({
  initialData,
  idKeluarga,
  onSubmit,
  onCancel,
  isLoading = false,
}: BantuanFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BantuanFormData>({
    resolver: zodResolver(createBantuanSchema),
    defaultValues: {
      idKeluarga,
      idAnggotaKeluarga: initialData?.idAnggotaKeluarga || 0,
      bantuan1tahunTerakhir: initialData?.bantuan1tahunTerakhir || undefined,
      bantuanPKH: initialData?.bantuanPKH || undefined,
      bantuanBPNT: initialData?.bantuanBPNT || undefined,
      bantuanBOS: initialData?.bantuanBOS || undefined,
      bantuanBAPANAS: initialData?.bantuanBAPANAS || undefined,
      bantuanStunting: initialData?.bantuanStunting || undefined,
      bantuanKIS: initialData?.bantuanKIS || undefined,
      bantuanBLT: initialData?.bantuanBLT || undefined,
      bantuanlainnyaStatus: initialData?.bantuanlainnyaStatus || undefined,
      bantuanlainnyaNama: initialData?.bantuanlainnyaNama || undefined,
    },
  });

  const idAnggotaKeluarga = watch('idAnggotaKeluarga');

  const handleFormSubmit = async (data: BantuanFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Recipient Family Member */}
      <div className="space-y-2">
        <Label htmlFor="idAnggotaKeluarga">
          Recipient Family Member <span className="text-red-500">*</span>
        </Label>
        <AnggotaSelect
          value={idAnggotaKeluarga}
          onChange={(value) => setValue('idAnggotaKeluarga', value, { shouldValidate: true })}
          idKeluarga={idKeluarga}
          error={errors.idAnggotaKeluarga?.message}
        />
      </div>

      {/* Assistance in Last Year */}
      <div className="space-y-2">
        <Label htmlFor="bantuan1tahunTerakhir">Assistance in Last Year</Label>
        <Input
          id="bantuan1tahunTerakhir"
          type="number"
          min="0"
          {...register('bantuan1tahunTerakhir', { valueAsNumber: true })}
          placeholder="Enter assistance count"
          disabled={isLoading}
        />
      </div>

      {/* Assistance Programs Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Assistance Programs</h3>
        
        {/* PKH */}
        <div className="space-y-2">
          <Label htmlFor="bantuanPKH">PKH (Program Keluarga Harapan)</Label>
          <Input
            id="bantuanPKH"
            type="number"
            min="0"
            {...register('bantuanPKH', { valueAsNumber: true })}
            placeholder="Enter PKH status"
            disabled={isLoading}
          />
        </div>

        {/* BPNT */}
        <div className="space-y-2">
          <Label htmlFor="bantuanBPNT">BPNT (Bantuan Pangan Non Tunai)</Label>
          <Input
            id="bantuanBPNT"
            type="number"
            min="0"
            {...register('bantuanBPNT', { valueAsNumber: true })}
            placeholder="Enter BPNT status"
            disabled={isLoading}
          />
        </div>

        {/* BOS */}
        <div className="space-y-2">
          <Label htmlFor="bantuanBOS">BOS (Bantuan Operasional Sekolah)</Label>
          <Input
            id="bantuanBOS"
            type="number"
            min="0"
            {...register('bantuanBOS', { valueAsNumber: true })}
            placeholder="Enter BOS status"
            disabled={isLoading}
          />
        </div>

        {/* BAPANAS */}
        <div className="space-y-2">
          <Label htmlFor="bantuanBAPANAS">BAPANAS</Label>
          <Input
            id="bantuanBAPANAS"
            type="number"
            min="0"
            {...register('bantuanBAPANAS', { valueAsNumber: true })}
            placeholder="Enter BAPANAS status"
            disabled={isLoading}
          />
        </div>

        {/* Stunting */}
        <div className="space-y-2">
          <Label htmlFor="bantuanStunting">Stunting Program</Label>
          <Input
            id="bantuanStunting"
            type="number"
            min="0"
            {...register('bantuanStunting', { valueAsNumber: true })}
            placeholder="Enter Stunting program status"
            disabled={isLoading}
          />
        </div>

        {/* KIS */}
        <div className="space-y-2">
          <Label htmlFor="bantuanKIS">KIS (Kartu Indonesia Sehat)</Label>
          <Input
            id="bantuanKIS"
            type="number"
            min="0"
            {...register('bantuanKIS', { valueAsNumber: true })}
            placeholder="Enter KIS status"
            disabled={isLoading}
          />
        </div>

        {/* BLT */}
        <div className="space-y-2">
          <Label htmlFor="bantuanBLT">BLT (Bantuan Langsung Tunai)</Label>
          <Input
            id="bantuanBLT"
            type="number"
            min="0"
            {...register('bantuanBLT', { valueAsNumber: true })}
            placeholder="Enter BLT status"
            disabled={isLoading}
          />
        </div>

        {/* Other Assistance Status */}
        <div className="space-y-2">
          <Label htmlFor="bantuanlainnyaStatus">Other Assistance Status</Label>
          <Input
            id="bantuanlainnyaStatus"
            type="number"
            min="0"
            {...register('bantuanlainnyaStatus', { valueAsNumber: true })}
            placeholder="Enter other assistance status"
            disabled={isLoading}
          />
        </div>

        {/* Other Assistance Name */}
        <div className="space-y-2">
          <Label htmlFor="bantuanlainnyaNama">Other Assistance Name</Label>
          <Input
            id="bantuanlainnyaNama"
            type="number"
            min="0"
            {...register('bantuanlainnyaNama', { valueAsNumber: true })}
            placeholder="Enter other assistance name"
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
          {initialData?.id ? 'Update Assistance Data' : 'Create Assistance Data'}
        </Button>
      </div>
    </form>
  );
}
