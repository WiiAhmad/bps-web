# Requirements Document

## Introduction

This document outlines the requirements for implementing a Master File Desa (MFD) management system within the RBAC Dashboard. The MFD system manages hierarchical geographic administrative data from province level down to sub-SLS (Sub Satuan Lingkungan Setempat) level. The system will enable authorized users to perform Create, Read, Update, and Delete (CRUD) operations on MFD records through an intuitive interface with proper validation and user feedback mechanisms.

## Glossary

- **MFD (Master File Desa)**: A hierarchical geographic administrative data structure containing province, district, sub-district, village, hamlet, SLS, and sub-SLS information
- **Province (Provinsi)**: The highest administrative level in the geographic hierarchy
- **District (Kabupaten)**: Administrative level below province
- **Sub-District (Kecamatan)**: Administrative level below district
- **Village (Desa)**: Administrative level below sub-district
- **Hamlet (Dusun)**: Administrative level below village
- **SLS (Satuan Lingkungan Setempat)**: Census enumeration area within a hamlet
- **Sub-SLS**: Subdivision of an SLS for detailed census enumeration
- **MFD Record**: A database entry containing complete hierarchical geographic information with names and codes
- **Geographic Code**: A unique identifier code for each administrative level
- **Server Action**: Next.js server-side function that handles data mutations
- **Validation Schema**: A zod schema that defines rules for data validation
- **Dialog Form**: A modal overlay component used for data entry and editing

## Requirements

### Requirement 1

**User Story:** As a data administrator, I want to view a list of all MFD records in the system, so that I can see the complete geographic hierarchy

#### Acceptance Criteria

1. WHEN the administrator navigates to the MFD page, THE MFD Management System SHALL display a table containing all MFD records
2. THE MFD Management System SHALL display the following information in each table row: province name and code, district name and code, sub-district name and code, village name and code, hamlet name and code, SLS name and code, and sub-SLS name and code
3. THE MFD Management System SHALL provide action buttons for each MFD record to enable edit and delete operations
4. THE MFD Management System SHALL display records in a hierarchical or grouped format for easy navigation
5. WHEN no MFD records exist in the database, THE MFD Management System SHALL display an empty state message

### Requirement 2

**User Story:** As a data administrator, I want to create new MFD records, so that I can add new geographic areas to the system

#### Acceptance Criteria

1. WHEN the administrator clicks the add MFD button, THE MFD Management System SHALL open a dialog form with empty input fields
2. THE MFD Management System SHALL provide input fields for: province name and code, district name and code, sub-district name and code, village name and code, hamlet name and code, SLS name and code, and sub-SLS name and code
3. WHEN the administrator submits the form with valid data, THE MFD Management System SHALL create a new MFD record in the database
4. THE MFD Management System SHALL validate that the combination of village code, hamlet code, SLS code, and sub-SLS code is unique
5. IF a duplicate geographic code combination exists, THEN THE MFD Management System SHALL display an error message stating "MFD record with this code combination already exists"
6. WHEN the MFD creation succeeds, THE MFD Management System SHALL close the dialog and refresh the MFD list
7. THE MFD Management System SHALL validate all required fields before submission

### Requirement 3

**User Story:** As a data administrator, I want to edit existing MFD records, so that I can correct or update geographic information

#### Acceptance Criteria

1. WHEN the administrator clicks the edit button for an MFD record, THE MFD Management System SHALL open a dialog form pre-filled with the current MFD data
2. THE MFD Management System SHALL allow editing of all fields: province name and code, district name and code, sub-district name and code, village name and code, hamlet name and code, SLS name and code, and sub-SLS name and code
3. WHEN the administrator submits the form with valid changes, THE MFD Management System SHALL update the MFD record in the database
4. THE MFD Management System SHALL validate that the updated code combination does not conflict with other existing records
5. IF the updated codes conflict with another MFD record, THEN THE MFD Management System SHALL display an error message
6. WHEN the update succeeds, THE MFD Management System SHALL close the dialog and refresh the MFD list with updated information

### Requirement 4

**User Story:** As a data administrator, I want to delete MFD records, so that I can remove obsolete or incorrect geographic data

#### Acceptance Criteria

1. WHEN the administrator clicks the delete button for an MFD record, THE MFD Management System SHALL display a confirmation dialog
2. THE MFD Management System SHALL display the village name and codes in the confirmation message to prevent accidental deletions
3. WHEN the administrator confirms the deletion, THE MFD Management System SHALL check if any family records reference this MFD
4. IF family records reference this MFD, THEN THE MFD Management System SHALL prevent deletion and display an error message stating "Cannot delete MFD record that has associated family records"
5. WHEN the deletion succeeds, THE MFD Management System SHALL refresh the MFD list to remove the deleted record from view

### Requirement 5

**User Story:** As a data administrator, I want to search and filter MFD records, so that I can quickly find specific geographic areas

#### Acceptance Criteria

1. THE MFD Management System SHALL provide a search input field that filters records by province, district, sub-district, village, hamlet, SLS, or sub-SLS names
2. WHEN the administrator types in the search field, THE MFD Management System SHALL filter the table to show only matching records
3. THE MFD Management System SHALL provide dropdown filters for province, district, and sub-district levels
4. WHEN a filter is applied, THE MFD Management System SHALL display only records matching the selected criteria
5. THE MFD Management System SHALL allow clearing all filters to return to the full list view

### Requirement 6

**User Story:** As a data administrator, I want form validation on MFD inputs, so that only valid geographic data is stored in the database

#### Acceptance Criteria

1. THE MFD Management System SHALL validate that all name fields contain at least 2 characters
2. THE MFD Management System SHALL validate that all code fields are provided and not empty
3. THE MFD Management System SHALL validate that codes follow the expected format for each administrative level
4. THE MFD Management System SHALL display inline error messages for each invalid field
5. THE MFD Management System SHALL prevent form submission until all validation rules are satisfied

### Requirement 7

**User Story:** As a data administrator, I want to see loading states during operations, so that I know the system is processing my request

#### Acceptance Criteria

1. WHEN a create, update, or delete operation is in progress, THE MFD Management System SHALL display a loading indicator
2. THE MFD Management System SHALL disable form submission buttons during processing to prevent duplicate submissions
3. WHEN the table is loading MFD data, THE MFD Management System SHALL display skeleton loaders or a loading spinner
4. THE MFD Management System SHALL provide visual feedback within 100 milliseconds of user interaction

### Requirement 8

**User Story:** As a data administrator, I want to see success and error messages, so that I know whether my actions completed successfully

#### Acceptance Criteria

1. WHEN an MFD record is successfully created, THE MFD Management System SHALL display a success toast notification
2. WHEN an MFD record is successfully updated, THE MFD Management System SHALL display a success toast notification
3. WHEN an MFD record is successfully deleted, THE MFD Management System SHALL display a success toast notification
4. IF any operation fails, THEN THE MFD Management System SHALL display an error toast notification with a descriptive message
5. THE MFD Management System SHALL automatically dismiss toast notifications after 5 seconds

### Requirement 9

**User Story:** As a data administrator, I want the MFD management interface to be responsive, so that I can manage geographic data from any device

#### Acceptance Criteria

1. WHEN viewed on mobile devices with width less than 768 pixels, THE MFD Management System SHALL display a responsive table layout
2. THE MFD Management System SHALL ensure dialog forms are properly sized and scrollable on small screens
3. THE MFD Management System SHALL maintain touch-friendly button sizes of at least 44 by 44 pixels on mobile devices
4. THE MFD Management System SHALL adapt the table to show essential columns on mobile and all columns on desktop

### Requirement 10

**User Story:** As a system, I want to ensure only authenticated users can access MFD management, so that geographic data remains secure

#### Acceptance Criteria

1. THE MFD Management System SHALL verify user authentication before displaying the MFD management page
2. IF the user is not authenticated, THEN THE MFD Management System SHALL redirect to the sign-in page
3. THE MFD Management System SHALL use server actions with authentication middleware for all CRUD operations
4. THE MFD Management System SHALL validate the user session on every server action invocation
5. THE MFD Management System SHALL prevent unauthorized access to MFD management functionality

### Requirement 11

**User Story:** As a data administrator, I want to view MFD records grouped by province or district, so that I can better understand the geographic hierarchy

#### Acceptance Criteria

1. THE MFD Management System SHALL provide a toggle or tab to switch between flat list view and hierarchical grouped view
2. WHEN hierarchical view is selected, THE MFD Management System SHALL group records by province, then by district
3. THE MFD Management System SHALL display expandable/collapsible sections for each grouping level
4. THE MFD Management System SHALL show record counts for each group
5. THE MFD Management System SHALL maintain the current view preference during the session
