'use server'
import { getSession, clearSession } from '@/lib/auth/session';
import { db } from '@/lib/db/drizzle';
import { usersTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export interface User {
    id: number;
    nama: string;
    email: string;
    username: string;
    photo: string;
    role: string;
}

export async function logout(): Promise<{ success: boolean }> {
    try {
        await clearSession();
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false };
    }
}

export async function getCurrentUser(): Promise<User | null> {
    try {
        const session = await getSession();

        if (!session) {
            return null;
        }

        const users = await db
            .select({
                id: usersTable.id,
                nama: usersTable.nama,
                email: usersTable.email,
                username: usersTable.username,
                photo: usersTable.photo,
                role: usersTable.role,
            })
            .from(usersTable)
            .where(eq(usersTable.id, session.user.id))
            .limit(1);

        if (users.length === 0) {
            return null;
        }

        return users[0];
    } catch (error) {
        console.error('Get current user error:', error);
        return null;
    }
}

export async function updateProfile(
    formData: FormData
): Promise<{ success: boolean; error?: string }> {
    try {
        const session = await getSession();

        if (!session) {
            return { success: false, error: 'Not authenticated' };
        }

        const nama = formData.get('nama') as string;
        const email = formData.get('email') as string;

        if (!nama || !email) {
            return { success: false, error: 'Name and email are required' };
        }

        await db
            .update(usersTable)
            .set({
                nama,
                email,
                updatedAt: new Date().toISOString().split('T')[0],
            })
            .where(eq(usersTable.id, session.user.id));

        return { success: true };
    } catch (error) {
        console.error('Update profile error:', error);
        return { success: false, error: 'Failed to update profile' };
    }
}
