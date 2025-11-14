# Design Document

## Overview

The User Management System provides a comprehensive CRUD interface for managing user accounts within the RBAC Dashboard. The system leverages existing infrastructure including Drizzle ORM for database operations, shadcn/ui components for the interface, Next.js server actions for data mutations, and zod for validation. The design follows the established patterns in the codebase with authentication middleware, dialog-based forms, and toast notifications for user feedback.

## Architecture

### Component Structure

```
app/(dashboard)/dashboard/users/
├── actions.ts                  # Server actions for CRUD operations
└── page.tsx                    # Single client component with table, forms, and dialogs
```

**Simplified Architecture**: All UI logic is contained in a single `page.tsx` file, eliminating the need for separate component files. This reduces complexity while maintaining all functionality.

### Data Flow

1. **Read Operations**: Server Component fetches users → passes to Client Component → renders table
2. **Create/Update**: User fills form → Client Component calls server action → Server validates & processes → Returns result → Client shows toast & refreshes
3. **Delete**: User clicks delete → Confirmation dialog → Server action performs soft delete → Client shows toast & refreshes

### Technology Stack

- **Next.js 15+**: App Router with Server Components and Server Actions
- **TypeScript**: Type-safe development
- **Drizzle ORM**: Database operations using existing query functions
- **shadcn/ui**: Table, Dialog, Form, Button, Input, Select, Toast components
- **zod**: Schema validation for form inputs
- **bcryptjs**: Password hashing
- **React Hook Form**: Form state management with zod resolver

## Components and Interfaces

### 1. Users Page (page.tsx)

**Type**: Client Component (Single File)

**Responsibilities**:
- Display users in a responsive table with all columns
- Show user information: avatar/initials, name, email, username, role, phone, created date
- Provide edit and delete action buttons for each row
- Handle empty state when no users exist
- Manage all dialog states (add, edit, delete) internally
- Render user form dialog inline for creating/editing users
- Render delete confirmation dialog inline
- Handle form validation using React Hook Form + zod
- Submit data to server actions from actions.ts
- Display loading states during operations
- Show validation errors inline
- Handle success/error responses with toast notifications
- Fetch users data on mount and refresh after operations
- All UI components (table, dialogs, forms) are defined within this single file

**Props**: None

**State Management**:
- Users list state
- Dialog open/close states (add, edit, delete)
- Selected user for edit/delete
- Loading states for operations
- Form state managed by React Hook Form

**Table Columns**:
1. Avatar (with fallback initials)
2. Name
3. Email
4. Username
5. Role (with badge styling)
6. Phone Number
7. Created Date (formatted)
8. Actions (Edit & Delete buttons)

**Form Fields** (in dialog):
1. Name (text input, required, min 2 chars)
2. Email (email input, required, valid email format)
3. Username (text input, required)
4. Password (password input, required for create, optional for edit, min 8 chars)
5. Phone Number (text input, required)
6. Date of Birth (date picker, required)
7. Address (textarea, required)
8. Role (select dropdown: user/admin, required)

**Form Validation Schema** (zod):
```typescript
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
  id: z.number(),
  nama: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  NoTelpon: z.string().min(1, 'Phone number is required'),
  tanggal_lahir: z.string().min(1, 'Date of birth is required'),
  alamat: z.string().min(1, 'Address is required'),
  role: z.enum(['user', 'admin']),
});
```

## Data Models

### User Type (from schema.ts)

```typescript
export type User = {
  id: number;
  nama: string;
  email: string;
  username: string;
  password: string;
  photo: string;
  tanggal_lahir: string;
  NoTelpon: string;
  role: string;
  alamat: string;
  isVerified: number;
  createdAt: string;
  updatedAt: string;
  deleted: number;
};
```

### Server Action Response Type

```typescript
type ActionResponse = {
  success: boolean;
  error?: string;
  message?: string;
  data?: User;
};
```

### 2. Server Actions (actions.ts)

**Type**: Server-side functions

**Responsibilities**:
- Handle all CRUD operations for users
- Validate input data with zod schemas
- Authenticate and authorize requests
- Interact with database through query functions
- Return standardized responses

#### createUserAction

**Purpose**: Create a new user account

**Authentication**: Uses `validatedActionWithUser` middleware

**Validation**: Uses `createUserSchema`

**Process**:
1. Validate input data with zod schema
2. Check if email already exists using `getUserByEmail()`
3. Hash password using bcryptjs
4. Set default photo to empty string
5. Create user using `createUser()` from query.ts
6. Return success response with created user data

**Error Handling**:
- Email already exists → return error message
- Database error → return generic error message
- Validation error → handled by middleware

#### updateUserAction

**Purpose**: Update existing user information

**Authentication**: Uses `validatedActionWithUser` middleware

**Validation**: Uses `updateUserSchema`

**Process**:
1. Validate input data with zod schema
2. Check if new email conflicts with another user (exclude current user)
3. If password provided, hash it; otherwise, exclude from update
4. Update `updatedAt` timestamp
5. Update user using `updateUser()` from query.ts
6. Return success response with updated user data

**Error Handling**:
- User not found → return error message
- Email conflict → return error message
- Database error → return generic error message

#### deleteUserAction

**Purpose**: Soft delete a user account

**Authentication**: Uses `withUser` middleware

**Process**:
1. Extract user ID from FormData
2. Verify user is not deleting their own account
3. Perform soft delete using `deleteUser()` from query.ts (sets deleted = 1)
4. Return success response

**Error Handling**:
- Self-deletion attempt → return error message
- User not found → return error message
- Database error → return generic error message

#### getUsersAction

**Purpose**: Fetch all non-deleted users for client-side refresh

**Authentication**: Uses `withUser` middleware

**Process**:
1. Fetch all users using `getAllUsers()` from query.ts
2. Return users array

## Error Handling

### Validation Errors
- Handled by zod schema validation
- Displayed inline in form fields
- Prevents form submission until resolved

### Server Errors
- Caught in try-catch blocks in server actions
- Returned as error messages in ActionResponse
- Displayed as toast notifications to user

### Authentication Errors
- Handled by middleware (redirects to sign-in)
- Session validation on every server action

### Database Errors
- Caught and logged in server actions
- Generic error messages shown to user
- Specific errors (email conflict) shown when appropriate

## Testing Strategy

### Unit Tests (Optional)
- Validation schema tests
- Server action logic tests
- Component rendering tests

### Integration Tests
- Full CRUD flow testing
- Authentication flow testing
- Error handling scenarios

### Manual Testing Checklist
1. Create user with valid data → Success
2. Create user with existing email → Error shown
3. Create user with invalid data → Validation errors shown
4. Edit user with valid changes → Success
5. Edit user with conflicting email → Error shown
6. Delete user → Confirmation shown, user removed
7. Attempt to delete own account → Error shown
8. View empty state → Proper message displayed
9. Test responsive layout on mobile → Proper display
10. Test loading states → Indicators shown

## UI/UX Considerations

### Responsive Design
- Table scrolls horizontally on mobile
- Dialog forms are full-width on mobile
- Touch-friendly button sizes (min 44x44px)
- Proper spacing and padding for mobile

### Accessibility
- Proper ARIA labels on all interactive elements
- Keyboard navigation support
- Focus management in dialogs
- Screen reader friendly table structure
- Color contrast compliance

### Loading States
- Skeleton loaders for table during initial load
- Disabled buttons with spinners during submission
- Loading indicators in dialogs

### User Feedback
- Toast notifications for all operations
- Success messages (green)
- Error messages (red)
- Auto-dismiss after 5 seconds
- Inline validation errors in forms

### Visual Design
- Consistent with existing dashboard theme
- User avatars with fallback initials
- Role badges with color coding
- Hover states on table rows
- Clear action buttons with icons

## Security Considerations

### Authentication
- All pages protected by layout authentication
- All server actions use authentication middleware
- Session validation on every request

### Authorization
- Prevent users from deleting their own account
- Role-based access control (future enhancement)

### Data Validation
- Server-side validation with zod
- Client-side validation for UX
- SQL injection prevention via Drizzle ORM
- XSS prevention via React's built-in escaping

### Password Security
- Passwords hashed with bcryptjs before storage
- Minimum 8 character requirement
- Never return passwords in API responses

## Performance Optimization

### Data Fetching
- Server Components for initial data load
- No unnecessary client-side fetching
- Efficient database queries using Drizzle ORM

### Component Optimization
- Client Components only where needed
- Proper use of React hooks
- Memoization where appropriate

### Bundle Size
- Tree-shaking with ES modules
- Code splitting via Next.js
- Lazy loading of dialog components

## Future Enhancements

1. **Pagination**: Add pagination for large user lists
2. **Search/Filter**: Add search and filter capabilities
3. **Bulk Operations**: Select multiple users for bulk actions
4. **Role Management**: More granular role-based permissions
5. **User Activity Log**: Track user actions and changes
6. **Email Verification**: Implement email verification flow
7. **Password Reset**: Add password reset functionality
8. **Profile Photos**: Upload and manage user profile photos
9. **Export**: Export user list to CSV/Excel
10. **Advanced Filters**: Filter by role, date range, verification status
