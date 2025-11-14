# Requirements Document

## Introduction

This document outlines the requirements for implementing a Persons Management System within the RBAC Dashboard. The Persons system manages comprehensive household census data including family information (keluarga), family members (anggota keluarga), employment details, housing conditions, assistance programs, and disability information. The system enables authorized users to perform Create, Read, Update, and Delete (CRUD) operations on person records through dedicated pages for complex forms and dialog-based interfaces for simpler data entry, with proper validation and user feedback mechanisms.

## Glossary

- **Persons System**: A comprehensive household census data management system
- **Keluarga**: Family household unit containing family head information, address, and MFD reference
- **Anggota Keluarga**: Individual family member with personal details, education, and demographic information
- **Ket Petugas**: Survey officer information including data collector and inspector details
- **Ketenagakerjaan**: Employment information for family members
- **Ket Perumahan**: Housing characteristics including floor area, ownership, utilities
- **Ket Perumahan Blok 2**: Agricultural land and livestock ownership information
- **Bantuan**: Government assistance programs received by the family
- **Disabilitas**: Disability information for family members
- **MFD (Master File Desa)**: Geographic administrative reference linking families to locations
- **NIK**: National Identification Number (Nomor Induk Kependudukan)
- **Server Action**: Next.js server-side function that handles data mutations
- **Validation Schema**: A zod schema that defines rules for data validation
- **Dialog Form**: A modal overlay component used for simple data entry
- **Dedicated Page Form**: A full-page form component used for complex data entry with many fields

## Requirements

### Requirement 1

**User Story:** As a data administrator, I want to view a list of all family records (keluarga) in the system, so that I can see all registered households

#### Acceptance Criteria

1. WHEN the administrator navigates to the persons page, THE Persons Management System SHALL display a table containing all keluarga records
2. THE Persons Management System SHALL display the following information in each table row: family head name, number of family members, family card number, address, and MFD location
3. THE Persons Management System SHALL provide action buttons for each keluarga record to enable view details, edit, and delete operations
4. THE Persons Management System SHALL display an "Add Family" button at the top of the page
5. WHEN no keluarga records exist in the database, THE Persons Management System SHALL display an empty state message

### Requirement 2

**User Story:** As a data administrator, I want to create new family records using a dialog form, so that I can quickly add new households

#### Acceptance Criteria

1. WHEN the administrator clicks the "Add Family" button, THE Persons Management System SHALL open a dialog form with empty input fields
2. THE Persons Management System SHALL provide input fields for: family head name, number of family members, family card number, address, MFD selection dropdown, and notes
3. WHEN the administrator submits the form with valid data, THE Persons Management System SHALL create a new keluarga record in the database
4. THE Persons Management System SHALL validate that the family card number is unique
5. IF a duplicate family card number exists, THEN THE Persons Management System SHALL display an error message stating "Family card number already exists"
6. WHEN the keluarga creation succeeds, THE Persons Management System SHALL close the dialog and refresh the keluarga list
7. THE Persons Management System SHALL validate all required fields before submission

### Requirement 3

**User Story:** As a data administrator, I want to edit existing family records using a dialog form, so that I can update household information

#### Acceptance Criteria

1. WHEN the administrator clicks the edit button for a keluarga record, THE Persons Management System SHALL open a dialog form pre-filled with the current keluarga data
2. THE Persons Management System SHALL allow editing of all fields: family head name, number of family members, family card number, address, MFD selection, and notes
3. WHEN the administrator submits the form with valid changes, THE Persons Management System SHALL update the keluarga record in the database
4. THE Persons Management System SHALL validate that the updated family card number does not conflict with other existing records
5. IF the updated family card number conflicts with another keluarga record, THEN THE Persons Management System SHALL display an error message
6. WHEN the update succeeds, THE Persons Management System SHALL close the dialog and refresh the keluarga list with updated information

### Requirement 4

**User Story:** As a data administrator, I want to delete family records, so that I can remove obsolete or incorrect household data

#### Acceptance Criteria

1. WHEN the administrator clicks the delete button for a keluarga record, THE Persons Management System SHALL display a confirmation dialog
2. THE Persons Management System SHALL display the family head name and family card number in the confirmation message to prevent accidental deletions
3. WHEN the administrator confirms the deletion, THE Persons Management System SHALL check if any related records exist (anggota keluarga, ket petugas, etc.)
4. IF related records exist, THEN THE Persons Management System SHALL prevent deletion and display an error message stating "Cannot delete family record that has associated data"
5. WHEN the deletion succeeds, THE Persons Management System SHALL refresh the keluarga list to remove the deleted record from view

### Requirement 5

**User Story:** As a data administrator, I want to view detailed information for a family, so that I can see all associated data including family members and other details

#### Acceptance Criteria

1. WHEN the administrator clicks the view details button for a keluarga record, THE Persons Management System SHALL navigate to a dedicated detail page
2. THE Persons Management System SHALL display the family information at the top of the page
3. THE Persons Management System SHALL display a table of anggota keluarga (family members) for this family
4. THE Persons Management System SHALL provide an "Add Family Member" button above the anggota keluarga table
5. THE Persons Management System SHALL display action buttons for each anggota keluarga to enable edit and delete operations
6. THE Persons Management System SHALL display additional sections for ket petugas, ketenagakerjaan, housing, assistance, and disability information

### Requirement 6

**User Story:** As a data administrator, I want to add family members using a dialog form, so that I can register individuals within a household

#### Acceptance Criteria

1. WHEN the administrator clicks the "Add Family Member" button on the family detail page, THE Persons Management System SHALL open a dialog form with empty input fields
2. THE Persons Management System SHALL provide input fields for: sequential number, full name, NIK, gender, family relationship, marital status, place of birth, date of birth, age, religion, identity card type, domicile status, school participation, education level, highest class, and highest diploma
3. WHEN the administrator submits the form with valid data, THE Persons Management System SHALL create a new anggota keluarga record linked to the current family
4. THE Persons Management System SHALL validate that the NIK is unique across all family members
5. IF a duplicate NIK exists, THEN THE Persons Management System SHALL display an error message stating "NIK already exists"
6. WHEN the anggota keluarga creation succeeds, THE Persons Management System SHALL close the dialog and refresh the family members list
7. THE Persons Management System SHALL validate all required fields before submission

### Requirement 7

**User Story:** As a data administrator, I want to edit family member information using a dialog form, so that I can update individual details

#### Acceptance Criteria

1. WHEN the administrator clicks the edit button for an anggota keluarga record, THE Persons Management System SHALL open a dialog form pre-filled with the current member data
2. THE Persons Management System SHALL allow editing of all anggota keluarga fields
3. WHEN the administrator submits the form with valid changes, THE Persons Management System SHALL update the anggota keluarga record in the database
4. THE Persons Management System SHALL validate that the updated NIK does not conflict with other existing records
5. IF the updated NIK conflicts with another anggota keluarga record, THEN THE Persons Management System SHALL display an error message
6. WHEN the update succeeds, THE Persons Management System SHALL close the dialog and refresh the family members list with updated information

### Requirement 8

**User Story:** As a data administrator, I want to delete family member records, so that I can remove individuals who are no longer part of the household

#### Acceptance Criteria

1. WHEN the administrator clicks the delete button for an anggota keluarga record, THE Persons Management System SHALL display a confirmation dialog
2. THE Persons Management System SHALL display the member's full name and NIK in the confirmation message to prevent accidental deletions
3. WHEN the administrator confirms the deletion, THE Persons Management System SHALL check if any related records exist (ketenagakerjaan, bantuan, disabilitas)
4. IF related records exist, THEN THE Persons Management System SHALL prevent deletion and display an error message stating "Cannot delete family member that has associated data"
5. WHEN the deletion succeeds, THE Persons Management System SHALL refresh the family members list to remove the deleted record from view

### Requirement 9

**User Story:** As a data administrator, I want to search and filter family records, so that I can quickly find specific households

#### Acceptance Criteria

1. THE Persons Management System SHALL provide a search input field that filters keluarga records by family head name, family card number, or address
2. WHEN the administrator types in the search field, THE Persons Management System SHALL filter the table to show only matching records
3. THE Persons Management System SHALL provide a filter dropdown for MFD location (province, district, village)
4. WHEN a filter is applied, THE Persons Management System SHALL display only records matching the selected criteria
5. THE Persons Management System SHALL allow clearing all filters to return to the full list view

### Requirement 10

**User Story:** As a data administrator, I want form validation on all inputs, so that only valid census data is stored in the database

#### Acceptance Criteria

1. THE Persons Management System SHALL validate that all required text fields contain at least 2 characters
2. THE Persons Management System SHALL validate that NIK follows the correct format (16 digits)
3. THE Persons Management System SHALL validate that family card number follows the correct format (16 digits)
4. THE Persons Management System SHALL validate that numeric fields contain valid numbers
5. THE Persons Management System SHALL validate that date fields contain valid dates
6. THE Persons Management System SHALL display inline error messages for each invalid field
7. THE Persons Management System SHALL prevent form submission until all validation rules are satisfied

### Requirement 11

**User Story:** As a data administrator, I want to see loading states during operations, so that I know the system is processing my request

#### Acceptance Criteria

1. WHEN a create, update, or delete operation is in progress, THE Persons Management System SHALL display a loading indicator
2. THE Persons Management System SHALL disable form submission buttons during processing to prevent duplicate submissions
3. WHEN the table is loading data, THE Persons Management System SHALL display skeleton loaders or a loading spinner
4. THE Persons Management System SHALL provide visual feedback within 100 milliseconds of user interaction

### Requirement 12

**User Story:** As a data administrator, I want to see success and error messages, so that I know whether my actions completed successfully

#### Acceptance Criteria

1. WHEN a record is successfully created, THE Persons Management System SHALL display a success toast notification
2. WHEN a record is successfully updated, THE Persons Management System SHALL display a success toast notification
3. WHEN a record is successfully deleted, THE Persons Management System SHALL display a success toast notification
4. IF any operation fails, THEN THE Persons Management System SHALL display an error toast notification with a descriptive message
5. THE Persons Management System SHALL automatically dismiss toast notifications after 5 seconds

### Requirement 13

**User Story:** As a data administrator, I want the persons management interface to be responsive, so that I can manage census data from any device

#### Acceptance Criteria

1. WHEN viewed on mobile devices with width less than 768 pixels, THE Persons Management System SHALL display a responsive table layout
2. THE Persons Management System SHALL ensure dialog forms are properly sized and scrollable on small screens
3. THE Persons Management System SHALL maintain touch-friendly button sizes of at least 44 by 44 pixels on mobile devices
4. THE Persons Management System SHALL adapt tables to show essential columns on mobile and all columns on desktop

### Requirement 14

**User Story:** As a system, I want to ensure only authenticated users can access persons management, so that census data remains secure

#### Acceptance Criteria

1. THE Persons Management System SHALL verify user authentication before displaying the persons management page
2. IF the user is not authenticated, THEN THE Persons Management System SHALL redirect to the sign-in page
3. THE Persons Management System SHALL use server actions with authentication middleware for all CRUD operations
4. THE Persons Management System SHALL validate the user session on every server action invocation
5. THE Persons Management System SHALL prevent unauthorized access to persons management functionality

### Requirement 15

**User Story:** As a data administrator, I want to manage additional family data sections, so that I can record comprehensive census information

#### Acceptance Criteria

1. THE Persons Management System SHALL provide sections for managing ket petugas (survey officer information)
2. THE Persons Management System SHALL provide sections for managing ketenagakerjaan (employment data) for family members
3. THE Persons Management System SHALL provide sections for managing ket perumahan (housing characteristics)
4. THE Persons Management System SHALL provide sections for managing ket perumahan blok 2 (agricultural and livestock data)
5. THE Persons Management System SHALL provide sections for managing bantuan (assistance programs)
6. THE Persons Management System SHALL provide sections for managing disabilitas (disability information)
7. THE Persons Management System SHALL use dialog forms for all additional data sections
8. THE Persons Management System SHALL link all additional data to the appropriate keluarga or anggota keluarga record

### Requirement 16

**User Story:** As a data administrator, I want dropdown selections for coded fields, so that I can ensure data consistency

#### Acceptance Criteria

1. THE Persons Management System SHALL provide dropdown selections for gender (1: Male, 2: Female)
2. THE Persons Management System SHALL provide dropdown selections for family relationship codes
3. THE Persons Management System SHALL provide dropdown selections for marital status codes
4. THE Persons Management System SHALL provide dropdown selections for religion codes
5. THE Persons Management System SHALL provide dropdown selections for identity card type codes
6. THE Persons Management System SHALL provide dropdown selections for domicile status codes
7. THE Persons Management System SHALL provide dropdown selections for school participation codes
8. THE Persons Management System SHALL provide dropdown selections for education level codes
9. THE Persons Management System SHALL display both code and description in dropdown options
10. THE Persons Management System SHALL store only the code value in the database
