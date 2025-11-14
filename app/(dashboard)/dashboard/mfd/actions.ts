'use server';

import { z } from 'zod';
import { validatedActionWithUser, withUser } from '@/lib/auth/middleware';
import {
    createMFD,
    updateMFD,
    deleteMFD,
    getMFDByKode,
    getAllMFD,
    getKeluargaByMFD,
} from '@/lib/db/query';
import { and, ne } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { tableMFD, type User } from '@/lib/db/schema';

// ==================== TYPES ====================

type ActionResponse = {
    success: boolean;
    error?: string;
    message?: string;
    data?: unknown;
};

// ==================== VALIDATION SCHEMAS ====================

const createMFDSchema = z.object({
    namaProvinsi: z.string().min(2, 'Province name must be at least 2 characters'),
    kodeProvinsi: z.string().min(1, 'Province code is required'),
    namaKabupaten: z.string().min(2, 'District name must be at least 2 characters'),
    kodeKabupaten: z.string().min(1, 'District code is required'),
    namaKecamatan: z.string().min(2, 'Sub-district name must be at least 2 characters'),
    kodeKecamatan: z.string().min(1, 'Sub-district code is required'),
    namaDesa: z.string().min(2, 'Village name must be at least 2 characters'),
    kodeDesa: z.string().min(1, 'Village code is required'),
    namaDusun: z.string().min(2, 'Hamlet name must be at least 2 characters'),
    kodeDusun: z.string().min(1, 'Hamlet code is required'),
    namaSLS: z.string().min(2, 'SLS name must be at least 2 characters'),
    kodeSLS: z.string().min(1, 'SLS code is required'),
    namaSubSLS: z.string().min(2, 'Sub-SLS name must be at least 2 characters'),
    kodeSubSLS: z.string().min(1, 'Sub-SLS code is required'),
});

const updateMFDSchema = z.object({
    id: z.string().transform(Number),
    namaProvinsi: z.string().min(2, 'Province name must be at least 2 characters'),
    kodeProvinsi: z.string().min(1, 'Province code is required'),
    namaKabupaten: z.string().min(2, 'District name must be at least 2 characters'),
    kodeKabupaten: z.string().min(1, 'District code is required'),
    namaKecamatan: z.string().min(2, 'Sub-district name must be at least 2 characters'),
    kodeKecamatan: z.string().min(1, 'Sub-district code is required'),
    namaDesa: z.string().min(2, 'Village name must be at least 2 characters'),
    kodeDesa: z.string().min(1, 'Village code is required'),
    namaDusun: z.string().min(2, 'Hamlet name must be at least 2 characters'),
    kodeDusun: z.string().min(1, 'Hamlet code is required'),
    namaSLS: z.string().min(2, 'SLS name must be at least 2 characters'),
    kodeSLS: z.string().min(1, 'SLS code is required'),
    namaSubSLS: z.string().min(2, 'Sub-SLS name must be at least 2 characters'),
    kodeSubSLS: z.string().min(1, 'Sub-SLS code is required'),
});

// ==================== SERVER ACTIONS ====================

/**
 * Create a new MFD record
 * - Validates input data
 * - Checks for code combination uniqueness (kodeDesa, kodeDusun, kodeSLS, kodeSubSLS)
 * - Creates MFD record in database
 */
export const createMFDAction = validatedActionWithUser(
    createMFDSchema,
    async (data, _formData, _user): Promise<ActionResponse> => {
        try {
            // Check if MFD with same code combination already exists
            const existingMFD = await getMFDByKode(
                data.kodeDesa,
                data.kodeDusun,
                data.kodeSLS,
                data.kodeSubSLS
            );

            if (existingMFD) {
                return {
                    success: false,
                    error: 'MFD record with this code combination already exists',
                };
            }

            // Create MFD record
            const newMFD = await createMFD({
                namaProvinsi: data.namaProvinsi,
                kodeProvinsi: data.kodeProvinsi,
                namaKabupaten: data.namaKabupaten,
                kodeKabupaten: data.kodeKabupaten,
                namaKecamatan: data.namaKecamatan,
                kodeKecamatan: data.kodeKecamatan,
                namaDesa: data.namaDesa,
                kodeDesa: data.kodeDesa,
                namaDusun: data.namaDusun,
                kodeDusun: data.kodeDusun,
                namaSLS: data.namaSLS,
                kodeSLS: data.kodeSLS,
                namaSubSLS: data.namaSubSLS,
                kodeSubSLS: data.kodeSubSLS,
            });

            return {
                success: true,
                message: 'MFD record created successfully',
                data: newMFD,
            };
        } catch (error) {
            console.error('Error creating MFD:', error);
            return {
                success: false,
                error: 'Failed to create MFD record. Please try again.',
            };
        }
    }
);

/**
 * Update an existing MFD record
 * - Validates input data
 * - Checks for code combination conflicts (excluding current record)
 * - Updates MFD record in database
 */
export const updateMFDAction = validatedActionWithUser(
    updateMFDSchema,
    async (data, _formData, _user): Promise<ActionResponse> => {
        try {
            const mfdId = data.id;

            // Check if updated code combination conflicts with another MFD record
            const codeConflict = await db
                .select()
                .from(tableMFD)
                .where(
                    and(
                        ne(tableMFD.id, mfdId)
                    )
                );

            // Filter for exact code match
            const conflictingMFD = codeConflict.find(
                (mfd) =>
                    mfd.kodeDesa === data.kodeDesa &&
                    mfd.kodeDusun === data.kodeDusun &&
                    mfd.kodeSLS === data.kodeSLS &&
                    mfd.kodeSubSLS === data.kodeSubSLS
            );

            if (conflictingMFD) {
                return {
                    success: false,
                    error: 'MFD record with this code combination already exists',
                };
            }

            // Update MFD record
            const updatedMFD = await updateMFD(mfdId, {
                namaProvinsi: data.namaProvinsi,
                kodeProvinsi: data.kodeProvinsi,
                namaKabupaten: data.namaKabupaten,
                kodeKabupaten: data.kodeKabupaten,
                namaKecamatan: data.namaKecamatan,
                kodeKecamatan: data.kodeKecamatan,
                namaDesa: data.namaDesa,
                kodeDesa: data.kodeDesa,
                namaDusun: data.namaDusun,
                kodeDusun: data.kodeDusun,
                namaSLS: data.namaSLS,
                kodeSLS: data.kodeSLS,
                namaSubSLS: data.namaSubSLS,
                kodeSubSLS: data.kodeSubSLS,
            });

            if (!updatedMFD) {
                return {
                    success: false,
                    error: 'MFD record not found',
                };
            }

            return {
                success: true,
                message: 'MFD record updated successfully',
                data: updatedMFD,
            };
        } catch (error) {
            console.error('Error updating MFD:', error);
            return {
                success: false,
                error: 'Failed to update MFD record. Please try again.',
            };
        }
    }
);

/**
 * Delete an MFD record
 * - Checks for family references before deletion
 * - Prevents deletion if family records exist
 * - Performs hard delete if no references exist
 */
export const deleteMFDAction = withUser(
    async (formData: FormData, _user: User): Promise<ActionResponse> => {
        try {
            const mfdId = Number(formData.get('id'));

            if (!mfdId) {
                return {
                    success: false,
                    error: 'MFD ID is required',
                };
            }

            // Check if any family records reference this MFD
            const familyRecords = await getKeluargaByMFD(mfdId);

            if (familyRecords && familyRecords.length > 0) {
                return {
                    success: false,
                    error: 'Cannot delete MFD record that has associated family records',
                };
            }

            // Perform deletion
            const deletedMFD = await deleteMFD(mfdId);

            if (!deletedMFD) {
                return {
                    success: false,
                    error: 'MFD record not found',
                };
            }

            return {
                success: true,
                message: 'MFD record deleted successfully',
            };
        } catch (error) {
            console.error('Error deleting MFD:', error);
            return {
                success: false,
                error: 'Failed to delete MFD record. Please try again.',
            };
        }
    }
);

/**
 * Get all MFD records
 * - Used for client-side display and filtering
 * - Returns all MFD records from database
 */
export const getMFDsAction = withUser(
    async (_formData: FormData, _user: User): Promise<{ success: boolean; data?: unknown[]; error?: string }> => {
        try {
            const mfds = await getAllMFD();
            return {
                success: true,
                data: mfds,
            };
        } catch (error) {
            console.error('Error fetching MFDs:', error);
            return {
                success: false,
                error: 'Failed to fetch MFD records',
            };
        }
    }
);
