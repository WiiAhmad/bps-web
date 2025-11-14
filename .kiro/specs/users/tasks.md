# Implementation Plan

- [x] 1. Set up server actions for user CRUD operations
  - Create `app/(dashboard)/dashboard/users/actions.ts` file
  - Import required dependencies: zod, bcryptjs, database query functions, middleware
  - Define zod validation schemas for create and update operations
  - Implement `createUserAction` with email uniqueness check and password hashing
  - Implement `updateUserAction` with optional password update and email conflict check
  - Implement `deleteUserAction` with self-deletion prevention
  - Add proper error handling and return ActionResponse types
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 9.1, 9.2, 9.3, 9.4_

- [x] 2. Create single-file users page with all UI components
  - Create `app/(dashboard)/dashboard/users/page.tsx` as a client component
  - Import all required shadcn/ui components (Table, Dialog, AlertDialog, Form, Input, Select, Button, Avatar, Badge, Toast)
  - Import server actions from `./actions`
  - import zod schema from `./actions`
  - Set up React Hook Form with zod resolver for form validation
  - Define all state management (users list, dialog states, selected user, loading states)
  - Implement data fetching on mount using getAllUsers() and getCurrentUser()
  - Create page header with "User Management" title and "Add User" button
  - Build users table with columns: avatar, name, email, username, role, phone, created date, actions
  - Implement avatar display with fallback initials
  - Add role badge with styling
  - Format created date for display
  - Add Edit and Delete action buttons for each row
  - Implement empty state message when no users exist
  - Create inline user form dialog component for add/edit operations
  - Add form fields: name, email, username, password (conditional), phone, date of birth, address, role
  - Implement form submission handlers that call server actions
  - Create inline delete confirmation dialog component
  - Add loading states with skeleton loaders for initial load
  - Add loading indicators during form submissions
  - Implement toast notifications for success and error responses
  - Add responsive styling for mobile, tablet, and desktop
  - Ensure accessibility with ARIA labels and keyboard navigation
  - Implement data refresh after successful operations
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.7, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 6.1, 6.2, 6.3, 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.2, 8.3, 8.4, 9.1, 9.2_

- [x] 3. Testing and validation - Ready for manual testing
  - [ ] 3.1 Test create user flow
    - Test creating user with valid data
    - Test email uniqueness validation
    - Test form validation for all fields
    - Verify password hashing
    - Verify success toast and table refresh
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  
  - [ ] 3.2 Test update user flow
    - Test updating user with valid changes
    - Test email conflict validation
    - Test optional password update
    - Verify success toast and table refresh
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  
  - [ ] 3.3 Test delete user flow
    - Test delete confirmation dialog
    - Test successful deletion
    - Test prevention of self-deletion
    - Verify success toast and table refresh
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ] 3.4 Test responsive behavior
    - Test on mobile viewport (< 768px)
    - Test on tablet viewport (768px - 1024px)
    - Test on desktop viewport (> 1024px)
    - Verify table scrolling on mobile
    - Verify dialog sizing on all viewports
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  
  - [ ] 3.5 Test authentication and authorization
    - Verify page requires authentication
    - Test redirect to sign-in when not authenticated
    - Verify server actions validate session
    - Test prevention of unauthorized access
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

## Implementation Summary

### Architecture Overview
The user management system follows Next.js 15+ best practices with a clear separation between client and server:

**Client Component** (`page.tsx`):
- Single-file implementation with all UI logic
- Uses React Hook Form with zod validation
- Manages local state (users list, dialogs, loading states)
- Communicates directly with server actions (no API routes)
- Implements shadcn/ui components for consistent design

**Server Actions** (`actions.ts`):
- Contains all server-side logic in one file
- Includes validation schemas, database queries, and business logic
- Uses authentication middleware (`validatedActionWithUser`, `withUser`)
- Implements bcryptjs for password hashing
- Returns typed responses for client consumption

### Key Features Implemented
✅ Full CRUD operations (Create, Read, Update, Delete)
✅ Form validation with zod schemas
✅ Password hashing with bcryptjs
✅ Email uniqueness checks
✅ Self-deletion prevention
✅ Loading states with skeleton loaders
✅ Toast notifications for feedback
✅ Responsive design (mobile, tablet, desktop)
✅ Accessibility features (ARIA labels, keyboard navigation)
✅ Authentication middleware on all server actions
✅ Soft delete functionality

### Component Structure
```
app/(dashboard)/dashboard/users/
├── actions.ts          # Server actions with auth middleware
└── page.tsx            # Client component with full UI
```

### Data Flow
1. Client component fetches users on mount via `getUsersAction()`
2. User interactions trigger form dialogs
3. Form submissions call server actions with FormData
4. Server actions validate, process, and return responses
5. Client updates UI based on responses and refreshes data
