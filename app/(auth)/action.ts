'use server'

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { validatedAction, type ActionState } from '@/lib/auth/middleware';
import { hashPassword, comparePasswords, setSession } from '@/lib/auth/session';
import { getUserByEmail, getUserByUsername, createUser } from '@/lib/db/query';

// Validation schemas
const signUpSchema = z.object({
    nama: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    tanggal_lahir: z.string().min(1, 'Birth date is required'),
    NoTelpon: z.string().min(10, 'Phone number must be at least 10 characters'),
    alamat: z.string().min(5, 'Address must be at least 5 characters'),
});

const signInSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

// Sign up action
export const signUp = validatedAction(signUpSchema, async (data, formData): Promise<ActionState> => {
    try {
        // Check if user already exists by email
        const existingUserByEmail = await getUserByEmail(data.email);
        if (existingUserByEmail) {
            return { error: 'Email already registered' };
        }

        // Check if username already exists
        const existingUserByUsername = await getUserByUsername(data.username);
        if (existingUserByUsername) {
            return { error: 'Username already taken' };
        }

        // Hash password
        const hashedPassword = await hashPassword(data.password);

        // Create user
        const newUser = await createUser({
            nama: data.nama,
            email: data.email,
            username: data.username,
            password: hashedPassword,
            tanggal_lahir: data.tanggal_lahir,
            NoTelpon: data.NoTelpon,
            alamat: data.alamat,
            photo: '', // Default empty photo
            role: 'user', // Default role
            isVerified: 0,
            deleted: 0,
        });

        // Set session
        await setSession(newUser);
    } catch (error) {
        console.error('Sign up error:', error);
        return { error: 'An error occurred during sign up' };
    }

    // Redirect to dashboard (must be outside try/catch)
    redirect('/dashboard');
});

// Sign in action
export const signIn = validatedAction(signInSchema, async (data, formData): Promise<ActionState> => {
    try {
        // Get user by email
        const user = await getUserByEmail(data.email);

        if (!user) {
            return { error: 'Invalid email or password' };
        }

        // Check if user is deleted
        if (user.deleted === 1) {
            return { error: 'Account has been deactivated' };
        }

        // Verify password
        const isValidPassword = await comparePasswords(data.password, user.password);
        if (!isValidPassword) {
            return { error: 'Invalid email or password' };
        }

        // Set session
        await setSession(user);
    } catch (error) {
        console.error('Sign in error:', error);
        return { error: 'An error occurred during sign in' };
    }

    // Redirect to dashboard (must be outside try/catch)
    redirect('/dashboard');
});

// Sign out action
export async function signOut() {
    const { clearSession } = await import('@/lib/auth/session');
    await clearSession();
    redirect('/sign-in');
}
