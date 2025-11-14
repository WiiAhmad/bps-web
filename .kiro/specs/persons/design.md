# Design Document

## Overview

The Persons Management System provides a comprehensive CRUD interface for managing household census data within the RBAC Dashboard. The system manages keluarga (family) records, anggota keluarga (family members), and related census data including employment, housing, assistance programs, and disability information. The design uses a combination of dialog-based forms for simple data entry (keluarga, anggota keluarga) and dedicated sections for additional census data, following established patterns in the codebase with authentication middleware, search/filter capabilities, and toast notifications for user feedback.

## Architecture

### Component Structure

```
app/(dashboard)/dashboard/persons/
├── actions.ts                  # Server actions for all CRUD operations
├── page.tsx                    # Main page: keluarga list with dialogs
├── components/
│   ├── keluarga-form.tsx       # Reusable keluarga form component
│   ├── keluarga-dialog.tsx     # Dialog wrapper for keluarga form
│   ├── anggota-keluarga-form.tsx # Reusable anggota keluarga form component
│   ├── anggota-keluarga-dialog.tsx # Dialog wrapper for anggota keluarga form
│   ├── ket-petugas-form.tsx    # Ket petugas form component
│   ├── ketenagakerjaan-form.tsx # Employment form component
│   ├── housing-form.tsx        # Housing characteristics form component
│   ├── housing-blok2-form.tsx  # Agricultural & livestock form component
│   ├── bantuan-form.tsx        # Assistance programs form component
│   ├── disabilitas-form.tsx    # Disability information form component
│   └── form-fields/
│       ├── mfd-select.tsx      # Searchable MFD dropdown component
│       ├── coded-select.tsx    # Reusable dropdown for coded fields
│       ├── user-select.tsx     # User dropdown for ket petugas (pendata/pemeriksa)
│       ├── anggota-select.tsx  # Family member dropdown for employment/assistance/disability
│       └── date-picker-field.tsx # Date picker with validation
└── [id]/
    ├── page.tsx                # Family detail page: anggota keluarga and other data
    └── actions.ts              # Server actions for family-specific operations
```

**Two-Page Architecture with Reusable Components**:
1. **Main Page** (`page.tsx`): Displays keluarga table with add/edit/delete via dialogs
2. **Detail Page** (`[id]/page.tsx`): Displays family details, anggota keluarga table, and additional data sections with dialogs
3. **Form Components**: Reusable form components for each data type to reduce code duplication and improve maintainability

### Data Flow

1. **Keluarga Operations**: Main page → Dialog form → Server action → Database → Refresh list
2. **Anggota Keluarga Operations**: Detail page → Dialog form → Server action → Database → Refresh list
3. **Additional Data Operations**: Detail page → Dialog form → Server action → Database → Refresh section
4. **Navigation**: Main page table row → Click view details → Navigate to detail page with family ID
5. **Search/Filter**: User input → Client-side filtering → Update displayed records

### Technology Stack

- **Next.js 15+**: App Router with Server Components and Server Actions
- **TypeScript**: Type-safe development
- **Drizzle ORM**: Database operations using query functions from lib/db/query.ts
- **shadcn/ui**: Table, Dialog, Form, Button, Input, Select, Badge, Toast components
- **zod**: Schema validation for form inputs
- **React Hook Form**: Form state management with zod resolver

## Components and Interfaces

### Reusable Form Components

#### 1. KeluargaForm Component (components/keluarga-form.tsx)

**Type**: Client Component

**Purpose**: Reusable form component for creating/editing keluarga records

**Props**:
```typescript
{
  initialData?: Keluarga;
  onSubmit: (data: KeluargaFormData) => Promise<void>;
  isLoading?: boolean;
}
```

**Features**:
- Uses React Hook Form with zod validation
- Includes all keluarga fields
- MFD searchable dropdown
- Inline validation errors
- Submit and cancel buttons
- Loading state handling

#### 2. AnggotaKeluargaForm Component (components/anggota-keluarga-form.tsx)

**Type**: Client Component

**Purpose**: Reusable form component for creating/editing anggota keluarga records

**Props**:
```typescript
{
  initialData?: AnggotaKeluarga;
  idKeluarga: number;
  onSubmit: (data: AnggotaKeluargaFormData) => Promise<void>;
  isLoading?: boolean;
}
```

**Features**:
- Uses React Hook Form with zod validation
- Organized in sections (Personal, Birth, Identity, Education)
- Auto-calculate age from date of birth
- Coded dropdowns for all coded fields
- Inline validation errors
- Submit and cancel buttons

#### 3. MFDSelect Component (components/form-fields/mfd-select.tsx)

**Type**: Client Component

**Purpose**: Searchable dropdown for MFD location selection

**Props**:
```typescript
{
  value: number;
  onChange: (value: number) => void;
  error?: string;
}
```

**Features**:
- Searchable/filterable dropdown
- Display format: "Province - District - Village"
- Shows MFD code on hover
- Loads all MFD records
- Handles loading state

#### 4. CodedSelect Component (components/form-fields/coded-select.tsx)

**Type**: Client Component

**Purpose**: Reusable dropdown for coded fields (gender, religion, education, etc.)

**Props**:
```typescript
{
  value: number;
  onChange: (value: number) => void;
  options: Array<{ value: number; label: string }>;
  placeholder?: string;
  error?: string;
}
```

**Features**:
- Displays code and description
- Stores only code value
- Consistent styling
- Error state handling

#### 5. UserSelect Component (components/form-fields/user-select.tsx)

**Type**: Client Component

**Purpose**: Dropdown for selecting users (for ket petugas pendata/pemeriksa)

**Props**:
```typescript
{
  value: number;
  onChange: (value: number) => void;
  error?: string;
}
```

**Features**:
- Fetches all users from database
- Display format: "Name (Username)"
- Searchable/filterable
- Shows user ID on selection
- Handles loading state

#### 6. AnggotaSelect Component (components/form-fields/anggota-select.tsx)

**Type**: Client Component

**Purpose**: Dropdown for selecting family members (for employment, assistance, disability)

**Props**:
```typescript
{
  value: number;
  onChange: (value: number) => void;
  idKeluarga: number;
  error?: string;
}
```

**Features**:
- Fetches family members for specific keluarga
- Display format: "Full Name (NIK)"
- Shows sequential number
- Handles empty state (no family members)
- Handles loading state

#### 5. Additional Data Form Components

Each additional data section has its own form component:
- **KetPetugasForm**: Survey officer information form (uses UserSelect for pendata/pemeriksa)
- **KetenagakerjaanForm**: Employment data form (uses AnggotaSelect for family member)
- **HousingForm**: Housing characteristics form
- **HousingBlok2Form**: Agricultural & livestock form
- **BantuanForm**: Assistance programs form (uses AnggotaSelect for recipient)
- **DisabilitasForm**: Disability information form (uses AnggotaSelect for family member)

All follow the same pattern as KeluargaForm with appropriate fields and validation.

#### 6. Dialog Wrapper Components

Each form has a corresponding dialog wrapper:
- **KeluargaDialog**: Wraps KeluargaForm in a dialog
- **AnggotaKeluargaDialog**: Wraps AnggotaKeluargaForm in a dialog
- Similar dialogs for additional data forms

**Dialog Props**:
```typescript
{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  initialData?: any;
  onSuccess: () => void;
}
```

**Dialog Features**:
- Handles open/close state
- Calls appropriate server action
- Shows loading state
- Displays toast notifications
- Resets form on close

### Page Components

### 1. Main Persons Page (page.tsx)

**Type**: Client Component

**Responsibilities**:
- Display keluarga records in a responsive table
- Show family information: family head name, number of members, family card number, address, MFD location
- Provide view details, edit, and delete action buttons for each row
- Handle empty state when no keluarga records exist
- Implement search functionality across family head name, family card number, and address
- Provide MFD location filter dropdown
- Manage dialog states (add, edit, delete) internally
- Render keluarga form dialog inline for creating/editing records
- Render delete confirmation dialog inline
- Handle form validation using React Hook Form + zod
- Submit data to server actions from actions.ts
- Display loading states during operations
- Show validation errors inline
- Handle success/error responses with toast notifications
- Fetch keluarga data on mount and refresh after operations
- Navigate to detail page when view details button is clicked

**Props**: None

**State Management**:
- Keluarga records list state
- Filtered keluarga records state (for search/filter)
- Dialog open/close states (add, edit, delete)
- Selected keluarga record for edit/delete
- Loading states for operations
- Search query state
- MFD filter selection state
- Form state managed by React Hook Form

**Table Columns**:
1. Family Head Name
2. Number of Family Members
3. Family Card Number
4. Address
5. MFD Location (Province - District - Village)
6. Actions (View Details, Edit, Delete buttons)

**Mobile Responsive**: On mobile, show only family head name, family card number, and actions

**Form Fields** (in dialog):
1. Family Head Name (text input, required, min 2 chars)
2. Number of Family Members (number input, required, min 1)
3. Family Card Number (text input, required, 16 digits)
4. Address (textarea, required, min 10 chars)
5. MFD Selection (dropdown, required, searchable)
6. Notes (textarea, optional)

**Form Validation Schema** (zod):
```typescript
const createKeluargaSchema = z.object({
  namaKepalaKeluarga: z.string().min(2, 'Family head name must be at least 2 characters'),
  anggotaKeluarga: z.number().min(1, 'Number of family members must be at least 1'),
  nomorKartuKeluarga: z.string().length(16, 'Family card number must be 16 digits').regex(/^\d+$/, 'Must contain only numbers'),
  alamat: z.string().min(10, 'Address must be at least 10 characters'),
  idMFD: z.number().min(1, 'MFD location is required'),
  catatan: z.string().optional(),
});

const updateKeluargaSchema = z.object({
  id: z.number(),
  namaKepalaKeluarga: z.string().min(2, 'Family head name must be at least 2 characters'),
  anggotaKeluarga: z.number().min(1, 'Number of family members must be at least 1'),
  nomorKartuKeluarga: z.string().length(16, 'Family card number must be 16 digits').regex(/^\d+$/, 'Must contain only numbers'),
  alamat: z.string().min(10, 'Address must be at least 10 characters'),
  idMFD: z.number().min(1, 'MFD location is required'),
  catatan: z.string().optional(),
});
```

**Search Implementation**:
- Single search input field at the top of the page
- Filters records by matching search query against family head name, family card number, and address
- Case-insensitive search
- Real-time filtering as user types

**Filter Implementation**:
- MFD location dropdown filter
- Shows province - district - village format
- "All Locations" option to show all records
- Clear filter button

### 2. Family Detail Page ([id]/page.tsx)

**Type**: Client Component

**Responsibilities**:
- Display family information at the top (read-only)
- Show "Edit Family" button to open edit dialog
- Display anggota keluarga table with all family members
- Provide "Add Family Member" button above the table
- Show edit and delete action buttons for each family member
- Manage dialog states for anggota keluarga operations
- Render anggota keluarga form dialog inline
- Display additional data sections with expandable/collapsible panels:
  - Ket Petugas (Survey Officer Information)
  - Ketenagakerjaan (Employment Data) - per family member
  - Ket Perumahan (Housing Characteristics)
  - Ket Perumahan Blok 2 (Agricultural & Livestock)
  - Bantuan (Assistance Programs)
  - Disabilitas (Disability Information) - per family member
- Provide add/edit/delete buttons for each additional data section
- Handle form validation for all sections
- Submit data to server actions
- Display loading states and toast notifications
- Fetch all family-related data on mount
- Provide "Back to Families" navigation button

**Props**: 
```typescript
{ params: { id: string } }
```

**State Management**:
- Family data state
- Anggota keluarga list state
- Additional data sections state (ket petugas, employment, housing, etc.)
- Dialog open/close states for each section
- Selected record for edit/delete
- Loading states for operations
- Form states managed by React Hook Form

**Anggota Keluarga Table Columns**:
1. Sequential Number
2. Full Name
3. NIK
4. Gender
5. Family Relationship
6. Age
7. Education Level
8. Actions (Edit, Delete buttons)

**Mobile Responsive**: On mobile, show only full name, NIK, age, and actions

**Anggota Keluarga Form Fields** (in dialog):
1. Sequential Number (number input, required)
2. Full Name (text input, required, min 2 chars)
3. NIK (text input, required, 16 digits)
4. Gender (dropdown, required: 1-Male, 2-Female)
5. Family Relationship (dropdown, required)
6. Marital Status (dropdown, required)
7. Place of Birth (text input, required)
8. Date of Birth (date picker, required)
9. Age (number input, required, auto-calculated from DOB)
10. Religion (dropdown, required)
11. Identity Card Type (dropdown, required)
12. Domicile Status (dropdown, required)
13. School Participation (dropdown, required)
14. Education Level (dropdown, required)
15. Highest Class (number input, optional)
16. Highest Diploma (dropdown, optional)

**Anggota Keluarga Validation Schema** (zod):
```typescript
const createAnggotaKeluargaSchema = z.object({
  idKeluarga: z.number(),
  nomorUrut: z.number().min(1, 'Sequential number must be at least 1'),
  namaLengkap: z.string().min(2, 'Full name must be at least 2 characters'),
  NIK: z.string().length(16, 'NIK must be 16 digits').regex(/^\d+$/, 'Must contain only numbers'),
  jenisKelamin: z.number().min(1).max(2, 'Gender is required'),
  hubunganKeluarga: z.number().min(1, 'Family relationship is required'),
  statusKawin: z.number().min(1, 'Marital status is required'),
  tempatLahir: z.string().min(2, 'Place of birth is required'),
  tanggalLahir: z.string().min(1, 'Date of birth is required'),
  umur: z.number().min(0, 'Age must be 0 or greater'),
  agama: z.number().min(1, 'Religion is required'),
  kartuIdentitas: z.number().min(1, 'Identity card type is required'),
  domisili: z.number().min(1, 'Domicile status is required'),
  partisipasiSekolah: z.number().min(1, 'School participation is required'),
  tingkatPendidikan: z.number().min(1, 'Education level is required'),
  kelasTertinggi: z.number().optional(),
  ijazahTertinggi: z.number().optional(),
});

const updateAnggotaKeluargaSchema = z.object({
  id: z.number(),
  idKeluarga: z.number(),
  nomorUrut: z.number().min(1, 'Sequential number must be at least 1'),
  namaLengkap: z.string().min(2, 'Full name must be at least 2 characters'),
  NIK: z.string().length(16, 'NIK must be 16 digits').regex(/^\d+$/, 'Must contain only numbers'),
  jenisKelamin: z.number().min(1).max(2, 'Gender is required'),
  hubunganKeluarga: z.number().min(1, 'Family relationship is required'),
  statusKawin: z.number().min(1, 'Marital status is required'),
  tempatLahir: z.string().min(2, 'Place of birth is required'),
  tanggalLahir: z.string().min(1, 'Date of birth is required'),
  umur: z.number().min(0, 'Age must be 0 or greater'),
  agama: z.number().min(1, 'Religion is required'),
  kartuIdentitas: z.number().min(1, 'Identity card type is required'),
  domisili: z.number().min(1, 'Domicile status is required'),
  partisipasiSekolah: z.number().min(1, 'School participation is required'),
  tingkatPendidikan: z.number().min(1, 'Education level is required'),
  kelasTertinggi: z.number().optional(),
  ijazahTertinggi: z.number().optional(),
});
```

**Additional Data Sections**:

Each section will have its own dialog form with appropriate fields based on the schema. All sections follow the same pattern:
- Display existing data in a table or card layout
- Provide add/edit/delete buttons
- Use dialog forms for data entry
- Validate with zod schemas
- Submit to server actions
- Show toast notifications

**Section Details**:

1. **Ket Petugas** (Survey Officer Information):
   - Fields: Data collection date, data collector name/code, inspection date, inspector name/code, survey result
   - One record per family
   - References user table for officer codes

2. **Ketenagakerjaan** (Employment Data):
   - Fields: Working status, business field, employment status, main activity, complete status
   - Multiple records per family member
   - Linked to anggota keluarga

3. **Ket Perumahan** (Housing Characteristics):
   - Fields: Floor area, building status, ownership proof, water source, toilet facility, main lighting, electricity power
   - One record per family

4. **Ket Perumahan Blok 2** (Agricultural & Livestock):
   - Fields: Rice field area, garden area, pond area, chickens count, goats count, cattle count
   - One record per family

5. **Bantuan** (Assistance Programs):
   - Fields: Assistance in last year, PKH, BPNT, BOS, BAPANAS, Stunting, KIS, BLT, other assistance
   - Multiple records per family
   - Linked to anggota keluarga (recipient)

6. **Disabilitas** (Disability Information):
   - Fields: Has disability, physical disability, speech disability, visual disability, mental disability, other disability
   - Multiple records per family
   - Linked to anggota keluarga

## Data Models

### Keluarga Type (from schema.ts)

```typescript
export type Keluarga = {
  id: number;
  namaKepalaKeluarga: string;
  anggotaKeluarga: number;
  nomorKartuKeluarga: string;
  alamat: string;
  idMFD: number;
  catatan: string;
};
```

### Anggota Keluarga Type (from schema.ts)

```typescript
export type AnggotaKeluarga = {
  id: number;
  idKeluarga: number;
  nomorUrut: number;
  namaLengkap: string;
  NIK: string;
  jenisKelamin: number;
  hubunganKeluarga: number;
  statusKawin: number;
  tempatLahir: string;
  tanggalLahir: Date;
  umur: number;
  agama: number;
  kartuIdentitas: number;
  domisili: number;
  partisipasiSekolah: number;
  tingkatPendidikan: number;
  kelasTertinggi: number | null;
  ijazahTertinggi: number | null;
};
```

### Server Action Response Type

```typescript
type ActionResponse = {
  success: boolean;
  error?: string;
  message?: string;
  data?: any;
};
```

## Server Actions

### Main Page Actions (actions.ts)

#### getKeluargasAction

**Purpose**: Fetch all keluarga records with MFD information

**Authentication**: Uses `withUser` middleware

**Process**:
1. Fetch all keluarga records with MFD joins using `getAllKeluarga()` from query.ts
2. Return keluarga records array with MFD location data

**Error Handling**:
- Database error → return error message

#### createKeluargaAction

**Purpose**: Create a new keluarga record

**Authentication**: Uses `validatedActionWithUser` middleware

**Validation**: Uses `createKeluargaSchema`

**Process**:
1. Validate input data with zod schema
2. Check if keluarga with same family card number already exists using `getKeluargaByNomorKK()`
3. Create keluarga record using `createKeluarga()` from query.ts
4. Return success response with created keluarga data

**Error Handling**:
- Duplicate family card number → return error message "Family card number already exists"
- Database error → return generic error message
- Validation error → handled by middleware

#### updateKeluargaAction

**Purpose**: Update existing keluarga record

**Authentication**: Uses `validatedActionWithUser` middleware

**Validation**: Uses `updateKeluargaSchema`

**Process**:
1. Validate input data with zod schema
2. Check if updated family card number conflicts with another keluarga record (exclude current record)
3. Update keluarga record using `updateKeluarga()` from query.ts
4. Return success response with updated keluarga data

**Error Handling**:
- Keluarga not found → return error message
- Family card number conflict → return error message
- Database error → return generic error message

#### deleteKeluargaAction

**Purpose**: Delete a keluarga record

**Authentication**: Uses `withUser` middleware

**Process**:
1. Extract keluarga ID from FormData
2. Check if any related records exist (anggota keluarga, ket petugas, etc.) using appropriate query functions
3. If related records exist, prevent deletion and return error
4. Delete keluarga record using `deleteKeluarga()` from query.ts
5. Return success response

**Error Handling**:
- Related records exist → return error message "Cannot delete family record that has associated data"
- Keluarga not found → return error message
- Database error → return generic error message

### Detail Page Actions ([id]/actions.ts)

#### getKeluargaDetailAction

**Purpose**: Fetch complete family data including all related records

**Authentication**: Uses `withUser` middleware

**Process**:
1. Fetch keluarga record by ID
2. Fetch all anggota keluarga for this family
3. Fetch all additional data (ket petugas, employment, housing, assistance, disability)
4. Return complete family data object

**Error Handling**:
- Keluarga not found → return error message
- Database error → return error message

#### createAnggotaKeluargaAction

**Purpose**: Create a new anggota keluarga record

**Authentication**: Uses `validatedActionWithUser` middleware

**Validation**: Uses `createAnggotaKeluargaSchema`

**Process**:
1. Validate input data with zod schema
2. Check if NIK already exists using `getAnggotaKeluargaByNIK()`
3. Create anggota keluarga record using `createAnggotaKeluarga()` from query.ts
4. Return success response with created anggota keluarga data

**Error Handling**:
- Duplicate NIK → return error message "NIK already exists"
- Database error → return generic error message
- Validation error → handled by middleware

#### updateAnggotaKeluargaAction

**Purpose**: Update existing anggota keluarga record

**Authentication**: Uses `validatedActionWithUser` middleware

**Validation**: Uses `updateAnggotaKeluargaSchema`

**Process**:
1. Validate input data with zod schema
2. Check if updated NIK conflicts with another anggota keluarga record (exclude current record)
3. Update anggota keluarga record using `updateAnggotaKeluarga()` from query.ts
4. Return success response with updated anggota keluarga data

**Error Handling**:
- Anggota keluarga not found → return error message
- NIK conflict → return error message
- Database error → return generic error message

#### deleteAnggotaKeluargaAction

**Purpose**: Delete an anggota keluarga record

**Authentication**: Uses `withUser` middleware

**Process**:
1. Extract anggota keluarga ID from FormData
2. Check if any related records exist (ketenagakerjaan, bantuan, disabilitas)
3. If related records exist, prevent deletion and return error
4. Delete anggota keluarga record using `deleteAnggotaKeluarga()` from query.ts
5. Return success response

**Error Handling**:
- Related records exist → return error message "Cannot delete family member that has associated data"
- Anggota keluarga not found → return error message
- Database error → return generic error message

**Additional Actions**: Similar CRUD actions for each additional data section (ket petugas, ketenagakerjaan, housing, assistance, disability) following the same patterns.

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
- Specific errors (duplicate NIK/family card number, related records) shown when appropriate

### Referential Integrity
- Check for related records before deletion
- Prevent deletion if references exist
- Clear error message explaining why deletion failed

## Testing Strategy

### Manual Testing Checklist

1. **Keluarga CRUD**:
   - Create keluarga with valid data → Success
   - Create keluarga with duplicate family card number → Error shown
   - Edit keluarga with valid changes → Success
   - Delete keluarga without related records → Success
   - Delete keluarga with related records → Error shown

2. **Anggota Keluarga CRUD**:
   - Create anggota keluarga with valid data → Success
   - Create anggota keluarga with duplicate NIK → Error shown
   - Edit anggota keluarga with valid changes → Success
   - Delete anggota keluarga without related records → Success
   - Delete anggota keluarga with related records → Error shown

3. **Navigation**:
   - Click view details → Navigate to detail page
   - Back button → Return to main page
   - URL with invalid ID → Show error message

4. **Search and Filter**:
   - Search by family head name → Correct results
   - Search by family card number → Correct results
   - Filter by MFD location → Correct results
   - Clear filters → Return to full list

5. **Additional Data Sections**:
   - Add/edit/delete ket petugas → Success
   - Add/edit/delete employment data → Success
   - Add/edit/delete housing data → Success
   - Add/edit/delete assistance data → Success
   - Add/edit/delete disability data → Success

6. **UI/UX**:
   - View empty state → Proper message displayed
   - Test responsive layout on mobile → Proper display
   - Test loading states → Indicators shown
   - Test toast notifications → Proper messages

7. **Authentication**:
   - Unauthenticated access → Redirect to sign-in
   - Server actions validate session

## UI/UX Considerations

### Responsive Design
- Tables scroll horizontally on mobile
- Show only essential columns on mobile
- Dialog forms are full-width on mobile with scrollable content
- Touch-friendly button sizes (min 44x44px)
- Proper spacing and padding for mobile
- Expandable sections stack vertically on mobile

### Accessibility
- Proper ARIA labels on all interactive elements
- Keyboard navigation support
- Focus management in dialogs
- Screen reader friendly table structure
- Color contrast compliance
- Clear labels for all form fields

### Loading States
- Skeleton loaders for tables during initial load
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
- Badges for status indicators
- Hover states on table rows
- Clear action buttons with icons
- Organized form layout with grouped fields
- Visual hierarchy in forms
- Expandable/collapsible sections for additional data

### Search and Filter UX
- Search input with clear icon
- Filter dropdown with "All" option
- Clear filter button
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
- Only authenticated users can manage persons data

### Data Validation
- Server-side validation with zod
- Client-side validation for UX
- SQL injection prevention via Drizzle ORM
- XSS prevention via React's built-in escaping

### Data Integrity
- Unique NIK validation
- Unique family card number validation
- Referential integrity checks before deletion
- Prevent orphaned related records

## Performance Optimization

### Data Fetching
- Fetch keluarga records once on mount
- Client-side filtering for fast search
- Lazy load detail page data
- Efficient joins for MFD data

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

## Dropdown Options

### Gender (jenisKelamin)
- 1: Male (Laki-laki)
- 2: Female (Perempuan)

### Family Relationship (hubunganKeluarga)
- 1: Head of Family (Kepala Keluarga)
- 2: Spouse (Istri/Suami)
- 3: Child (Anak)
- 4: Son/Daughter-in-law (Menantu)
- 5: Grandchild (Cucu)
- 6: Parent (Orang Tua)
- 7: Parent-in-law (Mertua)
- 8: Sibling (Famili Lain)
- 9: Other (Lainnya)

### Marital Status (statusKawin)
- 1: Not Married (Belum Kawin)
- 2: Married (Kawin)
- 3: Divorced (Cerai Hidup)
- 4: Widowed (Cerai Mati)

### Religion (agama)
- 1: Islam
- 2: Christian (Kristen)
- 3: Catholic (Katolik)
- 4: Hindu
- 5: Buddha
- 6: Confucianism (Konghucu)
- 7: Other (Lainnya)

### Identity Card Type (kartuIdentitas)
- 1: KTP
- 2: SIM
- 3: Passport
- 4: Other (Lainnya)

### Domicile Status (domisili)
- 1: Permanent (Tetap)
- 2: Temporary (Sementara)

### School Participation (partisipasiSekolah)
- 1: Not/Not Yet in School (Tidak/Belum Sekolah)
- 2: Still in School (Masih Sekolah)
- 3: No Longer in School (Tidak Sekolah Lagi)

### Education Level (tingkatPendidikan)
- 1: No Education (Tidak/Belum Pernah Sekolah)
- 2: Not Completed Elementary (Tidak Tamat SD)
- 3: Elementary (SD/Sederajat)
- 4: Junior High (SMP/Sederajat)
- 5: Senior High (SMA/Sederajat)
- 6: Diploma I/II
- 7: Diploma III/Academy
- 8: Diploma IV/Bachelor (S1)
- 9: Master (S2)
- 10: Doctorate (S3)

## Database Query Functions Required

The following query functions from `lib/db/query.ts` will be needed:

**Keluarga Functions**:
- `getAllKeluarga()` - Fetch all keluarga records with MFD joins
- `getKeluargaById(id)` - Fetch single keluarga by ID
- `getKeluargaByNomorKK(nomorKK)` - Check for duplicate family card number
- `createKeluarga(data)` - Create new keluarga record
- `updateKeluarga(id, data)` - Update existing keluarga record
- `deleteKeluarga(id)` - Delete keluarga record

**Anggota Keluarga Functions**:
- `getAnggotaKeluargaByKeluargaId(idKeluarga)` - Fetch all family members for a family
- `getAnggotaKeluargaById(id)` - Fetch single anggota keluarga by ID
- `getAnggotaKeluargaByNIK(NIK)` - Check for duplicate NIK
- `createAnggotaKeluarga(data)` - Create new anggota keluarga record
- `updateAnggotaKeluarga(id, data)` - Update existing anggota keluarga record
- `deleteAnggotaKeluarga(id)` - Delete anggota keluarga record

**Additional Data Functions**:
- Similar CRUD functions for ket petugas, ketenagakerjaan, housing, assistance, and disability tables

All these functions will follow the established patterns in query.ts.

## Future Enhancements

1. **Pagination**: Add pagination for large keluarga lists
2. **Advanced Search**: Search by specific fields
3. **Bulk Operations**: Import census data from CSV/Excel
4. **Export**: Export census data to CSV/Excel
5. **Print**: Generate printable census reports
6. **Statistics**: Dashboard with census statistics and charts
7. **Audit Log**: Track changes to census records
8. **Photo Upload**: Add photo upload for family members
9. **Document Attachments**: Attach scanned documents (KTP, KK, etc.)
10. **Validation Rules**: Add more complex validation rules
11. **Auto-complete**: Suggest existing values when entering data
12. **Duplicate Detection**: Warn about similar records before creation
13. **History**: View change history for each record
14. **Batch Operations**: Update multiple records at once
15. **Advanced Filters**: Filter by age range, education level, etc.

## Implementation Notes

### Form Organization

**Keluarga Form**:
```
Family Information:
  - Family Head Name
  - Number of Family Members
  - Family Card Number
  - Address
  - MFD Location (searchable dropdown)
  - Notes
```

**Anggota Keluarga Form** (organized in sections):
```
Personal Information:
  - Sequential Number | Full Name
  - NIK | Gender
  - Family Relationship | Marital Status

Birth Information:
  - Place of Birth | Date of Birth
  - Age (auto-calculated)

Identity & Domicile:
  - Religion | Identity Card Type
  - Domicile Status

Education:
  - School Participation | Education Level
  - Highest Class | Highest Diploma
```

### MFD Dropdown Implementation
- Searchable dropdown with autocomplete
- Display format: "Province - District - Village"
- Load all MFD records on mount
- Filter options as user types
- Show MFD code in tooltip

### Age Auto-calculation
- Calculate age from date of birth automatically
- Update age field when date of birth changes
- Allow manual override if needed

### Sequential Number Auto-increment
- Suggest next sequential number based on existing family members
- Allow manual override
- Validate uniqueness within family

### Navigation Flow
```
Main Page (Keluarga List)
  ↓ Click "View Details"
Detail Page (Family ID)
  ↓ Shows: Family Info + Anggota Keluarga + Additional Data
  ↓ Click "Back to Families"
Main Page (Keluarga List)
```

### Dialog Size Guidelines
- Keluarga dialog: Medium (600px)
- Anggota keluarga dialog: Large (800px) - many fields
- Additional data dialogs: Medium to Large depending on fields
- All dialogs scrollable on small screens
