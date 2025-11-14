# Implementation Plan

- [x] 1. Set up server actions for MFD CRUD operations





  - Create `app/(dashboard)/dashboard/mfd/actions.ts` file
  - Import required dependencies: zod, database query functions, middleware
  - Define zod validation schemas for create and update operations (all 14 fields)
  - Implement `createMFDAction` with code combination uniqueness check
  - Implement `updateMFDAction` with code conflict check (excluding current record)
  - Implement `deleteMFDAction` with family reference check using `getKeluargaByMFD()`
  - Implement `getMFDsAction` to fetch all MFD records
  - Add proper error handling and return ActionResponse types
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.1, 4.2, 4.3, 4.4, 4.5, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 2. Create single-file MFD page with all UI components





  - Create `app/(dashboard)/dashboard/mfd/page.tsx` as a client component
  - Import all required shadcn/ui components (Table, Dialog, AlertDialog, Form, Input, Select, Button, Badge, Toast, Skeleton)
  - Import server actions from `./actions`
  - Import zod schemas from `./actions`
  - Set up React Hook Form with zod resolver for form validation
  - Define all state management (MFD list, filtered list, dialog states, selected MFD, loading states, search query, filter selections)
  - Implement data fetching on mount using `getMFDsAction()`
  - Create page header with "MFD Management" title and "Add MFD" button
  - Build MFD table with 14 columns: province name/code, district name/code, sub-district name/code, village name/code, hamlet name/code, SLS name/code, sub-SLS name/code, actions
  - Add Edit and Delete action buttons for each row
  - Implement empty state message when no MFD records exist
  - Create inline MFD form dialog component for add/edit operations
  - Organize form fields by administrative level with 2-column layout (name | code)
  - Add visual section separators for each administrative level
  - Implement form submission handlers that call server actions
  - Create inline delete confirmation dialog component with village name display
  - Add loading states with skeleton loaders for initial load
  - Add loading indicators during form submissions
  - Implement toast notifications for success and error responses
  - Add responsive styling for mobile (show only essential columns), tablet, and desktop
  - Ensure accessibility with ARIA labels and keyboard navigation
  - Implement data refresh after successful operations
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.7, 3.1, 3.2, 3.3, 4.1, 4.2, 4.5, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 7.1, 7.2, 7.3, 7.4, 8.1, 8.2, 8.3, 8.4, 8.5, 9.1, 9.2, 9.3, 9.4, 10.1, 10.2_

- [ ] 3. Implement search functionality
  - Add search input field at the top of the page
  - Implement search state management
  - Create search filter function that checks all name fields (province, district, sub-district, village, hamlet, SLS, sub-SLS)
  - Implement case-insensitive search
  - Add real-time filtering as user types
  - Add clear search button
  - Update table to display filtered results
  - Show "No results found" message when search returns empty
  - _Requirements: 5.1, 5.2_

- [ ] 4. Implement filter dropdowns
  - Add three filter dropdowns: Province, District, Sub-District
  - Implement filter state management
  - Create filter logic that combines with search results
  - Implement cascading filters (province selection updates district options, district selection updates sub-district options)
  - Add "All" option for each filter
  - Add "Clear All Filters" button
  - Reset dependent filters when parent filter changes
  - Update table to display filtered results
  - Show count of filtered results
  - _Requirements: 5.3, 5.4, 5.5_

- [ ] 5. Add navigation link to dashboard sidebar
  - Open `app/(dashboard)/dashboard/layout.tsx` or sidebar component
  - Add MFD navigation link with appropriate icon
  - Ensure link is accessible to authenticated users
  - Test navigation to MFD page
  - _Requirements: 10.1_

- [ ]* 6. Testing and validation
  - [ ]* 6.1 Test create MFD flow
    - Test creating MFD with valid data
    - Test code combination uniqueness validation
    - Test form validation for all 14 fields
    - Verify success toast and table refresh
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_
  
  - [ ]* 6.2 Test update MFD flow
    - Test updating MFD with valid changes
    - Test code conflict validation
    - Verify success toast and table refresh
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  
  - [ ]* 6.3 Test delete MFD flow
    - Test delete confirmation dialog
    - Test successful deletion (no family references)
    - Test prevention of deletion with family references
    - Verify error message for family references
    - Verify success toast and table refresh
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ]* 6.4 Test search functionality
    - Test search by province name
    - Test search by village name
    - Test search by hamlet name
    - Test case-insensitive search
    - Test clear search
    - _Requirements: 5.1, 5.2_
  
  - [ ]* 6.5 Test filter functionality
    - Test province filter
    - Test district filter
    - Test sub-district filter
    - Test cascading filter behavior
    - Test clear all filters
    - Test combined search and filter
    - _Requirements: 5.3, 5.4, 5.5_
  
  - [ ]* 6.6 Test responsive behavior
    - Test on mobile viewport (< 768px)
    - Test on tablet viewport (768px - 1024px)
    - Test on desktop viewport (> 1024px)
    - Verify table scrolling on mobile
    - Verify dialog sizing on all viewports
    - Verify filter layout on mobile
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  
  - [ ]* 6.7 Test authentication and authorization
    - Verify page requires authentication
    - Test redirect to sign-in when not authenticated
    - Verify server actions validate session
    - Test prevention of unauthorized access
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

## Implementation Summary

### Architecture Overview
The MFD management system follows Next.js 15+ best practices with a clear separation between client and server:

**Client Component** (`page.tsx`):
- Single-file implementation with all UI logic
- Uses React Hook Form with zod validation
- Manages local state (MFD list, filtered list, dialogs, loading states, search, filters)
- Communicates directly with server actions (no API routes)
- Implements shadcn/ui components for consistent design
- Client-side search and filtering for fast, responsive UX

**Server Actions** (`actions.ts`):
- Contains all server-side logic in one file
- Includes validation schemas, database queries, and business logic
- Uses authentication middleware (`validatedActionWithUser`, `withUser`)
- Implements referential integrity checks
- Returns typed responses for client consumption

### Key Features Implemented
✅ Full CRUD operations (Create, Read, Update, Delete)
✅ Form validation with zod schemas (14 fields)
✅ Code combination uniqueness checks
✅ Referential integrity checks (prevent deletion with family references)
✅ Search functionality across all name fields
✅ Cascading filter dropdowns (Province → District → Sub-District)
✅ Loading states with skeleton loaders
✅ Toast notifications for feedback
✅ Responsive design (mobile, tablet, desktop)
✅ Accessibility features (ARIA labels, keyboard navigation)
✅ Authentication middleware on all server actions

### Component Structure
```
app/(dashboard)/dashboard/mfd/
├── actions.ts          # Server actions with auth middleware
└── page.tsx            # Client component with full UI
```

### Data Flow
1. Client component fetches MFD records on mount via `getMFDsAction()`
2. User interactions trigger form dialogs or search/filter updates
3. Search and filters update displayed records client-side
4. Form submissions call server actions with FormData
5. Server actions validate, process, and return responses
6. Client updates UI based on responses and refreshes data

### Geographic Hierarchy
```
Province (Provinsi)
  └── District (Kabupaten)
      └── Sub-District (Kecamatan)
          └── Village (Desa)
              └── Hamlet (Dusun)
                  └── SLS (Satuan Lingkungan Setempat)
                      └── Sub-SLS
```

### Form Organization
The form is organized by administrative levels with clear visual separation:
- Province Section: Name | Code
- District Section: Name | Code
- Sub-District Section: Name | Code
- Village Section: Name | Code
- Hamlet Section: Name | Code
- SLS Section: Name | Code
- Sub-SLS Section: Name | Code

### Search and Filter Strategy
- **Search**: Client-side filtering across all name fields for instant results
- **Filters**: Cascading dropdowns with "All" options
- **Combined**: Search and filters work together to narrow results
- **Performance**: All filtering happens client-side for responsive UX

### Database Operations
All database operations use existing query functions from `lib/db/query.ts`:
- `getAllMFD()` - Fetch all records
- `getMFDByKode()` - Check for duplicates
- `createMFD()` - Create new record
- `updateMFD()` - Update existing record
- `deleteMFD()` - Delete record
- `getKeluargaByMFD()` - Check family references

