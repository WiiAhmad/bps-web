'use server';

import { z } from 'zod';
import { validatedActionWithUser, withUser } from '@/lib/auth/middleware';
import {
    getAllKeluargaWithMFD,
    getKeluargaByNomorKK,
    getKeluargaByNomorKKExcludingId,
    createKeluarga,
    updateKeluarga,
    deleteKeluarga,
    hasKeluargaRelatedRecords,
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

const createKeluargaSchema = z.object({
    namaKepalaKeluarga: z.string().min(2, 'Family head name must be at least 2 characters'),
    anggotaKeluarga: z.string().transform(Number).pipe(z.number().min(1, 'Number of family members must be at least 1')),
    nomorKartuKeluarga: z.string().length(16, 'Family card number must be 16 digits').regex(/^\d+$/, 'Must contain only numbers'),
    alamat: z.string().min(10, 'Address must be at least 10 characters'),
    idMFD: z.string().transform(Number).pipe(z.number().min(1, 'MFD location is required')),
    catatan: z.string().optional().default(''),
});

const updateKeluargaSchema = z.object({
    id: z.string().transform(Number),
    namaKepalaKeluarga: z.string().min(2, 'Family head name must be at least 2 characters'),
    anggotaKeluarga: z.string().transform(Number).pipe(z.number().min(1, 'Number of family members must be at least 1')),
    nomorKartuKeluarga: z.string().length(16, 'Family card number must be 16 digits').regex(/^\d+$/, 'Must contain only numbers'),
    alamat: z.string().min(10, 'Address must be at least 10 characters'),
    idMFD: z.string().transform(Number).pipe(z.number().min(1, 'MFD location is required')),
    catatan: z.string().optional().default(''),
});

// ==================== SERVER ACTIONS ====================

/**
 * Get all keluarga records with MFD information
 * - Fetches all keluarga records with joined MFD location data
 * - Used for displaying the main persons page table
 */
export const getKeluargasAction = withUser(
    async (_formData: FormData, _user: User): Promise<{ success: boolean; data?: unknown[]; error?: string }> => {
        try {
            const keluargas = await getAllKeluargaWithMFD();
            return {
                success: true,
                data: keluargas,
            };
        } catch (error) {
            console.error('Error fetching keluarga records:', error);
            return {
                success: false,
                error: 'Failed to fetch family records',
            };
        }
    }
);

/**
 * Create a new keluarga record
 * - Validates input data
 * - Checks for duplicate family card number
 * - Creates keluarga record in database
 */
export const createKeluargaAction = validatedActionWithUser(
    createKeluargaSchema,
    async (data, _formData, _user): Promise<ActionResponse> => {
        try {
            // Check if keluarga with same family card number already exists
            const existingKeluarga = await getKeluargaByNomorKK(data.nomorKartuKeluarga);

            if (existingKeluarga) {
                return {
                    success: false,
                    error: 'Family card number already exists',
                };
            }

            // Create keluarga record
            const newKeluarga = await createKeluarga({
                namaKepalaKeluarga: data.namaKepalaKeluarga,
                anggotaKeluarga: data.anggotaKeluarga,
                nomorKartuKeluarga: data.nomorKartuKeluarga,
                alamat: data.alamat,
                idMFD: data.idMFD,
                catatan: data.catatan,
            });

            return {
                success: true,
                message: 'Family record created successfully',
                data: newKeluarga,
            };
        } catch (error) {
            console.error('Error creating keluarga:', error);
            return {
                success: false,
                error: 'Failed to create family record. Please try again.',
            };
        }
    }
);

/**
 * Update an existing keluarga record
 * - Validates input data
 * - Checks for family card number conflicts (excluding current record)
 * - Updates keluarga record in database
 */
export const updateKeluargaAction = validatedActionWithUser(
    updateKeluargaSchema,
    async (data, _formData, _user): Promise<ActionResponse> => {
        try {
            const keluargaId = data.id;

            // Check if updated family card number conflicts with another keluarga record
            const conflictingKeluarga = await getKeluargaByNomorKKExcludingId(
                data.nomorKartuKeluarga,
                keluargaId
            );

            if (conflictingKeluarga) {
                return {
                    success: false,
                    error: 'Family card number already exists',
                };
            }

            // Update keluarga record
            const updatedKeluarga = await updateKeluarga(keluargaId, {
                namaKepalaKeluarga: data.namaKepalaKeluarga,
                anggotaKeluarga: data.anggotaKeluarga,
                nomorKartuKeluarga: data.nomorKartuKeluarga,
                alamat: data.alamat,
                idMFD: data.idMFD,
                catatan: data.catatan,
            });

            if (!updatedKeluarga) {
                return {
                    success: false,
                    error: 'Family record not found',
                };
            }

            return {
                success: true,
                message: 'Family record updated successfully',
                data: updatedKeluarga,
            };
        } catch (error) {
            console.error('Error updating keluarga:', error);
            return {
                success: false,
                error: 'Failed to update family record. Please try again.',
            };
        }
    }
);

/**
 * Delete a keluarga record
 * - Checks for related records (anggota keluarga, ket petugas, etc.)
 * - Prevents deletion if related records exist
 * - Performs deletion if no dependencies exist
 */
export const deleteKeluargaAction = withUser(
    async (formData: FormData, _user: User): Promise<ActionResponse> => {
        try {
            const keluargaId = Number(formData.get('id'));

            if (!keluargaId) {
                return {
                    success: false,
                    error: 'Family ID is required',
                };
            }

            // Check if any related records exist
            const hasRelatedRecords = await hasKeluargaRelatedRecords(keluargaId);

            if (hasRelatedRecords) {
                return {
                    success: false,
                    error: 'Cannot delete family record that has associated data',
                };
            }

            // Perform deletion
            const deletedKeluarga = await deleteKeluarga(keluargaId);

            if (!deletedKeluarga) {
                return {
                    success: false,
                    error: 'Family record not found',
                };
            }

            return {
                success: true,
                message: 'Family record deleted successfully',
            };
        } catch (error) {
            console.error('Error deleting keluarga:', error);
            return {
                success: false,
                error: 'Failed to delete family record. Please try again.',
            };
        }
    }
);
