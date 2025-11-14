'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CodedSelect } from './form-fields/coded-select';
import { DatePickerField } from './form-fields/date-picker-field';
import { Loader2 } from 'lucide-react';
import { differenceInYears } from 'date-fns';

// Validation schema
const createAnggotaKeluargaSchema = z.object({
  idKeluarga: z.number(),
  nomorUrut: z.number().min(1, 'Sequential number must be at least 1'),
  namaLengkap: z.string().min(2, 'Full name must be at least 2 characters'),
  NIK: z.string().length(16, 'NIK must be 16 digits').regex(/^\d+$/, 'Must contain only numbers'),
  jenisKelamin: z.number().min(1).max(2, 'Gender is required'),
  hubunganKeluarga: z.number().min(1, 'Family relationship is required'),
  statusKawin: z.number().min(1, 'Marital status is required'),
  tempatLahir: z.string().min(2, 'Place of birth is required'),
  tanggalLahir: z.date({ required_error: 'Date of birth is required' }),
  umur: z.number().min(0, 'Age must be 0 or greater'),
  agama: z.number().min(1, 'Religion is required'),
  kartuIdentitas: z.number().min(1, 'Identity card type is required'),
  domisili: z.number().min(1, 'Domicile status is required'),
  partisipasiSekolah: z.number().min(1, 'School participation is required'),
  tingkatPendidikan: z.number().min(1, 'Education level is required'),
  kelasTertinggi: z.number().optional(),
  ijazahTertinggi: z.number().optional(),
});

export type AnggotaKeluargaFormData = z.infer<typeof createAnggotaKeluargaSchema>;

// Dropdown options based on design document
const genderOptions = [
  { value: 1, label: 'Male (Laki-laki)' },
  { value: 2, label: 'Female (Perempuan)' },
];

const familyRelationshipOptions = [
  { value: 1, label: 'Head of Family (Kepala Keluarga)' },
  { value: 2, label: 'Spouse (Istri/Suami)' },
  { value: 3, label: 'Child (Anak)' },
  { value: 4, label: 'Son/Daughter-in-law (Menantu)' },
  { value: 5, label: 'Grandchild (Cucu)' },
  { value: 6, label: 'Parent (Orang Tua)' },
  { value: 7, label: 'Parent-in-law (Mertua)' },
  { value: 8, label: 'Sibling (Famili Lain)' },
  { value: 9, label: 'Other (Lainnya)' },
];

const maritalStatusOptions = [
  { value: 1, label: 'Not Married (Belum Kawin)' },
  { value: 2, label: 'Married (Kawin)' },
  { value: 3, label: 'Divorced (Cerai Hidup)' },
  { value: 4, label: 'Widowed (Cerai Mati)' },
];

const religionOptions = [
  { value: 1, label: 'Islam' },
  { value: 2, label: 'Christian (Kristen)' },
  { value: 3, label: 'Catholic (Katolik)' },
  { value: 4, label: 'Hindu' },
  { value: 5, label: 'Buddha' },
  { value: 6, label: 'Confucianism (Konghucu)' },
  { value: 7, label: 'Other (Lainnya)' },
];

const identityCardOptions = [
  { value: 1, label: 'KTP' },
  { value: 2, label: 'SIM' },
  { value: 3, label: 'Passport' },
  { value: 4, label: 'Other (Lainnya)' },
];

const domicileStatusOptions = [
  { value: 1, label: 'Permanent (Tetap)' },
  { value: 2, label: 'Temporary (Sementara)' },
];

const schoolParticipationOptions = [
  { value: 1, label: 'Not/Not Yet in School (Tidak/Belum Sekolah)' },
  { value: 2, label: 'Still in School (Masih Sekolah)' },
  { value: 3, label: 'No Longer in School (Tidak Sekolah Lagi)' },
];

const educationLevelOptions = [
  { value: 1, label: 'No Education (Tidak/Belum Pernah Sekolah)' },
  { value: 2, label: 'Not Completed Elementary (Tidak Tamat SD)' },
  { value: 3, label: 'Elementary (SD/Sederajat)' },
  { value: 4, label: 'Junior High (SMP/Sederajat)' },
  { value: 5, label: 'Senior High (SMA/Sederajat)' },
  { value: 6, label: 'Diploma I/II' },
  { value: 7, label: 'Diploma III/Academy' },
  { value: 8, label: 'Diploma IV/Bachelor (S1)' },
  { value: 9, label: 'Master (S2)' },
  { value: 10, label: 'Doctorate (S3)' },
];

interface AnggotaKeluargaFormProps {
  initialData?: Partial<AnggotaKeluargaFormData> & { id?: number };
  idKeluarga: number;
  onSubmit: (data: AnggotaKeluargaFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function AnggotaKeluargaForm({
  initialData,
  idKeluarga,
  onSubmit,
  onCancel,
  isLoading = false,
}: AnggotaKeluargaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AnggotaKeluargaFormData>({
    resolver: zodResolver(createAnggotaKeluargaSchema),
    defaultValues: {
      idKeluarga,
      nomorUrut: initialData?.nomorUrut || 1,
      namaLengkap: initialData?.namaLengkap || '',
      NIK: initialData?.NIK || '',
      jenisKelamin: initialData?.jenisKelamin || 0,
      hubunganKeluarga: initialData?.hubunganKeluarga || 0,
      statusKawin: initialData?.statusKawin || 0,
      tempatLahir: initialData?.tempatLahir || '',
      tanggalLahir: initialData?.tanggalLahir || undefined,
      umur: initialData?.umur || 0,
      agama: initialData?.agama || 0,
      kartuIdentitas: initialData?.kartuIdentitas || 0,
      domisili: initialData?.domisili || 0,
      partisipasiSekolah: initialData?.partisipasiSekolah || 0,
      tingkatPendidikan: initialData?.tingkatPendidikan || 0,
      kelasTertinggi: initialData?.kelasTertinggi || undefined,
      ijazahTertinggi: initialData?.ijazahTertinggi || undefined,
    },
  });

  const tanggalLahir = watch('tanggalLahir');
  const jenisKelamin = watch('jenisKelamin');
  const hubunganKeluarga = watch('hubunganKeluarga');
  const statusKawin = watch('statusKawin');
  const agama = watch('agama');
  const kartuIdentitas = watch('kartuIdentitas');
  const domisili = watch('domisili');
  const partisipasiSekolah = watch('partisipasiSekolah');
  const tingkatPendidikan = watch('tingkatPendidikan');

  // Auto-calculate age from date of birth
  React.useEffect(() => {
    if (tanggalLahir) {
      const age = differenceInYears(new Date(), tanggalLahir);
      setValue('umur', age, { shouldValidate: true });
    }
  }, [tanggalLahir, setValue]);

  const handleFormSubmit = async (data: AnggotaKeluargaFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Personal Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sequential Number */}
          <div className="space-y-2">
            <Label htmlFor="nomorUrut">
              Sequential Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nomorUrut"
              type="number"
              min="1"
              {...register('nomorUrut', { valueAsNumber: true })}
              placeholder="Enter sequential number"
              disabled={isLoading}
              className={errors.nomorUrut ? 'border-red-500' : ''}
            />
            {errors.nomorUrut && (
              <p className="text-sm text-red-500">{errors.nomorUrut.message}</p>
            )}
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="namaLengkap">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="namaLengkap"
              {...register('namaLengkap')}
              placeholder="Enter full name"
              disabled={isLoading}
              className={errors.namaLengkap ? 'border-red-500' : ''}
            />
            {errors.namaLengkap && (
              <p className="text-sm text-red-500">{errors.namaLengkap.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* NIK */}
          <div className="space-y-2">
            <Label htmlFor="NIK">
              NIK <span className="text-red-500">*</span>
            </Label>
            <Input
              id="NIK"
              {...register('NIK')}
              placeholder="Enter 16-digit NIK"
              maxLength={16}
              disabled={isLoading}
              className={errors.NIK ? 'border-red-500' : ''}
            />
            {errors.NIK && (
              <p className="text-sm text-red-500">{errors.NIK.message}</p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label htmlFor="jenisKelamin">
              Gender <span className="text-red-500">*</span>
            </Label>
            <CodedSelect
              value={jenisKelamin}
              onChange={(value) => setValue('jenisKelamin', value, { shouldValidate: true })}
              options={genderOptions}
              placeholder="Select gender"
              error={errors.jenisKelamin?.message}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Family Relationship */}
          <div className="space-y-2">
            <Label htmlFor="hubunganKeluarga">
              Family Relationship <span className="text-red-500">*</span>
            </Label>
            <CodedSelect
              value={hubunganKeluarga}
              onChange={(value) => setValue('hubunganKeluarga', value, { shouldValidate: true })}
              options={familyRelationshipOptions}
              placeholder="Select relationship"
              error={errors.hubunganKeluarga?.message}
            />
          </div>

          {/* Marital Status */}
          <div className="space-y-2">
            <Label htmlFor="statusKawin">
              Marital Status <span className="text-red-500">*</span>
            </Label>
            <CodedSelect
              value={statusKawin}
              onChange={(value) => setValue('statusKawin', value, { shouldValidate: true })}
              options={maritalStatusOptions}
              placeholder="Select marital status"
              error={errors.statusKawin?.message}
            />
          </div>
        </div>
      </div>

      {/* Birth Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Birth Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Place of Birth */}
          <div className="space-y-2">
            <Label htmlFor="tempatLahir">
              Place of Birth <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tempatLahir"
              {...register('tempatLahir')}
              placeholder="Enter place of birth"
              disabled={isLoading}
              className={errors.tempatLahir ? 'border-red-500' : ''}
            />
            {errors.tempatLahir && (
              <p className="text-sm text-red-500">{errors.tempatLahir.message}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="tanggalLahir">
              Date of Birth <span className="text-red-500">*</span>
            </Label>
            <DatePickerField
              value={tanggalLahir}
              onChange={(date) => setValue('tanggalLahir', date as Date, { shouldValidate: true })}
              placeholder="Pick date of birth"
              error={errors.tanggalLahir?.message}
            />
          </div>
        </div>

        {/* Age (auto-calculated) */}
        <div className="space-y-2">
          <Label htmlFor="umur">
            Age (auto-calculated) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="umur"
            type="number"
            {...register('umur', { valueAsNumber: true })}
            placeholder="Age will be calculated from date of birth"
            disabled={isLoading}
            className={errors.umur ? 'border-red-500' : ''}
            readOnly
          />
          {errors.umur && (
            <p className="text-sm text-red-500">{errors.umur.message}</p>
          )}
        </div>
      </div>

      {/* Identity & Domicile Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Identity & Domicile</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Religion */}
          <div className="space-y-2">
            <Label htmlFor="agama">
              Religion <span className="text-red-500">*</span>
            </Label>
            <CodedSelect
              value={agama}
              onChange={(value) => setValue('agama', value, { shouldValidate: true })}
              options={religionOptions}
              placeholder="Select religion"
              error={errors.agama?.message}
            />
          </div>

          {/* Identity Card Type */}
          <div className="space-y-2">
            <Label htmlFor="kartuIdentitas">
              Identity Card Type <span className="text-red-500">*</span>
            </Label>
            <CodedSelect
              value={kartuIdentitas}
              onChange={(value) => setValue('kartuIdentitas', value, { shouldValidate: true })}
              options={identityCardOptions}
              placeholder="Select identity card type"
              error={errors.kartuIdentitas?.message}
            />
          </div>
        </div>

        {/* Domicile Status */}
        <div className="space-y-2">
          <Label htmlFor="domisili">
            Domicile Status <span className="text-red-500">*</span>
          </Label>
          <CodedSelect
            value={domisili}
            onChange={(value) => setValue('domisili', value, { shouldValidate: true })}
            options={domicileStatusOptions}
            placeholder="Select domicile status"
            error={errors.domisili?.message}
          />
        </div>
      </div>

      {/* Education Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Education</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* School Participation */}
          <div className="space-y-2">
            <Label htmlFor="partisipasiSekolah">
              School Participation <span className="text-red-500">*</span>
            </Label>
            <CodedSelect
              value={partisipasiSekolah}
              onChange={(value) => setValue('partisipasiSekolah', value, { shouldValidate: true })}
              options={schoolParticipationOptions}
              placeholder="Select school participation"
              error={errors.partisipasiSekolah?.message}
            />
          </div>

          {/* Education Level */}
          <div className="space-y-2">
            <Label htmlFor="tingkatPendidikan">
              Education Level <span className="text-red-500">*</span>
            </Label>
            <CodedSelect
              value={tingkatPendidikan}
              onChange={(value) => setValue('tingkatPendidikan', value, { shouldValidate: true })}
              options={educationLevelOptions}
              placeholder="Select education level"
              error={errors.tingkatPendidikan?.message}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Highest Class */}
          <div className="space-y-2">
            <Label htmlFor="kelasTertinggi">Highest Class</Label>
            <Input
              id="kelasTertinggi"
              type="number"
              min="0"
              {...register('kelasTertinggi', { valueAsNumber: true })}
              placeholder="Enter highest class (optional)"
              disabled={isLoading}
              className={errors.kelasTertinggi ? 'border-red-500' : ''}
            />
            {errors.kelasTertinggi && (
              <p className="text-sm text-red-500">{errors.kelasTertinggi.message}</p>
            )}
          </div>

          {/* Highest Diploma */}
          <div className="space-y-2">
            <Label htmlFor="ijazahTertinggi">Highest Diploma</Label>
            <Input
              id="ijazahTertinggi"
              type="number"
              min="0"
              {...register('ijazahTertinggi', { valueAsNumber: true })}
              placeholder="Enter highest diploma (optional)"
              disabled={isLoading}
              className={errors.ijazahTertinggi ? 'border-red-500' : ''}
            />
            {errors.ijazahTertinggi && (
              <p className="text-sm text-red-500">{errors.ijazahTertinggi.message}</p>
            )}
          </div>
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
          {initialData?.id ? 'Update Family Member' : 'Add Family Member'}
        </Button>
      </div>
    </form>
  );
}
