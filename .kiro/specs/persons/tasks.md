# Implementation Plan

- [x] 1. Set up database query functions





  - Create query functions in lib/db/query.ts for keluarga operations
  - Create query functions for anggota keluarga operations
  - Create query functions for additional data tables (ket petugas, ketenagakerjaan, housing, assistance, disability)
  - _Requirements: 1.1, 2.3, 3.3, 4.3, 5.3, 6.3, 7.3, 8.3_

- [x] 2. Create reusable form field components





  - [x] 2.1 Implement MFDSelect component


    - Create searchable dropdown component for MFD location selection
    - Implement filtering and search functionality
    - Add loading state and error handling
    - Display format: "Province - District - Village"
    - _Requirements: 2.2, 3.2, 10.1_

  - [x] 2.2 Implement CodedSelect component


    - Create reusable dropdown component for coded fields
    - Accept options array as prop
    - Display code and description
    - Handle error states
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7, 16.8, 16.9_

  - [x] 2.3 Implement DatePickerField component


    - Create date picker component with validation
    - Integrate with React Hook Form
    - Handle date formatting
    - _Requirements: 10.5, 6.2_

  - [x] 2.4 Implement UserSelect component


    - Create dropdown component for user selection (ket petugas)
    - Fetch all users from database
    - Display format: "Name (Username)"
    - Implement search/filter functionality
    - Handle loading and error states
    - _Requirements: 15.1_

  - [x] 2.5 Implement AnggotaSelect component


    - Create dropdown component for family member selection
    - Fetch family members for specific keluarga
    - Display format: "Full Name (NIK)"
    - Handle empty state (no family members)
    - Handle loading and error states
    - _Requirements: 15.2, 15.5, 15.6_

- [x] 3. Create keluarga form components




  - [x] 3.1 Implement KeluargaForm component


    - Create form component with React Hook Form and zod validation
    - Add fields: family head name, number of members, family card number, address, MFD selection, notes
    - Implement validation schema (createKeluargaSchema)
    - Add inline validation error display
    - _Requirements: 2.2, 2.7, 10.1, 10.2, 10.3, 10.6, 10.7_

  - [x] 3.2 Implement KeluargaDialog component


    - Create dialog wrapper for KeluargaForm
    - Handle create and edit modes
    - Integrate with server actions (createKeluargaAction, updateKeluargaAction)
    - Show loading states and toast notifications
    - _Requirements: 2.1, 2.3, 2.6, 3.1, 3.3, 3.6, 11.1, 11.2, 12.1, 12.2, 12.4_
-

- [x] 4. Create anggota keluarga form components



  - [x] 4.1 Implement AnggotaKeluargaForm component


    - Create form component with React Hook Form and zod validation
    - Organize fields in sections: Personal, Birth, Identity, Education
    - Add all 16 anggota keluarga fields with appropriate input types
    - Implement auto-calculation for age from date of birth
    - Use CodedSelect for all coded fields (gender, religion, education, etc.)
    - Implement validation schema (createAnggotaKeluargaSchema)
    - _Requirements: 6.2, 6.7, 7.2, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 16.1-16.10_

  - [x] 4.2 Implement AnggotaKeluargaDialog component


    - Create dialog wrapper for AnggotaKeluargaForm
    - Handle create and edit modes
    - Integrate with server actions (createAnggotaKeluargaAction, updateAnggotaKeluargaAction)
    - Show loading states and toast notifications
    - _Requirements: 6.1, 6.3, 6.6, 7.1, 7.3, 7.6, 11.1, 11.2, 12.1, 12.2, 12.4_

- [x] 5. Create additional data form components





  - [x] 5.1 Implement KetPetugasForm and dialog


    - Create form for survey officer information
    - Add fields: data collection date, collector name/code, inspection date, inspector name/code, survey result
    - Use UserSelect component for pendata and pemeriksa selection
    - Reference user table for officer codes
    - _Requirements: 15.1_

  - [x] 5.2 Implement KetenagakerjaanForm and dialog


    - Create form for employment data
    - Add fields: working status, business field, employment status, main activity, complete status
    - Use AnggotaSelect component to select family member
    - Link to anggota keluarga
    - _Requirements: 15.2_

  - [x] 5.3 Implement HousingForm and dialog


    - Create form for housing characteristics
    - Add fields: floor area, building status, ownership proof, water source, toilet facility, main lighting, electricity power
    - _Requirements: 15.3_

  - [x] 5.4 Implement HousingBlok2Form and dialog


    - Create form for agricultural and livestock data
    - Add fields: rice field area, garden area, pond area, chickens count, goats count, cattle count
    - _Requirements: 15.4_

  - [x] 5.5 Implement BantuanForm and dialog


    - Create form for assistance programs
    - Add fields: assistance in last year, PKH, BPNT, BOS, BAPANAS, Stunting, KIS, BLT, other assistance
    - Use AnggotaSelect component to select recipient family member
    - Link to anggota keluarga (recipient)
    - _Requirements: 15.5_

  - [x] 5.6 Implement DisabilitasForm and dialog


    - Create form for disability information
    - Add fields: has disability, physical, speech, visual, mental, other disability types
    - Use AnggotaSelect component to select family member
    - Link to anggota keluarga
    - _Requirements: 15.6_

- [x] 6. Implement main persons page server actions





  - [x] 6.1 Implement getKeluargasAction


    - Create server action to fetch all keluarga records with MFD joins
    - Use withUser middleware for authentication
    - Return keluarga array with MFD location data
    - Handle database errors
    - _Requirements: 1.1, 1.2, 14.1, 14.2, 14.3, 14.4, 14.5_

  - [x] 6.2 Implement createKeluargaAction

    - Create server action with validatedActionWithUser middleware
    - Validate input with createKeluargaSchema
    - Check for duplicate family card number
    - Create keluarga record in database
    - Return success response or error message
    - _Requirements: 2.3, 2.4, 2.5, 2.6, 14.3, 14.4_

  - [x] 6.3 Implement updateKeluargaAction

    - Create server action with validatedActionWithUser middleware
    - Validate input with updateKeluargaSchema
    - Check for family card number conflicts (exclude current record)
    - Update keluarga record in database
    - Return success response or error message
    - _Requirements: 3.3, 3.4, 3.5, 3.6, 14.3, 14.4_

  - [x] 6.4 Implement deleteKeluargaAction

    - Create server action with withUser middleware
    - Check for related records (anggota keluarga, ket petugas, etc.)
    - Prevent deletion if related records exist
    - Delete keluarga record if no dependencies
    - Return success response or error message
    - _Requirements: 4.3, 4.4, 4.5, 14.3, 14.4_

- [x] 7. Implement main persons page





  - [x] 7.1 Create page component structure


    - Set up client component with state management
    - Initialize states for keluarga list, dialogs, search, filter, loading
    - Fetch keluarga data on mount using getKeluargasAction
    - _Requirements: 1.1, 11.3_

  - [x] 7.2 Implement keluarga table

    - Create responsive table with columns: family head name, number of members, family card number, address, MFD location, actions
    - Add view details, edit, and delete buttons for each row
    - Implement mobile responsive layout (show only essential columns)
    - Handle empty state display
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 13.1, 13.3, 13.4_

  - [x] 7.3 Implement search functionality

    - Add search input field at top of page
    - Filter keluarga records by family head name, family card number, and address
    - Implement case-insensitive real-time filtering
    - _Requirements: 9.1, 9.2, 9.5_

  - [x] 7.4 Implement MFD location filter

    - Add MFD location dropdown filter
    - Display format: "Province - District - Village"
    - Add "All Locations" option
    - Add clear filter button
    - _Requirements: 9.3, 9.4, 9.5_

  - [x] 7.5 Integrate keluarga dialogs

    - Add "Add Family" button that opens KeluargaDialog in create mode
    - Wire edit buttons to open KeluargaDialog in edit mode with selected keluarga data
    - Wire delete buttons to open confirmation dialog
    - Handle dialog success callbacks to refresh keluarga list
    - _Requirements: 1.4, 2.1, 2.6, 3.1, 3.6, 4.1, 4.2, 4.5_

  - [x] 7.6 Implement navigation to detail page

    - Wire view details buttons to navigate to /persons/[id] route
    - Pass keluarga ID as route parameter
    - _Requirements: 5.1_

- [x] 8. Implement family detail page server actions





  - [x] 8.1 Implement getKeluargaDetailAction


    - Create server action to fetch complete family data
    - Fetch keluarga record by ID
    - Fetch all anggota keluarga for the family
    - Fetch all additional data (ket petugas, employment, housing, assistance, disability)
    - Return complete family data object
    - Handle keluarga not found error
    - _Requirements: 5.2, 5.3, 5.6, 14.3, 14.4_

  - [x] 8.2 Implement createAnggotaKeluargaAction

    - Create server action with validatedActionWithUser middleware
    - Validate input with createAnggotaKeluargaSchema
    - Check for duplicate NIK
    - Create anggota keluarga record linked to family
    - Return success response or error message
    - _Requirements: 6.3, 6.4, 6.5, 6.6, 14.3, 14.4_

  - [x] 8.3 Implement updateAnggotaKeluargaAction

    - Create server action with validatedActionWithUser middleware
    - Validate input with updateAnggotaKeluargaSchema
    - Check for NIK conflicts (exclude current record)
    - Update anggota keluarga record
    - Return success response or error message
    - _Requirements: 7.3, 7.4, 7.5, 7.6, 14.3, 14.4_

  - [x] 8.4 Implement deleteAnggotaKeluargaAction

    - Create server action with withUser middleware
    - Check for related records (ketenagakerjaan, bantuan, disabilitas)
    - Prevent deletion if related records exist
    - Delete anggota keluarga record if no dependencies
    - Return success response or error message
    - _Requirements: 8.3, 8.4, 8.5, 14.3, 14.4_

  - [x] 8.5 Implement server actions for additional data sections

    - Create CRUD actions for ket petugas
    - Create CRUD actions for ketenagakerjaan
    - Create CRUD actions for housing (both tables)
    - Create CRUD actions for bantuan
    - Create CRUD actions for disabilitas
    - All actions follow same pattern with validation and error handling
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8_

- [ ] 9. Implement family detail page
  - [ ] 9.1 Create page component structure
    - Set up client component with state management
    - Extract family ID from route params
    - Initialize states for family data, anggota keluarga, additional data, dialogs, loading
    - Fetch complete family data on mount using getKeluargaDetailAction
    - Handle invalid family ID error
    - _Requirements: 5.1, 5.2, 11.3_

  - [ ] 9.2 Display family information section
    - Show family details at top of page (read-only)
    - Display: family head name, number of members, family card number, address, MFD location, notes
    - Add "Edit Family" button that opens KeluargaDialog
    - Add "Back to Families" navigation button
    - _Requirements: 5.2_

  - [ ] 9.3 Implement anggota keluarga table
    - Create responsive table with columns: sequential number, full name, NIK, gender, family relationship, age, education level, actions
    - Add "Add Family Member" button above table
    - Add edit and delete buttons for each row
    - Implement mobile responsive layout (show only essential columns)
    - Handle empty state when no family members exist
    - _Requirements: 5.3, 5.4, 5.5, 13.1, 13.3, 13.4_

  - [ ] 9.4 Integrate anggota keluarga dialogs
    - Wire "Add Family Member" button to open AnggotaKeluargaDialog in create mode
    - Wire edit buttons to open AnggotaKeluargaDialog in edit mode with selected member data
    - Wire delete buttons to open confirmation dialog
    - Handle dialog success callbacks to refresh anggota keluarga list
    - _Requirements: 6.1, 6.6, 7.1, 7.6, 8.1, 8.2, 8.5_

  - [ ] 9.5 Implement additional data sections
    - Create expandable/collapsible sections for each data type
    - Display existing data in tables or card layouts
    - Add add/edit/delete buttons for each section
    - Integrate dialog forms for each data type
    - Handle empty states for each section
    - _Requirements: 5.6, 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7_

- [ ] 10. Add navigation menu item
  - Add "Persons" menu item to app sidebar
  - Link to /dashboard/persons route
  - Add appropriate icon
  - _Requirements: 1.1_

- [ ] 11. Implement responsive design and accessibility
  - [ ] 11.1 Test and refine mobile layouts
    - Test all tables on mobile devices
    - Verify dialog forms are scrollable and properly sized
    - Ensure touch-friendly button sizes (min 44x44px)
    - Test expandable sections on mobile
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

  - [ ] 11.2 Add accessibility features
    - Add ARIA labels to all interactive elements
    - Ensure keyboard navigation works for all dialogs and forms
    - Verify focus management in dialogs
    - Test with screen reader
    - Verify color contrast compliance
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [ ] 12. Add loading states and user feedback
  - [ ] 12.1 Implement loading indicators
    - Add skeleton loaders for tables during initial load
    - Show loading spinners in dialog submit buttons
    - Disable form inputs during submission
    - Add loading state to all action buttons
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [ ] 12.2 Implement toast notifications
    - Add success toast for create operations
    - Add success toast for update operations
    - Add success toast for delete operations
    - Add error toast for failed operations with descriptive messages
    - Configure auto-dismiss after 5 seconds
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 13. Testing and validation
  - [ ] 13.1 Test keluarga CRUD operations
    - Test create with valid data
    - Test create with duplicate family card number
    - Test edit with valid changes
    - Test edit with conflicting family card number
    - Test delete without related records
    - Test delete with related records (should fail)
    - _Requirements: 2.3, 2.4, 2.5, 3.3, 3.4, 3.5, 4.3, 4.4_

  - [ ] 13.2 Test anggota keluarga CRUD operations
    - Test create with valid data
    - Test create with duplicate NIK
    - Test edit with valid changes
    - Test edit with conflicting NIK
    - Test delete without related records
    - Test delete with related records (should fail)
    - Test age auto-calculation from date of birth
    - _Requirements: 6.3, 6.4, 6.5, 7.3, 7.4, 7.5, 8.3, 8.4_

  - [ ] 13.3 Test additional data sections
    - Test CRUD operations for ket petugas
    - Test CRUD operations for ketenagakerjaan
    - Test CRUD operations for housing data
    - Test CRUD operations for assistance programs
    - Test CRUD operations for disability information
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_

  - [ ] 13.4 Test search and filter functionality
    - Test search by family head name
    - Test search by family card number
    - Test search by address
    - Test MFD location filter
    - Test clear filters
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ] 13.5 Test navigation and routing
    - Test navigation from main page to detail page
    - Test back button from detail page
    - Test URL with invalid family ID
    - _Requirements: 5.1_

  - [ ] 13.6 Test form validation
    - Test all required field validations
    - Test NIK format validation (16 digits)
    - Test family card number format validation (16 digits)
    - Test numeric field validations
    - Test date field validations
    - Test inline error message display
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

  - [ ] 13.7 Test responsive design
    - Test all pages on mobile devices
    - Test all dialogs on mobile devices
    - Test table layouts on different screen sizes
    - Verify touch-friendly interactions
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

  - [ ] 13.8 Test authentication
    - Test unauthenticated access (should redirect)
    - Test server action authentication
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
