'use server';

import { z } from 'zod';
import { validatedActionWithUser, withUser } from '@/lib/auth/middleware';
import {
    getKeluargaByIdWithMFD,
    getAnggotaKeluargaByKeluarga,
    getAnggotaKeluargaByNIK,
    getAnggotaKeluargaByNIKExcludingId,
    createAnggotaKeluarga,
    updateAnggotaKeluarga,
    deleteAnggotaKeluarga,
    hasAnggotaKeluargaRelatedRecords,
    getKetPetugasByKeluarga,
    getKetenagakerjaanByAnggota,
    getKeteranganPerumahanByKeluarga,
    getKeteranganPerumahanBlok2ByKeluarga,
    getBantuanByKeluarga,
    getDisabilitasByKeluarga,
    createKetPetugas,
    updateKetPetugas,
    deleteKetPetugas,
    createKetenagakerjaan,
    updateKetenagakerjaan,
    deleteKetenagakerjaan,
    createKeteranganPerumahan,
    updateKeteranganPerumahan,
    deleteKeteranganPerumahan,
    createKeteranganPerumahanBlok2,
    updateKeteranganPerumahanBlok2,
    deleteKeteranganPerumahanBlok2,
    createBantuan,
    updateBantuan,
    deleteBantuan,
    createDisabilitas,
    updateDisabilitas,
    deleteDisabilitas,
} from '@/lib/db/query';
import { type User } from '@/lib/db/schema';

// ==================== TYPES ====================

type ActionResponse = {
    success: boolean;
    error?: string;
    message?: string;
    data?: unknown;
};

// ==================== VALIDATION SCHEMAS ====================

const createAnggotaKeluargaSchema = z.object({
    idKeluarga: z.string().transform(Number),
    nomorUrut: z.string().transform(Number).pipe(z.number().min(1, 'Sequential number must be at least 1')),
    namaLengkap: z.string().min(2, 'Full name must be at least 2 characters'),
    NIK: z.string().length(16, 'NIK must be 16 digits').regex(/^\d+$/, 'Must contain only numbers'),
    jenisKelamin: z.string().transform(Number).pipe(z.number().min(1).max(2, 'Gender is required')),
    hubunganKeluarga: z.string().transform(Number).pipe(z.number().min(1, 'Family relationship is required')),
    statusKawin: z.string().transform(Number).pipe(z.number().min(1, 'Marital status is required')),
    tempatLahir: z.string().min(2, 'Place of birth is required'),
    tanggalLahir: z.string().min(1, 'Date of birth is required'),
    umur: z.string().transform(Number).pipe(z.number().min(0, 'Age must be 0 or greater')),
    agama: z.string().transform(Number).pipe(z.number().min(1, 'Religion is required')),
    kartuIdentitas: z.string().transform(Number).pipe(z.number().min(1, 'Identity card type is required')),
    domisili: z.string().transform(Number).pipe(z.number().min(1, 'Domicile status is required')),
    partisipasiSekolah: z.string().transform(Number).pipe(z.number().min(1, 'School participation is required')),
    tingkatPendidikan: z.string().transform(Number).pipe(z.number().min(1, 'Education level is required')),
    kelasTertinggi: z.string().transform(Number).pipe(z.number()).optional(),
    ijazahTertinggi: z.string().transform(Number).pipe(z.number()).optional(),
});

const updateAnggotaKeluargaSchema = z.object({
    id: z.string().transform(Number),
    idKeluarga: z.string().transform(Number),
    nomorUrut: z.string().transform(Number).pipe(z.number().min(1, 'Sequential number must be at least 1')),
    namaLengkap: z.string().min(2, 'Full name must be at least 2 characters'),
    NIK: z.string().length(16, 'NIK must be 16 digits').regex(/^\d+$/, 'Must contain only numbers'),
    jenisKelamin: z.string().transform(Number).pipe(z.number().min(1).max(2, 'Gender is required')),
    hubunganKeluarga: z.string().transform(Number).pipe(z.number().min(1, 'Family relationship is required')),
    statusKawin: z.string().transform(Number).pipe(z.number().min(1, 'Marital status is required')),
    tempatLahir: z.string().min(2, 'Place of birth is required'),
    tanggalLahir: z.string().min(1, 'Date of birth is required'),
    umur: z.string().transform(Number).pipe(z.number().min(0, 'Age must be 0 or greater')),
    agama: z.string().transform(Number).pipe(z.number().min(1, 'Religion is required')),
    kartuIdentitas: z.string().transform(Number).pipe(z.number().min(1, 'Identity card type is required')),
    domisili: z.string().transform(Number).pipe(z.number().min(1, 'Domicile status is required')),
    partisipasiSekolah: z.string().transform(Number).pipe(z.number().min(1, 'School participation is required')),
    tingkatPendidikan: z.string().transform(Number).pipe(z.number().min(1, 'Education level is required')),
    kelasTertinggi: z.string().transform(Number).pipe(z.number()).optional(),
    ijazahTertinggi: z.string().transform(Number).pipe(z.number()).optional(),
});

// ==================== SERVER ACTIONS ====================

/**
 * Get complete family data including all related records
 * - Fetches keluarga record by ID with MFD information
 * - Fetches all anggota keluarga for the family
 * - Fetches all additional data (ket petugas, employment, housing, assistance, disability)
 * - Returns complete family data object
 */
export const getKeluargaDetailAction = withUser(
    async (formData: FormData, _user: User): Promise<ActionResponse> => {
        try {
            const keluargaId = Number(formData.get('id'));

            if (!keluargaId) {
                return {
                    success: false,
                    error: 'Family ID is required',
                };
            }

            // Fetch keluarga record with MFD information
            const keluarga = await getKeluargaByIdWithMFD(keluargaId);

            if (!keluarga) {
                return {
                    success: false,
                    error: 'Family record not found',
                };
            }

            // Fetch all related data in parallel
            const [
                anggotaKeluarga,
                ketPetugas,
                keteranganPerumahan,
                keteranganPerumahanBlok2,
                bantuan,
                disabilitas,
            ] = await Promise.all([
                getAnggotaKeluargaByKeluarga(keluargaId),
                getKetPetugasByKeluarga(keluargaId),
                getKeteranganPerumahanByKeluarga(keluargaId),
                getKeteranganPerumahanBlok2ByKeluarga(keluargaId),
                getBantuanByKeluarga(keluargaId),
                getDisabilitasByKeluarga(keluargaId),
            ]);

            // For each anggota keluarga, fetch their employment data
            const anggotaWithEmployment = await Promise.all(
                anggotaKeluarga.map(async (anggota) => {
                    const ketenagakerjaan = await getKetenagakerjaanByAnggota(anggota.id);
                    return {
                        ...anggota,
                        ketenagakerjaan,
                    };
                })
            );

            return {
                success: true,
                data: {
                    keluarga,
                    anggotaKeluarga: anggotaWithEmployment,
                    ketPetugas,
                    keteranganPerumahan,
                    keteranganPerumahanBlok2,
                    bantuan,
                    disabilitas,
                },
            };
        } catch (error) {
            console.error('Error fetching family detail:', error);
            return {
                success: false,
                error: 'Failed to fetch family details',
            };
        }
    }
);

/**
 * Create a new anggota keluarga record
 * - Validates input data
 * - Checks for duplicate NIK
 * - Creates anggota keluarga record linked to family
 */
export const createAnggotaKeluargaAction = withUser(
    async (formData: FormData, _user: User): Promise<ActionResponse> => {
        try {
            // Validate input data
            const result = createAnggotaKeluargaSchema.safeParse(Object.fromEntries(formData));
            
            if (!result.success) {
                return {
                    success: false,
                    error: result.error.issues[0].message,
                };
            }

            const data = result.data;

            // Check if NIK already exists
            const existingAnggota = await getAnggotaKeluargaByNIK(data.NIK);

            if (existingAnggota) {
                return {
                    success: false,
                    error: 'NIK already exists',
                };
            }

            // Create anggota keluarga record
            const newAnggota = await createAnggotaKeluarga({
                idKeluarga: data.idKeluarga,
                nomorUrut: data.nomorUrut,
                namaLengkap: data.namaLengkap,
                NIK: data.NIK,
                jenisKelamin: data.jenisKelamin,
                hubunganKeluarga: data.hubunganKeluarga,
                statusKawin: data.statusKawin,
                tempatLahir: data.tempatLahir,
                tanggalLahir: data.tanggalLahir,
                umur: data.umur,
                agama: data.agama,
                kartuIdentitas: data.kartuIdentitas,
                domisili: data.domisili,
                partisipasiSekolah: data.partisipasiSekolah,
                tingkatPendidikan: data.tingkatPendidikan,
                kelasTertinggi: data.kelasTertinggi || 0,
                ijazahTertinggi: data.ijazahTertinggi || 0,
            });

            return {
                success: true,
                message: 'Family member created successfully',
                data: newAnggota,
            };
        } catch (error) {
            console.error('Error creating anggota keluarga:', error);
            return {
                success: false,
                error: 'Failed to create family member. Please try again.',
            };
        }
    }
);

/**
 * Update an existing anggota keluarga record
 * - Validates input data
 * - Checks for NIK conflicts (excluding current record)
 * - Updates anggota keluarga record
 */
export const updateAnggotaKeluargaAction = withUser(
    async (formData: FormData, _user: User): Promise<ActionResponse> => {
        try {
            // Validate input data
            const result = updateAnggotaKeluargaSchema.safeParse(Object.fromEntries(formData));
            
            if (!result.success) {
                return {
                    success: false,
                    error: result.error.issues[0].message,
                };
            }

            const data = result.data;
            const anggotaId = data.id;

            // Check if updated NIK conflicts with another anggota keluarga record
            const conflictingAnggota = await getAnggotaKeluargaByNIKExcludingId(
                data.NIK,
                anggotaId
            );

            if (conflictingAnggota) {
                return {
                    success: false,
                    error: 'NIK already exists',
                };
            }

            // Update anggota keluarga record
            const updatedAnggota = await updateAnggotaKeluarga(anggotaId, {
                idKeluarga: data.idKeluarga,
                nomorUrut: data.nomorUrut,
                namaLengkap: data.namaLengkap,
                NIK: data.NIK,
                jenisKelamin: data.jenisKelamin,
                hubunganKeluarga: data.hubunganKeluarga,
                statusKawin: data.statusKawin,
                tempatLahir: data.tempatLahir,
                tanggalLahir: data.tanggalLahir,
                umur: data.umur,
                agama: data.agama,
                kartuIdentitas: data.kartuIdentitas,
                domisili: data.domisili,
                partisipasiSekolah: data.partisipasiSekolah,
                tingkatPendidikan: data.tingkatPendidikan,
                kelasTertinggi: data.kelasTertinggi || 0,
                ijazahTertinggi: data.ijazahTertinggi || 0,
            });

            if (!updatedAnggota) {
                return {
                    success: false,
                    error: 'Family member not found',
                };
            }

            return {
                success: true,
                message: 'Family member updated successfully',
                data: updatedAnggota,
            };
        } catch (error) {
            console.error('Error updating anggota keluarga:', error);
            return {
                success: false,
                error: 'Failed to update family member. Please try again.',
            };
        }
    }
);

/**
 * Delete an anggota keluarga record
 * - Checks for related records (ketenagakerjaan, bantuan, disabilitas)
 * - Prevents deletion if related records exist
 * - Performs deletion if no dependencies exist
 */
export const deleteAnggotaKeluargaAction = withUser(
    async (formData: FormData, _user: User): Promise<ActionResponse> => {
        try {
            const anggotaId = Number(formData.get('id'));

            if (!anggotaId) {
                return {
                    success: false,
                    error: 'Family member ID is required',
                };
            }

            // Check if any related records exist
            const hasRelatedRecords = await hasAnggotaKeluargaRelatedRecords(anggotaId);

            if (hasRelatedRecords) {
                return {
                    success: false,
                    error: 'Cannot delete family member that has associated data',
                };
            }

            // Perform deletion
            const deletedAnggota = await deleteAnggotaKeluarga(anggotaId);

            if (!deletedAnggota) {
                return {
                    success: false,
                    error: 'Family member not found',
                };
            }

            return {
                success: true,
                message: 'Family member deleted successfully',
            };
        } catch (error) {
            console.error('Error deleting anggota keluarga:', error);
            return {
                success: false,
                error: 'Failed to delete family member. Please try again.',
            };
        }
    }
);

// ==================== KET PETUGAS ACTIONS ====================

const createKetPetugasSchema = z.object({
    idKeluarga: z.string().transform(Number),
    tanggalPendataan: z.string().min(1, 'Data collection date is required'),
    namaPendata: z.string().min(2, 'Data collector name is required'),
    kodePendata: z.string().transform(Number).pipe(z.number().min(1, 'Data collector is required')),
    tanggalPemeriksaan: z.string().min(1, 'Inspection date is required'),
    namaPemeriksa: z.string().min(2, 'Inspector name is required'),
    kodePemeriksa: z.string().transform(Number).pipe(z.number().min(1, 'Inspector is required')),
    hasilPendataan: z.string().min(1, 'Survey result is required'),
});

const updateKetPetugasSchema = z.object({
    id: z.string().transform(Number),
    idKeluarga: z.string().transform(Number),
    tanggalPendataan: z.string().min(1, 'Data collection date is required'),
    namaPendata: z.string().min(2, 'Data collector name is required'),
    kodePendata: z.string().transform(Number).pipe(z.number().min(1, 'Data collector is required')),
    tanggalPemeriksaan: z.string().min(1, 'Inspection date is required'),
    namaPemeriksa: z.string().min(2, 'Inspector name is required'),
    kodePemeriksa: z.string().transform(Number).pipe(z.number().min(1, 'Inspector is required')),
    hasilPendataan: z.string().min(1, 'Survey result is required'),
});

export const createKetPetugasAction = withUser(
    async (formData: FormData, _user: User): Promise<ActionResponse> => {
        try {
            const result = createKetPetugasSchema.safeParse(Object.fromEntries(formData));
            
            if (!result.success) {
                return {
                    success: false,
                    error: result.error.issues[0].message,
                };
            }

            const data = result.data;

            const newKetPetugas = await createKetPetugas({
                idKeluarga: data.idKeluarga,
                tanggalPendataan: data.tanggalPendataan,
                namaPendata: data.namaPendata,
                kodePendata: data.kodePendata,
                tanggalPemeriksaan: data.tanggalPemeriksaan,
                namaPemeriksa: data.namaPemeriksa,
                kodePemeriksa: data.kodePemeriksa,
                hasilPendataan: data.hasilPendataan,
            });

            return {
                success: true,
                message: 'Survey officer information created successfully',
                data: newKetPetugas,
            };
        } catch (error) {
            console.error('Error creating ket petugas:', error);
            return {
                success: false,
                error: 'Failed to create survey officer information. Please try again.',
            };
        }
    }
);

export const updateKetPetugasAction = withUser(
    async (formData: FormData, _user: User): Promise<ActionResponse> => {
        try {
            const result = updateKetPetugasSchema.safeParse(Object.fromEntries(formData));
            
            if (!result.success) {
                return {
                    success: false,
                    error: result.error.issues[0].message,
                };
            }

            const data = result.data;

            const updatedKetPetugas = await updateKetPetugas(data.id, {
                idKeluarga: data.idKeluarga,
                tanggalPendataan: data.tanggalPendataan,
                namaPendata: data.namaPendata,
                kodePendata: data.kodePendata,
                tanggalPemeriksaan: data.tanggalPemeriksaan,
                namaPemeriksa: data.namaPemeriksa,
                kodePemeriksa: data.kodePemeriksa,
                hasilPendataan: data.hasilPendataan,
            });

            if (!updatedKetPetugas) {
                return {
                    success: false,
                    error: 'Survey officer information not found',
                };
            }

            return {
                success: true,
                message: 'Survey officer information updated successfully',
                data: updatedKetPetugas,
            };
        } catch (error) {
            console.error('Error updating ket petugas:', error);
            return {
                success: false,
                error: 'Failed to update survey officer information. Please try again.',
            };
        }
    }
);

export const deleteKetPetugasAction = withUser(
    async (formData: FormData, _user: User): Promise<ActionResponse> => {
        try {
            const ketPetugasId = Number(formData.get('id'));

            if (!ketPetugasId) {
                return {
                    success: false,
                    error: 'Survey officer information ID is required',
                };
            }

            const deletedKetPetugas = await deleteKetPetugas(ketPetugasId);

            if (!deletedKetPetugas) {
                return {
                    success: false,
                    error: 'Survey officer information not found',
                };
            }

            return {
                success: true,
                message: 'Survey officer information deleted successfully',
            };
        } catch (error) {
            console.error('Error deleting ket petugas:', error);
            return {
                success: false,
                error: 'Failed to delete survey officer information. Please try again.',
            };
        }
    }
);

// ==================== KETENAGAKERJAAN ACTIONS ====================

const createKetenagakerjaanSchema = z.object({
    idAnggotaKeluarga: z.string().transform(Number).pipe(z.number().min(1, 'Family member is required')),
    bekerja: z.string().optional(),
    lapanganUsaha: z.string().optional(),
    statusPekerjaan: z.string().optional(),
    kegiatanUtama: z.string().optional(),
    lengkap: z.string().optional(),
});

const updateKetenagakerjaanSchema = z.object({
    id: z.string().transform(Number),
    idAnggotaKeluarga: z.string().transform(Number).pipe(z.number().min(1, 'Family member is required')),
    bekerja: z.string().optional(),
    lapanganUsaha: z.string().optional(),
    statusPekerjaan: z.string().optional(),
    kegiatanUtama: z.string().optional(),
    lengkap: z.string().optional(),
});

export const createKetenagakerjaanAction = withUser(
    async (formData: FormData, _user: User): Promise<ActionResponse> => {
        try {
            const result = createKetenagakerjaanSchema.safeParse(Object.fromEntries(formData));
            
            if (!result.success) {
                return {
                    success: false,
                    error: result.error.issues[0].message,
                };
            }

            const data = result.data;

            const newKetenagakerjaan = await createKetenagakerjaan({
                idAnggotaKeluarga: data.idAnggotaKeluarga,
                bekerja: data.bekerja || null,
                lapanganUsaha: data.lapanganUsaha || null,
                statusPekerjaan: data.statusPekerjaan || null,
                kegiatanUtama: data.kegiatanUtama || null,
                lengkap: data.lengkap || null,
            });

            return {
                success: true,
                message: 'Employment data created successfully',
                data: newKetenagakerjaan,
            };
        } catch (error) {
            console.error('Error creating ketenagakerjaan:', error);
            return {
                success: false,
                error: 'Failed to create employment data. Please try again.',
            };
        }
    }
);

export const updateKetenagakerjaanAction = withUser(
    async (formData: FormData, _user: User): Promise<ActionResponse> => {
        try {
            const result = updateKetenagakerjaanSchema.safeParse(Object.fromEntries(formData));
            
            if (!result.success) {
                return {
                    success: false,
                    error: result.error.issues[0].message,
                };
            }

            const data = result.data;

            const updatedKetenagakerjaan = await updateKetenagakerjaan(data.id, {
                idAnggotaKeluarga: data.idAnggotaKeluarga,
                bekerja: data.bekerja || null,
                lapanganUsaha: data.lapanganUsaha || null,
                statusPekerjaan: data.statusPekerjaan || null,
                kegiatanUtama: data.kegiatanUtama || null,
                lengkap: data.lengkap || null,
            });

            if (!updatedKetenagakerjaan) {
                return {
                    success: false,
                    error: 'Employment data not found',
                };
            }

            return {
                success: true,
                message: 'Employment data updated successfully',
                data: updatedKetenagakerjaan,
            };
        } catch (error) {
            console.error('Error updating ketenagakerjaan:', error);
            return {
                success: false,
                error: 'Failed to update employment data. Please try again.',
            };
        }
    }
);

export const deleteKetenagakerjaanAction = withUser(
    async (formData: FormData, _user: User): Promise<ActionResponse> => {
        try {
            const ketenagakerjaanId = Number(formData.get('id'));

            if (!ketenagakerjaanId) {
                return {
                    success: false,
                    error: 'Employment data ID is required',
                };
            }

            const deletedKetenagakerjaan = await deleteKetenagakerjaan(ketenagakerjaanId);

            if (!deletedKetenagakerjaan) {
                return {
                    success: false,
                    error: 'Employment data not found',
                };
            }

            return {
                success: true,
                message: 'Employment data deleted successfully',
            };
        } catch (error) {
            console.error('Error deleting ketenagakerjaan:', error);
            return {
                success: false,
                error: 'Failed to delete employment data. Please try again.',
            };
        }
    }
);

// ==================== HOUSING ACTIONS ====================

const createKeteranganPerumahanSchema = z.object({
    idKeluarga: z.string().transform(Number),
    luasLantai: z.string().transform(Number).pipe(z.number()).optional(),
    statusBangunan: z.string().optional(),
    buktiKepemilikan: z.string().optional(),
    sumberAirMinum: z.string().optional(),
    fasilitasBAB: z.string().optional(),
    peneranganUtama: z.string().optional(),
    daya: z.string().optional(),
});

const updateKeteranganPerumahanSchema = z.object({
    id: z.string().transform(Number),
    idKeluarga: z.string().transform(Number),
    luasLantai: z.string().transform(Number).pipe(z.number()).optional(),
    statusBangunan: z.string().optional(),
    buktiKepemilikan: z.string().optional(),
    sumberAirMinum: z.string().optional(),
    fasilitasBAB: z.string().optional(),
    peneranganUtama: z.string().optional(),
    daya: z.string().optional(),
});

export const createKeteranganPerumahanAction = withUser(
    async (formData: FormData, _user: User): Promise<ActionResponse> => {
        try {
            const result = createKeteranganPerumahanSchema.safeParse(Object.fromEntries(formData));
            
            if (!result.success) {
                return {
                    success: false,
                    error: result.error.issues[0].message,
                };
            }

            const data = result.data;

            const newKetPerumahan = await createKeteranganPerumahan({
                idKeluarga: data.idKeluarga,
                luasLantai: data.luasLantai || null,
                statusBangunan: data.statusBangunan || null,
                buktiKepemilikan: data.buktiKepemilikan || null,
                sumberAirMinum: data.sumberAirMinum || null,
                fasilitasBAB: data.fasilitasBAB || null,
                peneranganUtama: data.peneranganUtama || null,
                daya: data.daya || null,
            });

            return {
                success: true,
                message: 'Housing characteristics created successfully',
                data: newKetPerumahan,
            };
        } catch (error) {
            console.error('Error creating keterangan perumahan:', error);
            return {
                success: false,
                error: 'Failed to create housing characteristics. Please try again.',
            };
        }
    }
);

export const updateKeteranganPerumahanAction = withUser(
    async (formData: FormData, _user: User): Promise<ActionResponse> => {
        try {
            const result = updateKeteranganPerumahanSchema.safeParse(Object.fromEntries(formData));
            
            if (!result.success) {
                return {
                    success: false,
                    error: result.error.issues[0].message,
                };
            }

            const data = result.data;

            const updatedKetPerumahan = await updateKeteranganPerumahan(data.id, {
                idKeluarga: data.idKeluarga,
                luasLantai: data.luasLantai || null,
                statusBangunan: data.statusBangunan || null,
                buktiKepemilikan: data.buktiKepemilikan || null,
                sumberAirMinum: data.sumberAirMinum || null,
                fasilitasBAB: data.fasilitasBAB || null,
                peneranganUtama: data.peneranganUtama || null,
                daya: data.daya || null,
            });

            if (!updatedKetPerumahan) {
                return {
                    success: false,
                    error: 'Housing characteristics not found',
                };
            }

            return {
                success: true,
                message: 'Housing characteristics updated successfully',
                data: updatedKetPerumahan,
            };
        } catch (error) {
            console.error('Error updating keterangan perumahan:', error);
            return {
                success: false,
                error: 'Failed to update housing characteristics. Please try again.',
            };
        }
    }
);

export const deleteKeteranganPerumahanAction = withUser(
    async (formData: FormData, _user: User): Promise<ActionResponse> => {
        try {
            const ketPerumahanId = Number(formData.get('id'));

            if (!ketPerumahanId) {
                return {
                    success: false,
                    error: 'Housing characteristics ID is required',
                };
            }

            const deletedKetPerumahan = await deleteKeteranganPerumahan(ketPerumahanId);

            if (!deletedKetPerumahan) {
                return {
                    success: false,
                    error: 'Housing characteristics not found',
                };
            }

            return {
                success: true,
                message: 'Housing characteristics deleted successfully',
            };
        } catch (error) {
            console.error('Error deleting keterangan perumahan:', error);
            return {
                success: false,
                error: 'Failed to delete housing characteristics. Please try again.',
            };
        }
    }
);

// ==================== HOUSING BLOK 2 ACTIONS ====================

const createKeteranganPerumahanBlok2Schema = z.object({
    idKeluarga: z.string().transform(Number),
    luasPertanianSawah: z.string().transform(Number).pipe(z.number()).optional(),
    luasPertanianKebun: z.string().transform(Number).pipe(z.number()).optional(),
    luasPertanianKolam: z.string().transform(Number).pipe(z.number()).optional(),
    ayam: z.string().transform(Number).pipe(z.number()).optional(),
    kambing: z.string().transform(Number).pipe(z.number()).optional(),
    sapi: z.string().transform(Number).pipe(z.number()).optional(),
});

const updateKeteranganPerumahanBlok2Schema = z.object({
    id: z.string().transform(Number),
    idKeluarga: z.string().transform(Number),
    luasPertanianSawah: z.string().transform(Number).pipe(z.number()).optional(),
    luasPertanianKebun: z.string().transform(Number).pipe(z.number()).optional(),
    luasPertanianKolam: z.string().transform(Number).pipe(z.number()).optional(),
    ayam: z.string().transform(Number).pipe(z.number()).optional(),
    kambing: z.string().transform(Number).pipe(z.number()).optional(),
    sapi: z.string().transform(Number).pipe(z.number()).optional(),
});

export const createKeteranganPerumahanBlok2Action = withUser(
    async (formData: FormData, _user: User): Promise<ActionResponse> => {
        try {
            const result = createKeteranganPerumahanBlok2Schema.safeParse(Object.fromEntries(formData));
            
            if (!result.success) {
                return {
                    success: false,
                    error: result.error.issues[0].message,
                };
            }

            const data = result.data;

            const newKetPerumahanBlok2 = await createKeteranganPerumahanBlok2({
                idKeluarga: data.idKeluarga,
                luasPertanianSawah: data.luasPertanianSawah || null,
                luasPertanianKebun: data.luasPertanianKebun || null,
                luasPertanianKolam: data.luasPertanianKolam || null,
                ayam: data.ayam || null,
                kambing: data.kambing || null,
                sapi: data.sapi || null,
            });

            return {
                success: true,
                message: 'Agricultural and livestock data created successfully',
                data: newKetPerumahanBlok2,
            };
        } catch (error) {
            console.error('Error creating keterangan perumahan blok 2:', error);
            return {
                success: false,
                error: 'Failed to create agricultural and livestock data. Please try again.',
            };
        }
    }
);

export const updateKeteranganPerumahanBlok2Action = withUser(
    async (formData: FormData, _user: User): Promise<ActionResponse> => {
        try {
            const result = updateKeteranganPerumahanBlok2Schema.safeParse(Object.fromEntries(formData));
            
            if (!result.success) {
                return {
                    success: false,
                    error: result.error.issues[0].message,
                };
            }

            const data = result.data;

            const updatedKetPerumahanBlok2 = await updateKeteranganPerumahanBlok2(data.id, {
                idKeluarga: data.idKeluarga,
                luasPertanianSawah: data.luasPertanianSawah || null,
                luasPertanianKebun: data.luasPertanianKebun || null,
                luasPertanianKolam: data.luasPertanianKolam || null,
                ayam: data.ayam || null,
                kambing: data.kambing || null,
                sapi: data.sapi || null,
            });

            if (!updatedKetPerumahanBlok2) {
                return {
                    success: false,
                    error: 'Agricultural and livestock data not found',
                };
            }

            return {
                success: true,
                message: 'Agricultural and livestock data updated successfully',
                data: updatedKetPerumahanBlok2,
            };
        } catch (error) {
            console.error('Error updating keterangan perumahan blok 2:', error);
            return {
                success: false,
                error: 'Failed to update agricultural and livestock data. Please try again.',
            };
        }
    }
);

export const deleteKeteranganPerumahanBlok2Action = withUser(
    async (formData: FormData, _user: User): Promise<ActionResponse> => {
        try {
            const ketPerumahanBlok2Id = Number(formData.get('id'));

            if (!ketPerumahanBlok2Id) {
                return {
                    success: false,
                    error: 'Agricultural and livestock data ID is required',
                };
            }

            const deletedKetPerumahanBlok2 = await deleteKeteranganPerumahanBlok2(ketPerumahanBlok2Id);

            if (!deletedKetPerumahanBlok2) {
                return {
                    success: false,
                    error: 'Agricultural and livestock data not found',
                };
            }

            return {
                success: true,
                message: 'Agricultural and livestock data deleted successfully',
            };
        } catch (error) {
            console.error('Error deleting keterangan perumahan blok 2:', error);
            return {
                success: false,
                error: 'Failed to delete agricultural and livestock data. Please try again.',
            };
        }
    }
);

// ==================== BANTUAN ACTIONS ====================

const createBantuanSchema = z.object({
    idKeluarga: z.string().transform(Number),
    idAnggotaKeluarga: z.string().transform(Number).pipe(z.number().min(1, 'Recipient family member is required')),
    bantuan1tahunTerakhir: z.string().transform(Number).pipe(z.number()).optional(),
    bantuanPKH: z.string().transform(Number).pipe(z.number()).optional(),
    bantuanBPNT: z.string().transform(Number).pipe(z.number()).optional(),
    bantuanBOS: z.string().transform(Number).pipe(z.number()).optional(),
    bantuanBAPANAS: z.string().transform(Number).pipe(z.number()).optional(),
    bantuanStunting: z.string().transform(Number).pipe(z.number()).optional(),
    bantuanKIS: z.string().transform(Number).pipe(z.number()).optional(),
    bantuanBLT: z.string().transform(Number).pipe(z.number()).optional(),
    bantuanlainnyaStatus: z.string().transform(Number).pipe(z.number()).optional(),
    bantuanlainnyaNama: z.string().transform(Number).pipe(z.number()).optional(),
});

const updateBantuanSchema = z.object({
    id: z.string().transform(Number),
    idKeluarga: z.string().transform(Number),
    idAnggotaKeluarga: z.string().transform(Number).pipe(z.number().min(1, 'Recipient family member is required')),
    bantuan1tahunTerakhir: z.string().transform(Number).pipe(z.number()).optional(),
    bantuanPKH: z.string().transform(Number).pipe(z.number()).optional(),
    bantuanBPNT: z.string().transform(Number).pipe(z.number()).optional(),
    bantuanBOS: z.string().transform(Number).pipe(z.number()).optional(),
    bantuanBAPANAS: z.string().transform(Number).pipe(z.number()).optional(),
    bantuanStunting: z.string().transform(Number).pipe(z.number()).optional(),
    bantuanKIS: z.string().transform(Number).pipe(z.number()).optional(),
    bantuanBLT: z.string().transform(Number).pipe(z.number()).optional(),
    bantuanlainnyaStatus: z.string().transform(Number).pipe(z.number()).optional(),
    bantuanlainnyaNama: z.string().transform(Number).pipe(z.number()).optional(),
});

export const createBantuanAction = withUser(
    async (formData: FormData, _user: User): Promise<ActionResponse> => {
        try {
            const result = createBantuanSchema.safeParse(Object.fromEntries(formData));
            
            if (!result.success) {
                return {
                    success: false,
                    error: result.error.issues[0].message,
                };
            }

            const data = result.data;

            const newBantuan = await createBantuan({
                idKeluarga: data.idKeluarga,
                idAnggotaKeluarga: data.idAnggotaKeluarga,
                bantuan1tahunTerakhir: data.bantuan1tahunTerakhir || null,
                bantuanPKH: data.bantuanPKH || null,
                bantuanBPNT: data.bantuanBPNT || null,
                bantuanBOS: data.bantuanBOS || null,
                bantuanBAPANAS: data.bantuanBAPANAS || null,
                bantuanStunting: data.bantuanStunting || null,
                bantuanKIS: data.bantuanKIS || null,
                bantuanBLT: data.bantuanBLT || null,
                bantuanlainnyaStatus: data.bantuanlainnyaStatus || null,
                bantuanlainnyaNama: data.bantuanlainnyaNama || null,
            });

            return {
                success: true,
                message: 'Assistance program created successfully',
                data: newBantuan,
            };
        } catch (error) {
            console.error('Error creating bantuan:', error);
            return {
                success: false,
                error: 'Failed to create assistance program. Please try again.',
            };
        }
    }
);

export const updateBantuanAction = withUser(
    async (formData: FormData, _user: User): Promise<ActionResponse> => {
        try {
            const result = updateBantuanSchema.safeParse(Object.fromEntries(formData));
            
            if (!result.success) {
                return {
                    success: false,
                    error: result.error.issues[0].message,
                };
            }

            const data = result.data;

            const updatedBantuan = await updateBantuan(data.id, {
                idKeluarga: data.idKeluarga,
                idAnggotaKeluarga: data.idAnggotaKeluarga,
                bantuan1tahunTerakhir: data.bantuan1tahunTerakhir || null,
                bantuanPKH: data.bantuanPKH || null,
                bantuanBPNT: data.bantuanBPNT || null,
                bantuanBOS: data.bantuanBOS || null,
                bantuanBAPANAS: data.bantuanBAPANAS || null,
                bantuanStunting: data.bantuanStunting || null,
                bantuanKIS: data.bantuanKIS || null,
                bantuanBLT: data.bantuanBLT || null,
                bantuanlainnyaStatus: data.bantuanlainnyaStatus || null,
                bantuanlainnyaNama: data.bantuanlainnyaNama || null,
            });

            if (!updatedBantuan) {
                return {
                    success: false,
                    error: 'Assistance program not found',
                };
            }

            return {
                success: true,
                message: 'Assistance program updated successfully',
                data: updatedBantuan,
            };
        } catch (error) {
            console.error('Error updating bantuan:', error);
            return {
                success: false,
                error: 'Failed to update assistance program. Please try again.',
            };
        }
    }
);

export const deleteBantuanAction = withUser(
    async (formData: FormData, _user: User): Promise<ActionResponse> => {
        try {
            const bantuanId = Number(formData.get('id'));

            if (!bantuanId) {
                return {
                    success: false,
                    error: 'Assistance program ID is required',
                };
            }

            const deletedBantuan = await deleteBantuan(bantuanId);

            if (!deletedBantuan) {
                return {
                    success: false,
                    error: 'Assistance program not found',
                };
            }

            return {
                success: true,
                message: 'Assistance program deleted successfully',
            };
        } catch (error) {
            console.error('Error deleting bantuan:', error);
            return {
                success: false,
                error: 'Failed to delete assistance program. Please try again.',
            };
        }
    }
);

// ==================== DISABILITAS ACTIONS ====================

const createDisabilitasSchema = z.object({
    idKeluarga: z.string().transform(Number),
    idAnggotaKeluarga: z.string().transform(Number).pipe(z.number().min(1, 'Family member is required')),
    disabilisitas: z.string().optional(),
    tunaDaksa: z.string().optional(),
    tunaWicara: z.string().optional(),
    tunaNetra: z.string().optional(),
    tunaLaras: z.string().optional(),
    tunaLainnyaStatus: z.string().optional(),
    tunaLainnyaNama: z.string().optional(),
});

const updateDisabilitasSchema = z.object({
    id: z.string().transform(Number),
    idKeluarga: z.string().transform(Number),
    idAnggotaKeluarga: z.string().transform(Number).pipe(z.number().min(1, 'Family member is required')),
    disabilisitas: z.string().optional(),
    tunaDaksa: z.string().optional(),
    tunaWicara: z.string().optional(),
    tunaNetra: z.string().optional(),
    tunaLaras: z.string().optional(),
    tunaLainnyaStatus: z.string().optional(),
    tunaLainnyaNama: z.string().optional(),
});

export const createDisabilitasAction = withUser(
    async (formData: FormData, _user: User): Promise<ActionResponse> => {
        try {
            const result = createDisabilitasSchema.safeParse(Object.fromEntries(formData));
            
            if (!result.success) {
                return {
                    success: false,
                    error: result.error.issues[0].message,
                };
            }

            const data = result.data;

            const newDisabilitas = await createDisabilitas({
                idKeluarga: data.idKeluarga,
                idAnggotaKeluarga: data.idAnggotaKeluarga,
                disabilisitas: data.disabilisitas || null,
                tunaDaksa: data.tunaDaksa || null,
                tunaWicara: data.tunaWicara || null,
                tunaNetra: data.tunaNetra || null,
                tunaLaras: data.tunaLaras || null,
                tunaLainnyaStatus: data.tunaLainnyaStatus || null,
                tunaLainnyaNama: data.tunaLainnyaNama || null,
            });

            return {
                success: true,
                message: 'Disability information created successfully',
                data: newDisabilitas,
            };
        } catch (error) {
            console.error('Error creating disabilitas:', error);
            return {
                success: false,
                error: 'Failed to create disability information. Please try again.',
            };
        }
    }
);

export const updateDisabilitasAction = withUser(
    async (formData: FormData, _user: User): Promise<ActionResponse> => {
        try {
            const result = updateDisabilitasSchema.safeParse(Object.fromEntries(formData));
            
            if (!result.success) {
                return {
                    success: false,
                    error: result.error.issues[0].message,
                };
            }

            const data = result.data;

            const updatedDisabilitas = await updateDisabilitas(data.id, {
                idKeluarga: data.idKeluarga,
                idAnggotaKeluarga: data.idAnggotaKeluarga,
                disabilisitas: data.disabilisitas || null,
                tunaDaksa: data.tunaDaksa || null,
                tunaWicara: data.tunaWicara || null,
                tunaNetra: data.tunaNetra || null,
                tunaLaras: data.tunaLaras || null,
                tunaLainnyaStatus: data.tunaLainnyaStatus || null,
                tunaLainnyaNama: data.tunaLainnyaNama || null,
            });

            if (!updatedDisabilitas) {
                return {
                    success: false,
                    error: 'Disability information not found',
                };
            }

            return {
                success: true,
                message: 'Disability information updated successfully',
                data: updatedDisabilitas,
            };
        } catch (error) {
            console.error('Error updating disabilitas:', error);
            return {
                success: false,
                error: 'Failed to update disability information. Please try again.',
            };
        }
    }
);

export const deleteDisabilitasAction = withUser(
    async (formData: FormData, _user: User): Promise<ActionResponse> => {
        try {
            const disabilitasId = Number(formData.get('id'));

            if (!disabilitasId) {
                return {
                    success: false,
                    error: 'Disability information ID is required',
                };
            }

            const deletedDisabilitas = await deleteDisabilitas(disabilitasId);

            if (!deletedDisabilitas) {
                return {
                    success: false,
                    error: 'Disability information not found',
                };
            }

            return {
                success: true,
                message: 'Disability information deleted successfully',
            };
        } catch (error) {
            console.error('Error deleting disabilitas:', error);
            return {
                success: false,
                error: 'Failed to delete disability information. Please try again.',
            };
        }
    }
);
