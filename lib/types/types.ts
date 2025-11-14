import { LucideIcon } from 'lucide-react';

/**
 * Represents a user in the system
 * 
 * @example
 * ```typescript
 * const user: User = {
 *   id: 1,
 *   nama: 'John Doe',
 *   email: 'john@example.com',
 *   username: 'johndoe',
 *   photo: '/avatars/john.jpg',
 *   role: 'admin'
 * };
 * ```
 */
export interface User {
    /** Unique user identifier */
    id: number;
    /** User's full name */
    nama: string;
    /** User's email address */
    email: string;
    /** User's username for login */
    username: string;
    /** URL to user's profile photo */
    photo: string;
    /** User's role (e.g., 'admin', 'user') */
    role: string;
}

/**
 * Standard response format for server actions
 * 
 * This type provides a consistent structure for all server action responses,
 * including success/error states and optional messages.
 * 
 * @example
 * ```typescript
 * // Success response
 * const response: ActionState = {
 *   success: true,
 *   message: 'Operation completed successfully'
 * };
 * 
 * // Error response
 * const errorResponse: ActionState = {
 *   success: false,
 *   error: 'Something went wrong'
 * };
 * ```
 */
export interface ActionState {
    /** Indicates if the action was successful */
    success?: boolean | string;
    /** Error message if action failed */
    error?: string;
    /** Success message if action succeeded */
    message?: string;
    /** Additional data returned by the action */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

/**
 * Sub-menu item configuration for nested navigation
 * 
 * @example
 * ```typescript
 * const subItem: NavSubItem = {
 *   title: 'Add Family',
 *   href: '/dashboard/keluarga/tambah'
 * };
 * ```
 */
export interface NavSubItem {
    /** Display title of the sub-menu item */
    title: string;
    /** Route path */
    href: string;
}

/**
 * Navigation item configuration for sidebar menu
 * 
 * Supports both simple menu items and items with nested sub-menus.
 * 
 * @example
 * ```typescript
 * // Simple menu item
 * const simpleItem: NavItem = {
 *   title: 'Dashboard',
 *   href: '/dashboard',
 *   icon: LayoutDashboard
 * };
 * 
 * // Menu item with sub-items
 * const itemWithSub: NavItem = {
 *   title: 'Data Keluarga',
 *   href: '/dashboard/keluarga',
 *   icon: Users,
 *   items: [
 *     { title: 'Daftar Keluarga', href: '/dashboard/keluarga' },
 *     { title: 'Tambah Keluarga', href: '/dashboard/keluarga/tambah' }
 *   ]
 * };
 * ```
 */
export interface NavItem {
    /** Display title of the menu item */
    title: string;
    /** Route path */
    href: string;
    /** Lucide icon component */
    icon: LucideIcon;
    /** Optional badge text or count to display next to the menu item */
    badge?: string | number;
    /** Optional sub-menu items for nested navigation */
    items?: NavSubItem[];
}
