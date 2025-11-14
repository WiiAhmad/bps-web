# Dashboard Sidebar Design Document

## Overview

This design document outlines the implementation of a modern, responsive dashboard layout with a collapsible sidebar navigation system. The solution leverages shadcn/ui's Sidebar component as the foundation, enhanced with Magic UI effects for visual appeal. The dashboard will be implemented in the `app/(dashboard)/dashboard` route group with proper authentication guards.

## Architecture

### Component Hierarchy

```
lib/
├── types/
│   └── types.ts            # Centralized type definitions (User, ActionState, NavItem)
├── auth/
│   ├── session.ts          # Session management (getSession, setSession, clearSession)
│   └── middleware.ts       # Auth middleware (withUser, validatedActionWithUser)
└── db/
    ├── drizzle.ts          # Database connection
    ├── schema.ts           # Database schema
    └── query.ts            # Database queries

app/(dashboard)/
├── dashboard/
│   ├── layout.tsx          # Dashboard layout with sidebar (uses User type)
│   ├── page.tsx            # Main dashboard content (uses User type)
│   └── [feature]/          # Feature-specific pages
│       └── page.tsx
├── action.ts               # Dashboard server actions (uses middleware & types)
└── components/
    ├── app-sidebar.tsx     # Main sidebar component (uses User type)
    ├── user-profile-dialog.tsx  # User profile dialog (uses User type)
    └── nav-items.tsx       # Navigation configuration (uses NavItem type)
```

### Technology Stack

- **shadcn/ui Sidebar**: Base sidebar component with built-in collapsible functionality
- **shadcn/ui Dialog**: Modal dialog for user profile interactions
- **Magic UI**: Visual enhancements (shimmer-button, animated-gradient-text)
- **Lucide Icons**: Icon library for menu items
- **Next.js App Router**: Routing and navigation
- **TypeScript**: Type safety for configuration and props

## Components and Interfaces

### 1. Dashboard Layout (`app/(dashboard)/dashboard/layout.tsx`)

**Purpose**: Root layout for the dashboard that wraps all dashboard pages with the sidebar.

**Key Features**:

- Authentication guard using `getSession()` from `lib/auth/session.ts`
- Redirect unauthenticated users to sign-in page
- Render `SidebarProvider` and `AppSidebar` components
- Provide main content area with proper spacing

**Implementation Details**:

```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Server component that checks authentication
// Fetches user data from session
// Renders SidebarProvider with AppSidebar and main content
```

### 2. App Sidebar Component (`app/(dashboard)/components/app-sidebar.tsx`)

**Purpose**: Main sidebar navigation component with menu items and user profile.

**Structure**:

- **SidebarHeader**: Logo and application branding
- **SidebarContent**: Scrollable menu items area
- **SidebarFooter**: User profile section with dialog trigger

**Key Features**:

- Uses shadcn/ui Sidebar primitives (SidebarMenu, SidebarMenuItem, SidebarMenuButton)
- Supports nested sub-menus with SidebarMenuSub
- Displays active route highlighting
- Responsive behavior (drawer on mobile, fixed on desktop)
- Smooth collapse/expand transitions

**Props Interface**:

```typescript
interface AppSidebarProps {
  user: {
    id: number;
    nama: string;
    email: string;
    photo?: string;
    role: string;
  };
}
```

### 3. Navigation Configuration (`app/(dashboard)/components/nav-items.tsx`)

**Purpose**: Centralized configuration for menu items.

**Structure**:

```typescript
interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  items?: NavSubItem[];
}

interface NavSubItem {
  title: string;
  href: string;
}

// Primary navigation items
export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
    badge: "3",
  },
  {
    title: "Access Control",
    href: "/dashboard/access-control",
    icon: Shield,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

// Bottom navigation items for secondary actions
export const bottomNavItems: NavItem[] = [
  {
    title: "Help & Support",
    href: "/dashboard/help",
    icon: HelpCircle,
  },
];
```

### 4. User Profile Dialog (`app/(dashboard)/components/user-profile-dialog.tsx`)

**Purpose**: Modal dialog for user account actions.

**Key Features**:

- Display user information (name, email, role)
- Avatar display with fallback initials
- Account settings link
- Logout button with server action
- Uses shadcn/ui Dialog component

**Props Interface**:

```typescript
interface UserProfileDialogProps {
  user: {
    nama: string;
    email: string;
    photo?: string;
    role: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

### 5. Dashboard Server Actions (`app/(dashboard)/action.ts`)

**Purpose**: Server-side functions for dashboard operations.

**Functions**:

```typescript
'use server'

// Logout user and clear session
export async function logout(): Promise<{ success: boolean }>;

// Get current user data from session
export async function getCurrentUser(): Promise<User | null>;

// Update user profile
export async function updateProfile(
  formData: FormData
): Promise<{ success: boolean; error?: string }>;
```

## Data Models

### User Session Data

The dashboard relies on the existing user session from `lib/auth/session.ts`:

```typescript
type SessionData = {
  user: { id: number };
  exp: number;
  iat: number;
};
```

### User Data from Database

Retrieved from `usersTable` schema:

```typescript
interface User {
  id: number;
  nama: string;
  email: string;
  username: string;
  photo: string;
  role: string;
  // ... other fields
}
```

## Styling and Visual Design

### Theme Integration

- Use CSS variables from `app/globals.css` for consistent theming
- Leverage Tailwind utility classes for responsive design
- Apply shadcn/ui design tokens for sidebar styling

### Responsive Breakpoints

- **Mobile (< 768px)**: Sidebar as overlay drawer with backdrop
- **Tablet/Desktop (≥ 768px)**: Fixed sidebar with collapse functionality

### Visual Enhancements

1. **Sidebar Header**:
   - Application logo with animated gradient text (Magic UI)
   - Smooth fade-in animation on load

2. **Menu Items**:
   - Hover effects with background color transition
   - Active state with accent color and border indicator
   - Icon and text alignment with proper spacing

3. **User Profile Section**:
   - Avatar with shimmer effect on hover (Magic UI shimmer-button)
   - Smooth dialog open/close animations
   - Backdrop blur effect

### Color Scheme

```css
/* Sidebar colors using CSS variables */
--sidebar-background: hsl(var(--background));
--sidebar-foreground: hsl(var(--foreground));
--sidebar-accent: hsl(var(--accent));
--sidebar-accent-foreground: hsl(var(--accent-foreground));
--sidebar-border: hsl(var(--border));
```

## State Management

### Sidebar Collapse State

- Managed by shadcn/ui `SidebarProvider` context
- Persisted in localStorage with key `sidebar:state`
- Accessible via `useSidebar()` hook

### Dialog State

- Local state in parent component using `useState`
- Controlled by `open` and `onOpenChange` props

### Active Route

- Determined using Next.js `usePathname()` hook
- Compared against menu item `href` values
- Applied to highlight current navigation item

## Navigation Flow

### Route Structure

```
/dashboard                    # Main dashboard overview
/dashboard/keluarga          # Family data list
/dashboard/keluarga/tambah   # Add family form
/dashboard/keluarga/[id]     # Family detail view
/dashboard/mfd               # MFD data management
/dashboard/laporan           # Reports section
/dashboard/pengaturan        # Settings page
```

### Authentication Flow

1. User accesses `/dashboard/*` route
2. Layout checks session using `getSession()`
3. If no session: redirect to `/sign-in`
4. If session exists: fetch user data and render dashboard
5. User data passed to `AppSidebar` component

### Logout Flow

1. User clicks profile section in sidebar footer
2. Dialog opens with user information
3. User clicks "Logout" button
4. `logout()` server action called
5. Session cleared using `clearSession()`
6. User redirected to home page

## Error Handling

### Authentication Errors

- **No Session**: Redirect to `/sign-in` with return URL
- **Invalid Token**: Clear session and redirect to `/sign-in`
- **Expired Session**: Show toast notification and redirect

### Navigation Errors

- **404 Routes**: Display "Page Not Found" in main content area
- **Permission Errors**: Show "Access Denied" message for role-restricted routes

### Server Action Errors

```typescript
// Error response format
interface ActionResponse {
  success: boolean;
  error?: string;
  data?: any;
}

// Example error handling
try {
  const result = await logout();
  if (!result.success) {
    toast.error("Failed to logout");
  }
} catch (error) {
  toast.error("An unexpected error occurred");
}
```

## Testing Strategy

### Component Testing

1. **AppSidebar Component**:
   - Renders all menu items correctly
   - Highlights active route
   - Toggles collapse state
   - Displays user information in footer
   - Opens profile dialog on click

2. **UserProfileDialog Component**:
   - Displays user data correctly
   - Calls logout action on button click
   - Closes on backdrop click
   - Handles keyboard navigation (Escape key)

3. **Dashboard Layout**:
   - Redirects unauthenticated users
   - Fetches and passes user data
   - Renders children components

### Integration Testing

1. **Navigation Flow**:
   - Click menu items and verify route changes
   - Verify active state updates on navigation
   - Test sub-menu expand/collapse

2. **Authentication Flow**:
   - Test logout functionality
   - Verify session clearing
   - Test redirect after logout

3. **Responsive Behavior**:
   - Test sidebar drawer on mobile
   - Test fixed sidebar on desktop
   - Verify collapse functionality

### Accessibility Testing

- Keyboard navigation through menu items
- Screen reader compatibility
- Focus management in dialog
- ARIA labels and roles
- Color contrast ratios

## Performance Considerations

### Optimization Strategies

1. **Server Components**: Use server components for layout and static content
2. **Client Components**: Only mark interactive components as client components
3. **Code Splitting**: Lazy load dialog component
4. **Icon Optimization**: Use tree-shakeable lucide-react icons
5. **CSS**: Leverage Tailwind's JIT compiler for minimal CSS bundle

### Loading States

- Skeleton loader for sidebar during initial load
- Suspense boundaries for async user data fetching
- Loading spinner for logout action

## Security Considerations

### Authentication

- All dashboard routes protected by session check
- JWT tokens validated on every request
- HttpOnly cookies prevent XSS attacks
- Secure flag enabled in production

### Authorization

- Role-based access control for admin features
- Server-side validation of user permissions
- Protected server actions with session verification

### Data Protection

- User data fetched server-side only
- No sensitive data exposed to client
- Proper error messages without leaking information

## Implementation Notes

### Dependencies Required

```json
{
  "dependencies": {
    "lucide-react": "^0.index",
    "@radix-ui/react-dialog": "^1.0.0",
    "next": "^15.0.0",
    "react": "^19.0.0"
  }
}
```

### shadcn/ui Components to Add

```bash
npx shadcn@latest add sidebar
npx shadcn@latest add dialog
npx shadcn@latest add avatar
npx shadcn@latest add button
npx shadcn@latest add separator
```

### Magic UI Components to Add

```bash
npx shadcn@latest add @magicui/shimmer-button
npx shadcn@latest add @magicui/animated-gradient-text
```

### File Creation Order

1. Navigation configuration (`nav-items.tsx`)
2. User profile dialog (`user-profile-dialog.tsx`)
3. App sidebar component (`app-sidebar.tsx`)
4. Dashboard server actions (`action.ts`)
5. Dashboard layout (`layout.tsx`)
6. Dashboard page (`page.tsx`)

## Code Refactoring Design

### Type Definitions Centralization

**File: `lib/types/types.ts`**

This file will contain all shared type definitions used across the dashboard and authentication system.

```typescript
/**
 * Represents a user in the system
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
 */
export interface ActionState {
  /** Indicates if the action was successful */
  success?: boolean;
  /** Error message if action failed */
  error?: string;
  /** Success message if action succeeded */
  message?: string;
  /** Additional data returned by the action */
  [key: string]: any;
}

/**
 * Navigation item configuration
 */
export interface NavItem {
  /** Display title of the menu item */
  title: string;
  /** Route path */
  href: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Optional badge text or count */
  badge?: string | number;
  /** Optional sub-menu items */
  items?: NavSubItem[];
}

/**
 * Sub-menu item configuration
 */
export interface NavSubItem {
  /** Display title of the sub-menu item */
  title: string;
  /** Route path */
  href: string;
}
```

### Refactored Server Actions

**File: `app/(dashboard)/action.ts`**

The server actions will be refactored to use the authentication middleware utilities:

```typescript
'use server'

import { z } from 'zod';
import { db } from '@/lib/db/drizzle';
import { usersTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { clearSession } from '@/lib/auth/session';
import { withUser, validatedActionWithUser } from '@/lib/auth/middleware';
import type { User, ActionState } from '@/lib/types/types';

/**
 * Get the current authenticated user
 * Uses withUser middleware to ensure authentication
 */
export const getCurrentUser = withUser(async (formData, user) => {
  return user;
});

/**
 * Validation schema for profile updates
 */
const updateProfileSchema = z.object({
  nama: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

/**
 * Update user profile
 * Uses validatedActionWithUser for authentication and validation
 */
export const updateProfile = validatedActionWithUser(
  updateProfileSchema,
  async (data, formData, user): Promise<ActionState> => {
    try {
      await db
        .update(usersTable)
        .set({
          nama: data.nama,
          email: data.email,
          updatedAt: new Date().toISOString().split('T')[0],
        })
        .where(eq(usersTable.id, user.id));

      return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  }
);

/**
 * Logout the current user
 */
export async function logout(): Promise<ActionState> {
  try {
    await clearSession();
    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'Failed to logout' };
  }
}
```

### Component Type Updates

**AppSidebar Component**

```typescript
import type { User } from '@/lib/types/types';

interface AppSidebarProps {
  user: User;
}

export function AppSidebar({ user }: AppSidebarProps) {
  // Component implementation remains the same
}
```

**UserProfileDialog Component**

```typescript
import type { User } from '@/lib/types/types';

interface UserProfileDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileDialog({ user, open, onOpenChange }: UserProfileDialogProps) {
  // Component implementation remains the same
}
```

### Middleware Usage Patterns

#### Pattern 1: Simple Authentication Check

Use `withUser` when you only need to ensure the user is authenticated:

```typescript
export const someAction = withUser(async (formData, user) => {
  // user is guaranteed to be authenticated
  // Access user.id, user.email, etc.
  return { success: true };
});
```

#### Pattern 2: Authentication + Validation

Use `validatedActionWithUser` when you need both authentication and form validation:

```typescript
const schema = z.object({
  field: z.string().min(1),
});

export const someAction = validatedActionWithUser(
  schema,
  async (data, formData, user) => {
    // data is validated against schema
    // user is authenticated
    return { success: true };
  }
);
```

#### Pattern 3: Form Actions with Validation

Use `validatedAction` for form actions that don't require authentication:

```typescript
const schema = z.object({
  email: z.string().email(),
});

export const someAction = validatedAction(
  schema,
  async (data, formData) => {
    // data is validated
    // no user authentication required
    return { success: true };
  }
);
```

### Benefits of Refactoring

1. **DRY Principle**: Eliminates duplicate authentication and validation code
2. **Type Safety**: Centralized types ensure consistency across the application
3. **Maintainability**: Changes to types or middleware affect all usages automatically
4. **Readability**: Clear separation of concerns with middleware wrappers
5. **Error Handling**: Consistent error handling through middleware
6. **Testing**: Easier to test with standardized patterns

### Migration Strategy

1. Create `lib/types/types.ts` with all type definitions
2. Update `app/(dashboard)/action.ts` to use middleware utilities
3. Update components to import types from centralized location
4. Test all functionality to ensure backward compatibility
5. Remove old type definitions and duplicate code

## Authentication Redirect Bug Fix

### Problem

The current authentication system has a critical bug where redirects after successful sign-in and sign-up are not working. The error message shows:

```
Error: NEXT_REDIRECT
at <unknown> (app\(auth)\action.ts:94:17)
{digest: 'NEXT_REDIRECT;push;/dashboard;307;'}
```

### Root Cause

The `redirect()` function from Next.js throws a special `NEXT_REDIRECT` error internally to perform the redirect. When called inside a `try/catch` block, this error is caught and prevents the redirect from executing properly.

### Solution

According to Next.js documentation, `redirect()` must be called **outside** of `try/catch` blocks. The authentication actions need to be refactored to:

1. Handle all business logic and error cases inside the try/catch
2. Return early with error messages for validation failures
3. Call `redirect()` after the try/catch block completes successfully

### Implementation Pattern

**Before (Broken):**
```typescript
export const signIn = validatedAction(signInSchema, async (data, formData): Promise<ActionState> => {
    try {
        // ... validation and authentication logic ...
        await setSession(user);
        
        // ❌ This is caught by the catch block
        redirect('/dashboard');
    } catch (error) {
        console.error('Sign in error:', error);
        return { error: 'An error occurred during sign in' };
    }
});
```

**After (Fixed):**
```typescript
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
    
    // ✅ Redirect outside try/catch
    redirect('/dashboard');
});
```

### Files to Update

1. **`app/(auth)/action.ts`**:
   - Refactor `signIn` action to call `redirect()` outside try/catch
   - Refactor `signUp` action to call `redirect()` outside try/catch
   - Ensure all error cases return early from within the try block

### Testing

After the fix:
1. Test sign-in with valid credentials → should redirect to dashboard
2. Test sign-in with invalid credentials → should show error message
3. Test sign-up with valid data → should redirect to dashboard
4. Test sign-up with existing email → should show error message
5. Verify no NEXT_REDIRECT errors in console

## Future Enhancements

1. **Search Functionality**: Add command palette for quick navigation
2. **Notifications**: Badge indicators for unread notifications
3. **Theme Switcher**: Light/dark mode toggle in sidebar
4. **Breadcrumbs**: Show current location in nested routes
5. **Favorites**: Allow users to pin frequently used menu items
6. **Keyboard Shortcuts**: Add hotkeys for common actions
7. **Multi-level Menus**: Support for deeper nesting beyond 2 levels
