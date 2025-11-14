# Implementation Plan

- [x] 1. Install required Magic UI components




  - Add shimmer-button from Magic UI registry
  - Add animated-gradient-text from Magic UI registry
  - Verify components are properly installed and configured
  - Note: shadcn/ui components (sidebar, dialog, avatar, button, separator) are already installed
  - _Requirements: 1.1, 2.1, 6.1, 6.2_


- [x] 2. Create navigation configuration



  - [x] 2.1 Update nav-items.tsx with new navigation structure


    - Update navItems array with new menu items: Dashboard, Analytics, Users, Access Control, Profile, Settings
    - Add bottomNavItems array for secondary navigation (Help & Support)
    - Include badge support for menu items (e.g., Users badge showing "3")
    - Import additional icons: BarChart3, Shield, User, HelpCircle
    - _Requirements: 3.1, 3.2, 3.6, 8.1, 8.2, 8.3, 8.4, 8.6_


- [x] 3. Implement dashboard server actions

  - [x] 3.1 Create action.ts in app/(dashboard) directory


    - Implement logout() server action with session clearing

    - Implement getCurrentUser() to fetch user data from session
    - Add proper error handling and return types

    - _Requirements: 1.5, 7.4, 8.5_

- [x] 4. Build user profile dialog component

  - [x] 4.1 Create user-profile-dialog.tsx component


    - Implement Dialog component with user information display
    - Add Avatar component with fallback initials
    - Create logout button that calls server action
    - Add account settings link placeholder


    - Implement proper TypeScript props interface
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_







- [ ] 5. Update sidebar component with new navigation structure

  - [ ] 5.1 Update app-sidebar.tsx header
    - Update branding from "Dashboard" to "RBAC Dashboard"

    - Update subtitle to "Access Control System"
    - Change logo icon from "DS" to Shield icon
    - _Requirements: 1.2, 6.1, 6.2, 6.3, 7.1_
  
  - [ ] 5.2 Implement primary navigation rendering
    - Import and map through navItems configuration
    - Render SidebarMenuItem for each primary nav item

    - Add badge support for menu items (display Badge component when badge property exists)
    - Implement active route highlighting using usePathname
    - Remove sub-menu/collapsible logic for primary navigation
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  
  - [x] 5.3 Add bottom navigation section

    - Create separate SidebarGroup with mt-auto for bottom positioning
    - Import and map through bottomNavItems configuration
    - Render bottom navigation items (Help & Support)
    - Apply same styling as primary navigation
    - _Requirements: 8.6_
  
  - [ ] 5.4 Update user profile section in footer
    - Keep existing avatar and user info display
    - Update logout button to use useTransition for pending state
    - Change button styling to ghost variant with proper sizing
    - Add "Sign out" text with LogOut icon
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 6.2_

- [ ] 6. Create dashboard layout
  - [x] 6.1 Create layout.tsx in app/(dashboard)/dashboard


    - Implement authentication guard using getSession()
    - Redirect unauthenticated users to /sign-in
    - Fetch user data from database using session ID
    - Render SidebarProvider with AppSidebar
    - Create main content area with proper spacing
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  

  - [ ] 6.2 Add sidebar toggle functionality
    - Implement SidebarTrigger button in header
    - Ensure smooth collapse/expand transitions
    - Verify state persistence in localStorage
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 7. Implement responsive behavior

  - [x] 7.1 Configure mobile sidebar drawer

    - Set sidebar variant to "sidebar" for responsive behavior
    - Verify overlay drawer on mobile viewports
    - Add backdrop overlay for mobile
    - Implement auto-close on backdrop click
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [x] 7.2 Add mobile hamburger menu

    - Create SidebarTrigger button for mobile
    - Position button in header area
    - Ensure proper visibility on small screens
    - _Requirements: 5.4_
  

  - [ ] 7.3 Verify desktop fixed sidebar
    - Test fixed sidebar on desktop viewports (≥768px)
    - Ensure proper layout spacing
    - Verify collapse functionality on desktop
    - _Requirements: 5.5_


- [x] 8. Create dashboard home page

  - [x] 8.1 Create page.tsx in app/(dashboard)/dashboard

    - Implement basic dashboard overview content
    - Add welcome message with user name
    - Create placeholder cards for dashboard widgets
    - Use shadcn/ui Card components for layout
    - _Requirements: 1.1, 1.3_



- [ ] 9. Add styling and visual enhancements
  - [ ] 9.1 Apply theme colors and design tokens
    - Ensure sidebar uses CSS variables from globals.css
    - Apply proper color scheme for light/dark modes
    - Add hover effects with smooth transitions

    - _Requirements: 6.1, 6.3, 6.4, 6.5_
  
  - [ ] 9.2 Implement active state styling
    - Add accent color for active menu items


    - Include border indicator for current route


    - Ensure proper contrast for accessibility
    - _Requirements: 3.5, 6.4_

- [ ] 10. Refactor code to use centralized types and middleware

  - [x] 10.1 Create centralized type definitions



    - Create `lib/types/types.ts` file
    - Define User interface with JSDoc comments
    - Define ActionState interface with JSDoc comments
    - Define NavItem and NavSubItem interfaces
    - Export all types for use across the application
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 16.1, 16.2, 16.4, 16.5_

  - [ ] 10.2 Refactor dashboard server actions
    - Import types from `lib/types/types.ts`
    - Import middleware utilities from `lib/auth/middleware.ts`
    - Refactor `getCurrentUser` to use `withUser` middleware
    - Create zod schema for `updateProfile` validation
    - Refactor `updateProfile` to use `validatedActionWithUser`
    - Update `logout` to return ActionState type
    - Remove duplicate authentication and validation code
    - _Requirements: 9.5, 10.1, 10.2, 10.3, 10.4, 10.5, 11.1, 11.2, 11.3, 11.4, 12.1, 12.2, 12.3, 12.4, 12.5, 13.2, 13.3, 13.4_

  - [ ] 10.3 Update components to use centralized types
    - Update `app-sidebar.tsx` to import User type
    - Remove inline type definitions from `app-sidebar.tsx`
    - Update `user-profile-dialog.tsx` to import User type
    - Update `dashboard/layout.tsx` to use User type
    - Update `dashboard/page.tsx` to use User type
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

  - [ ] 10.4 Verify backward compatibility
    - Test all existing functionality
    - Verify no breaking changes to component APIs
    - Ensure no new runtime errors
    - Verify authentication flow still works
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [x] 11. Fix authentication redirect bug



  - [x] 11.1 Refactor signIn action in app/(auth)/action.ts

    - Move redirect() call outside of try/catch block
    - Keep all business logic and error handling inside try/catch
    - Return error messages early for validation failures
    - Call redirect('/dashboard') after try/catch completes successfully
    - _Requirements: 17.1, 17.2, 17.3, 17.4_


  - [ ] 11.2 Refactor signUp action in app/(auth)/action.ts
    - Move redirect() call outside of try/catch block
    - Keep all business logic and error handling inside try/catch
    - Return error messages early for validation failures
    - Call redirect('/dashboard') after try/catch completes successfully
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_


  - [ ] 11.3 Test authentication redirects
    - Test sign-in with valid credentials redirects to dashboard
    - Test sign-in with invalid credentials shows error
    - Test sign-up with valid data redirects to dashboard
    - Test sign-up with existing email shows error
    - Verify no NEXT_REDIRECT errors in console
    - _Requirements: 17.1, 17.5, 18.1, 18.5_

- [ ] 12. Testing and validation

  - [ ] 12.1 Test authentication flow
    - Verify redirect for unauthenticated users
    - Test session validation
    - Verify logout functionality
    - _Requirements: 1.5_

  - [ ] 12.2 Test navigation functionality
    - Click through all menu items
    - Verify route changes
    - Test sub-menu expand/collapse
    - Verify active state updates
    - _Requirements: 3.4, 4.1, 4.2_

  - [ ] 12.3 Test responsive behavior
    - Test on mobile viewport (< 768px)
    - Test on desktop viewport (≥ 768px)
    - Verify sidebar drawer on mobile
    - Test collapse functionality
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ] 12.4 Test user profile dialog
    - Verify dialog opens on profile click
    - Test logout action
    - Verify dialog closes properly
    - Test keyboard navigation (Escape key)
    - _Requirements: 7.4_

  - [ ] 12.5 Accessibility testing
    - Test keyboard navigation
    - Verify ARIA labels
    - Check color contrast ratios
    - Test with screen reader
    - _Requirements: 6.4_
