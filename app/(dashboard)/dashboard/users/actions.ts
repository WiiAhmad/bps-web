'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { validatedActionWithUser, withUser, type ActionState } from '@/lib/auth/middleware';
import {
    createUser,
    updateUser,
    deleteUser,
    getUserByEmail,
    getAllUsers,
} from '@/lib/db/query';
import { eq, and, ne } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { usersTable, type User } from '@/lib/db/schema';

// ==================== TYPES ====================

type ActionResponse = {
    success: boolean;
    error?: string;
    message?: string;
    data?: User;
};

// ==================== VALIDATION SCHEMAS ====================

const createUserSchema = z.object({
    nama: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    NoTelpon: z.string().min(1, 'Phone number is required'),
    tanggal_lahir: z.string().min(1, 'Date of birth is required'),
    alamat: z.string().min(1, 'Address is required'),
    role: z.enum(['user', 'admin']),
});

const updateUserSchema = z.object({
    id: z.string().transform(Number),
    nama: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
    NoTelpon: z.string().min(1, 'Phone number is required'),
    tanggal_lahir: z.string().min(1, 'Date of birth is required'),
    alamat: z.string().min(1, 'Address is required'),
    role: z.enum(['user', 'admin']),
});

// ==================== SERVER ACTIONS ====================

/**
 * Create a new user account
 * - Validates input data
 * - Checks for email uniqueness
 * - Hashes password before storage
 */
export const createUserAction = validatedActionWithUser(
    createUserSchema,
    async (data, _formData, _user): Promise<ActionResponse> => {
        try {
            // Check if email already exists
            const existingUser = await getUserByEmail(data.email);
            if (existingUser) {
                return {
                    success: false,
                    error: 'Email already exists',
                };
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(data.password, 10);

            // Create user with default values
            const newUser = await createUser({
                nama: data.nama,
                email: data.email,
                username: data.username,
                password: hashedPassword,
                photo: '', // Default empty photo
                tanggal_lahir: data.tanggal_lahir,
                NoTelpon: data.NoTelpon,
                role: data.role,
                alamat: data.alamat,
                isVerified: 0,
                deleted: 0,
            });

            return {
                success: true,
                message: 'User created successfully',
                data: newUser,
            };
        } catch (error) {
            console.error('Error creating user:', error);
            return {
                success: false,
                error: 'Failed to create user. Please try again.',
            };
        }
    }
);

/**
 * Update an existing user account
 * - Validates input data
 * - Checks for email conflicts (excluding current user)
 * - Optionally updates password if provided
 */
export const updateUserAction = validatedActionWithUser(
    updateUserSchema,
    async (data, _formData, _user): Promise<ActionResponse> => {
        try {
            const userId = data.id;

            // Check if new email conflicts with another user
            const emailConflict = await db
                .select()
                .from(usersTable)
                .where(
                    and(
                        eq(usersTable.email, data.email),
                        ne(usersTable.id, userId)
                    )
                );

            if (emailConflict.length > 0) {
                return {
                    success: false,
                    error: 'Email already exists',
                };
            }

            // Prepare update data
            const updateData: Record<string, unknown> = {
                nama: data.nama,
                email: data.email,
                username: data.username,
                NoTelpon: data.NoTelpon,
                tanggal_lahir: data.tanggal_lahir,
                alamat: data.alamat,
                role: data.role,
            };

            // Only update password if provided
            if (data.password && data.password.trim() !== '') {
                const hashedPassword = await bcrypt.hash(data.password, 10);
                updateData.password = hashedPassword;
            }

            // Update user
            const updatedUser = await updateUser(userId, updateData);

            if (!updatedUser) {
                return {
                    success: false,
                    error: 'User not found',
                };
            }

            return {
                success: true,
                message: 'User updated successfully',
                data: updatedUser,
            };
        } catch (error) {
            console.error('Error updating user:', error);
            return {
                success: false,
                error: 'Failed to update user. Please try again.',
            };
        }
    }
);

/**
 * Soft delete a user account
 * - Prevents self-deletion
 * - Sets deleted flag to 1
 */
export const deleteUserAction = withUser(
    async (formData: FormData, user: User): Promise<ActionResponse> => {
        try {
            const userId = Number(formData.get('id'));

            if (!userId) {
                return {
                    success: false,
                    error: 'User ID is required',
                };
            }

            // Prevent self-deletion
            if (userId === user.id) {
                return {
                    success: false,
                    error: 'You cannot delete your own account',
                };
            }

            // Perform soft delete
            const deletedUser = await deleteUser(userId);

            if (!deletedUser) {
                return {
                    success: false,
                    error: 'User not found',
                };
            }

            return {
                success: true,
                message: 'User deleted successfully',
            };
        } catch (error) {
            console.error('Error deleting user:', error);
            return {
                success: false,
                error: 'Failed to delete user. Please try again.',
            };
        }
    }
);

/**
 * Get all non-deleted users
 * - Used for client-side refresh after operations
 */
export const getUsersAction = withUser(
    async (_formData: FormData, _user: User): Promise<{ success: boolean; data?: User[]; error?: string }> => {
        try {
            const users = await getAllUsers();
            return {
                success: true,
                data: users,
            };
        } catch (error) {
            console.error('Error fetching users:', error);
            return {
                success: false,
                error: 'Failed to fetch users',
            };
        }
    }
);
