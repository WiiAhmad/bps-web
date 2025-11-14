# Design Document

## Overview

The MFD (Master File Desa) Management System provides a comprehensive CRUD interface for managing hierarchical geographic administrative data within the RBAC Dashboard. The system manages data from province level down to sub-SLS level, enabling data administrators to maintain accurate geographic information for census and family data collection. The design follows established patterns in the codebase with authentication middleware, dialog-based forms, search/filter capabilities, and toast notifications for user feedback.

## Architecture

### Component Structure

```
app/(dashboard)/dashboard/mfd/
├── actions.ts                  # Server actions for CRUD operations
└── page.tsx                    # Single client component with table, forms, dialogs, and filters
```

**Simplified Architecture**: All UI logic is contained in a single `page.tsx` file, following the same pattern as the users management system. This reduces complexity while maintaining all functionality including search, filtering, and hierarchical display.

### Data Flow

1. **Read Operations**: Client Component fetches MFD records → renders table with filters
2. **Create/Update**: User fills form → Client Component calls server action → Server validates & processes → Returns result → Client shows toast & refreshes
3. **Delete**: User clicks delete → Confirmation dialog → Server checks for family references → Server action performs delete → Client shows toast & refreshes
4. **Search/Filter**: User types/selects filter → Client filters displayed records locally

### Technology Stack

- **Next.js 15+**: App Router with Server Components and Server Actions
- **TypeScript**: Type-safe development
- **Drizzle ORM**: Database operations using existing query functions from lib/db/query.ts
- **shadcn/ui**: Table, Dialog, Form, Button, Input, Select, Badge, Toast components
- **zod**: Schema validation for form inputs
- **React Hook Form**: Form state management with zod resolver

## Components and Interfaces

### 1. MFD Page (page.tsx)

**Type**: Client Component (Single File)

**Responsibilities**:
- Display MFD records in a responsive table with all geographic levels
- Show MFD information: province (name/code), district (name/code), sub-district (name/code), village (name/code), hamlet (name/code), SLS (name/code), sub-SLS (name/code)
- Provide edit and delete action buttons for each row
- Handle empty state when no MFD records exist
- Implement search functionality across all name fields
- Provide filter dropdowns for province, district, and sub-district
- Manage all dialog states (add, edit, delete) internally
- Render MFD form dialog inline for creating/editing records
- Render delete confirmation dialog inline
- Handle form validation using React Hook Form + zod
- Submit data to server actions from actions.ts
- Display loading states during operations
- Show validation errors inline
- Handle success/error responses with toast notifications
- Fetch MFD data on mount and refresh after operations
- Optional: Toggle between flat list and hierarchical grouped view

**Props**: None

**State Management**:
- MFD records list state
- Filtered MFD records state (for search/filter)
- Dialog open/close states (add, edit, delete)
- Selected MFD record for edit/delete
- Loading states for operations
- Search query state
- Filter selections (province, district, sub-district)
- View mode state (flat/hierarchical - optional)
- Form state managed by React Hook Form

**Table Columns**:
1. Province Name
2. Province Code
3. District Name
4. District Code
5. Sub-District Name
6. Sub-District Code
7. Village Name
8. Village Code
9. Hamlet Name
10. Hamlet Code
11. SLS Name
12. SLS Code
13. Sub-SLS Name
14. Sub-SLS Code
15. Actions (Edit & Delete buttons)

**Mobile Responsive**: On mobile, show only essential columns (Village, Hamlet, SLS, Sub-SLS names and actions)

**Form Fields** (in dialog):
1. Province Name (text input, required, min 2 chars)
2. Province Code (text input, required)
3. District Name (text input, required, min 2 chars)
4. District Code (text input, required)
5. Sub-District Name (text input, required, min 2 chars)
6. Sub-District Code (text input, required)
7. Village Name (text input, required, min 2 chars)
8. Village Code (text input, required)
9. Hamlet Name (text input, required, min 2 chars)
10. Hamlet Code (text input, required)
11. SLS Name (text input, required, min 2 chars)
12. SLS Code (text input, required)
13. Sub-SLS Name (text input, required, min 2 chars)
14. Sub-SLS Code (text input, required)

**Form Layout**: Use a 2-column grid layout with name and code fields side by side for each administrative level

**Form Validation Schema** (zod):
```typescript
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
  id: z.number(),
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
```

**Search Implementation**:
- Single search input field at the top of the page
- Filters records by matching search query against all name fields (province, district, sub-district, village, hamlet, SLS, sub-SLS)
- Case-insensitive search
- Real-time filtering as user types

**Filter Implementation**:
- Three dropdown filters: Province, District, Sub-District
- Cascading filters (selecting province filters district options, selecting district filters sub-district options)
- "All" option for each filter to show all records
- Clear all filters button

**Hierarchical View (Optional Enhancement)**:
- Toggle button to switch between flat list and grouped view
- Grouped by province → district with expandable sections
- Show record counts for each group
- Maintain expanded/collapsed state during session

## Data Models

### MFD Type (from schema.ts)

```typescript
export type MFD = {
  id: number;
  namaProvinsi: string;
  kodeProvinsi: string;
  namaKabupaten: string;
  kodeKabupaten: string;
  namaKecamatan: string;
  kodeKecamatan: string;
  namaDesa: string;
  kodeDesa: string;
  namaDusun: string;
  kodeDusun: string;
  namaSLS: string;
  kodeSLS: string;
  namaSubSLS: string;
  kodeSubSLS: string;
};
```

### Server Action Response Type

```typescript
type ActionResponse = {
  success: boolean;
  error?: string;
  message?: string;
  data?: MFD;
};
```

## 2. Server Actions (actions.ts)

**Type**: Server-side functions

**Responsibilities**:
- Handle all CRUD operations for MFD records
- Validate input data with zod schemas
- Authenticate and authorize requests
- Interact with database through query functions
- Return standardized responses

### createMFDAction

**Purpose**: Create a new MFD record

**Authentication**: Uses `validatedActionWithUser` middleware

**Validation**: Uses `createMFDSchema`

**Process**:
1. Validate input data with zod schema
2. Check if MFD with same code combination (kodeDesa, kodeDusun, kodeSLS, kodeSubSLS) already exists using `getMFDByKode()`
3. Create MFD record using `createMFD()` from query.ts
4. Return success response with created MFD data

**Error Handling**:
- Duplicate code combination → return error message "MFD record with this code combination already exists"
- Database error → return generic error message
- Validation error → handled by middleware

### updateMFDAction

**Purpose**: Update existing MFD record

**Authentication**: Uses `validatedActionWithUser` middleware

**Validation**: Uses `updateMFDSchema`

**Process**:
1. Validate input data with zod schema
2. Check if updated code combination conflicts with another MFD record (exclude current record)
3. Update MFD record using `updateMFD()` from query.ts
4. Return success response with updated MFD data

**Error Handling**:
- MFD not found → return error message
- Code combination conflict → return error message
- Database error → return generic error message

### deleteMFDAction

**Purpose**: Delete an MFD record

**Authentication**: Uses `withUser` middleware

**Process**:
1. Extract MFD ID from FormData
2. Check if any family records reference this MFD using `getKeluargaByMFD()`
3. If family records exist, prevent deletion and return error
4. Delete MFD record using `deleteMFD()` from query.ts
5. Return success response

**Error Handling**:
- Family records exist → return error message "Cannot delete MFD record that has associated family records"
- MFD not found → return error message
- Database error → return generic error message

### getMFDsAction

**Purpose**: Fetch all MFD records for client-side display and filtering

**Authentication**: Uses `withUser` middleware

**Process**:
1. Fetch all MFD records using `getAllMFD()` from query.ts
2. Return MFD records array

**Error Handling**:
- Database error → return error message

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
- Specific errors (duplicate codes, family references) shown when appropriate

### Referential Integrity
- Check for family records before deletion
- Prevent deletion if references exist
- Clear error message explaining why deletion failed

## Testing Strategy

### Manual Testing Checklist
1. **Create MFD**:
   - Create MFD with valid data → Success
   - Create MFD with duplicate code combination → Error shown
   - Create MFD with invalid data → Validation errors shown

2. **Update MFD**:
   - Edit MFD with valid changes → Success
   - Edit MFD with conflicting codes → Error shown
   - Edit MFD with invalid data → Validation errors shown

3. **Delete MFD**:
   - Delete MFD without family references → Success
   - Delete MFD with family references → Error shown
   - Confirmation dialog displays correct information

4. **Search and Filter**:
   - Search by province name → Correct results
   - Search by village name → Correct results
   - Filter by province → Correct results
   - Filter by district → Correct results
   - Cascading filters work correctly
   - Clear filters returns to full list

5. **UI/UX**:
   - View empty state → Proper message displayed
   - Test responsive layout on mobile → Proper display
   - Test loading states → Indicators shown
   - Test toast notifications → Proper messages

6. **Authentication**:
   - Unauthenticated access → Redirect to sign-in
   - Server actions validate session

## UI/UX Considerations

### Responsive Design
- Table scrolls horizontally on mobile
- Show only essential columns on mobile (Village, Hamlet, SLS, Sub-SLS, Actions)
- Dialog forms are full-width on mobile with scrollable content
- Touch-friendly button sizes (min 44x44px)
- Proper spacing and padding for mobile
- Filter dropdowns stack vertically on mobile

### Accessibility
- Proper ARIA labels on all interactive elements
- Keyboard navigation support
- Focus management in dialogs
- Screen reader friendly table structure
- Color contrast compliance
- Clear labels for all form fields

### Loading States
- Skeleton loaders for table during initial load
- Disabled buttons with spinners during submission
- Loading indicators in dialogs
- Disabled form inputs during submission

### User Feedback
- Toast notifications for all operations
- Success messages (green)
- Error messages (red)
- Auto-dismiss after 5 seconds
- Inline validation errors in forms
- Clear confirmation messages for delete operations

### Visual Design
- Consistent with existing dashboard theme
- Badges for codes (optional visual enhancement)
- Hover states on table rows
- Clear action buttons with icons
- Organized form layout with grouped fields by administrative level
- Visual hierarchy in form (headings for each level)

### Search and Filter UX
- Search input with clear icon
- Filter dropdowns with "All" option
- Clear all filters button
- Show count of filtered results
- Maintain filter state during operations
- Fast, client-side filtering for responsive feel

## Security Considerations

### Authentication
- All pages protected by layout authentication
- All server actions use authentication middleware
- Session validation on every request

### Authorization
- Role-based access control (future enhancement)
- Only authenticated users can manage MFD data

### Data Validation
- Server-side validation with zod
- Client-side validation for UX
- SQL injection prevention via Drizzle ORM
- XSS prevention via React's built-in escaping

### Data Integrity
- Unique code combination validation
- Referential integrity checks before deletion
- Prevent orphaned family records

## Performance Optimization

### Data Fetching
- Fetch all MFD records once on mount
- Client-side filtering for fast search/filter
- No unnecessary server requests during filtering

### Component Optimization
- Client Components only where needed
- Proper use of React hooks
- Memoization for filter logic
- Efficient search algorithm

### Bundle Size
- Tree-shaking with ES modules
- Code splitting via Next.js
- Lazy loading of dialog components

### Table Performance
- Virtualization for large datasets (future enhancement)
- Efficient rendering with React keys
- Optimized re-renders

## Future Enhancements

1. **Pagination**: Add pagination for large MFD lists
2. **Advanced Search**: Search by specific fields (province only, district only, etc.)
3. **Bulk Operations**: Import MFD records from CSV/Excel
4. **Export**: Export MFD list to CSV/Excel
5. **Hierarchical View**: Implement grouped view with expand/collapse
6. **Map Integration**: Show geographic locations on a map
7. **Audit Log**: Track changes to MFD records
8. **Validation Rules**: Add format validation for codes (e.g., province code must be 2 digits)
9. **Auto-complete**: Suggest existing values when entering codes
10. **Duplicate Detection**: Warn about similar records before creation
11. **Batch Delete**: Delete multiple MFD records at once (with safety checks)
12. **History**: View change history for each MFD record

## Database Query Functions Required

The following query functions from `lib/db/query.ts` will be used:

**Existing Functions**:
- `getAllMFD()` - Fetch all MFD records
- `getMFDById(id)` - Fetch single MFD by ID
- `getMFDByKode(kodeDesa, kodeDusun, kodeSLS, kodeSubSLS)` - Check for duplicate codes
- `createMFD(data)` - Create new MFD record
- `updateMFD(id, data)` - Update existing MFD record
- `deleteMFD(id)` - Delete MFD record
- `getKeluargaByMFD(idMFD)` - Check for family references

All these functions already exist in the query.ts file and follow the established patterns.

## Implementation Notes

### Form Organization
The form should be organized by administrative levels with clear visual separation:

```
Province Section:
  - Province Name | Province Code

District Section:
  - District Name | District Code

Sub-District Section:
  - Sub-District Name | Sub-District Code

Village Section:
  - Village Name | Village Code

Hamlet Section:
  - Hamlet Name | Hamlet Code

SLS Section:
  - SLS Name | SLS Code

Sub-SLS Section:
  - Sub-SLS Name | Sub-SLS Code
```

### Filter Cascading Logic
- When province filter changes:
  - Reset district and sub-district filters
  - Update district options to show only districts in selected province
- When district filter changes:
  - Reset sub-district filter
  - Update sub-district options to show only sub-districts in selected district

### Search Algorithm
```typescript
const filteredRecords = mfdRecords.filter(record => {
  const searchLower = searchQuery.toLowerCase();
  return (
    record.namaProvinsi.toLowerCase().includes(searchLower) ||
    record.namaKabupaten.toLowerCase().includes(searchLower) ||
    record.namaKecamatan.toLowerCase().includes(searchLower) ||
    record.namaDesa.toLowerCase().includes(searchLower) ||
    record.namaDusun.toLowerCase().includes(searchLower) ||
    record.namaSLS.toLowerCase().includes(searchLower) ||
    record.namaSubSLS.toLowerCase().includes(searchLower)
  );
});
```

