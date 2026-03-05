# Implementation Plan: Expense Tracker Refactor

## Overview

This plan transforms the Expense Tracker from a monolithic structure into a well-organized, component-based React application. The implementation follows a 10-phase migration strategy, building utilities first, then context providers, followed by components from the bottom up (layout → dashboard → transactions → modals → settings), and finally integration and optimization. Each task builds incrementally on previous work, ensuring the application remains functional throughout the refactoring process.

## Tasks

- [-] 1. Phase 1: Setup New Structure
  - [x] 1.1 Create folder structure and install dependencies
    - Create folders: `src/components/layout`, `src/components/dashboard`, `src/components/transactions`, `src/components/settings`, `src/components/modals`, `src/context`, `src/hooks`, `src/utils`, `src/constants`
    - Install dependencies: `npm install uuid recharts`
    - Install dev dependencies: `npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @fast-check/vitest`
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [x] 1.2 Configure Vitest for testing
    - Create `vitest.config.js` with React Testing Library setup
    - Update `package.json` with test scripts
    - Create test setup file with jsdom environment
    - _Requirements: 11.5_

- [ ] 2. Phase 2: Extract Utilities
  - [x] 2.1 Create constants/categories.js
    - Define `EXPENSE_CATEGORIES` array with 10 default categories
    - Define `INCOME_CATEGORIES` array with 6 default categories
    - Define `CATEGORY_COLORS` object mapping categories to hex colors
    - _Requirements: 10.1, 10.2_

  - [x] 2.2 Implement utils/financialCalculations.js
    - Implement `calculateTotalIncome(transactions)` - sum all income transactions
    - Implement `calculateTotalExpenses(transactions)` - sum all expense transactions
    - Implement `calculateBalance(transactions)` - return income minus expenses
    - Implement `groupByCategory(transactions)` - return array of {category, total, count} sorted by total descending
    - Implement `calculateCategoryPercentages(transactions)` - return array with percentages rounded to 2 decimals
    - _Requirements: 3.1, 3.2, 3.3, 19.1, 19.2, 19.3, 19.4, 19.5, 19.6_

  - [ ]* 2.3 Write unit tests for financialCalculations.js
    - Test calculateTotalIncome with empty array, income only, mixed transactions
    - Test calculateTotalExpenses with empty array, expenses only, mixed transactions
    - Test calculateBalance with various scenarios including negative balance
    - Test groupByCategory with multiple categories and empty array
    - Test calculateCategoryPercentages ensuring sum equals 100
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 2.4 Implement utils/dataProcessing.js
    - Implement `filterTransactions(transactions, filters)` - filter by type, date range, category, and searchTerm
    - Implement `sortTransactions(transactions, field, order)` - stable sort by date/amount/description/category
    - Implement `validateTransaction(transaction)` - return {isValid, errors} object with field-specific validation
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 13.1, 13.2, 13.3, 13.4, 13.5_

  - [ ]* 2.5 Write unit tests for dataProcessing.js
    - Test filterTransactions with all filter combinations
    - Test sortTransactions with all fields and both orders
    - Test validateTransaction with valid and invalid data for each field
    - Test edge cases: empty strings, null values, boundary conditions
    - _Requirements: 2.1-2.8, 5.1-5.7, 13.1-13.5_

  - [x] 2.6 Implement utils/exportUtils.js
    - Implement `formatCurrency(amount, currency)` - format with symbol, thousands separators, 2 decimals
    - Implement `exportToCSV(transactions, filename)` - generate CSV with headers, escape special chars, trigger download
    - Implement `prepareForPrint(transactions, includeChart)` - apply print styles and open print dialog
    - Helper: `escapeCSV(text)` - escape quotes and commas for CSV format
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 7.1, 7.2, 7.3, 7.4, 20.1, 20.2, 20.3, 20.5_

  - [ ]* 2.7 Write unit tests for exportUtils.js
    - Test formatCurrency with various amounts and currencies
    - Test exportToCSV data formatting (mock download)
    - Test escapeCSV with special characters
    - Test prepareForPrint (mock window.print)
    - _Requirements: 6.1-6.6, 7.1-7.4, 20.1-20.5_

- [ ] 3. Checkpoint - Verify utilities
  - Ensure all utility tests pass, ask the user if questions arise.

- [ ] 4. Phase 3: Create Context Providers
  - [x] 4.1 Implement hooks/useLocalStorage.js
    - Create generic hook that syncs state with localStorage
    - Handle JSON serialization/deserialization
    - Handle localStorage errors gracefully
    - Return [value, setValue] tuple like useState
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ]* 4.2 Write unit tests for useLocalStorage
    - Test initial value loading from localStorage
    - Test value persistence on change
    - Test with non-existent key (uses initialValue)
    - Test localStorage quota exceeded error handling
    - _Requirements: 9.1-9.5_

  - [x] 4.3 Implement hooks/useDarkMode.js
    - Use useLocalStorage for persistence
    - Apply/remove 'dark' class on document.documentElement
    - Return [darkMode, toggleDarkMode] tuple
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 4.4 Implement context/ThemeContext.jsx
    - Create ThemeContext with createContext
    - Implement ThemeProvider component using useDarkMode hook
    - Export useTheme custom hook that throws error if used outside provider
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 4.5 Implement context/TransactionContext.jsx
    - Create TransactionContext with createContext
    - Implement TransactionProvider with useLocalStorage for transactions and categories
    - Implement addTransaction - generate UUID, timestamps, validate, add to array
    - Implement updateTransaction - find by id, merge updates, update updatedAt timestamp
    - Implement deleteTransaction - filter out by id
    - Implement getTransactionById - find and return transaction or undefined
    - Implement filterTransactions - use dataProcessing utility
    - Implement updateCategories - persist to localStorage
    - Export useTransactionContext hook that throws error if used outside provider
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 9.1, 9.2, 9.3, 9.4, 9.5, 10.3, 10.4, 18.1, 18.2, 18.3, 18.4, 18.5, 18.6_

  - [ ]* 4.6 Write unit tests for TransactionContext
    - Test addTransaction creates valid transaction with id and timestamps
    - Test updateTransaction updates fields and updatedAt
    - Test deleteTransaction removes transaction
    - Test getTransactionById returns correct transaction
    - Test filterTransactions applies filters correctly
    - Test localStorage persistence
    - _Requirements: 1.1-1.5, 9.1-9.5_

  - [x] 4.7 Implement hooks/useTransactions.js
    - Create hook that uses useTransactionContext
    - Accept optional filters parameter
    - Return transactions, filteredTransactions, CRUD operations, isLoading
    - Apply filters to transactions if provided
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [ ] 5. Checkpoint - Verify contexts and hooks
  - Ensure all context and hook tests pass, ask the user if questions arise.

- [ ] 6. Phase 4: Build Layout Components
  - [x] 6.1 Implement components/layout/Sidebar.jsx
    - Accept props: currentView, onNavigate, darkMode, onToggleDarkMode
    - Render navigation menu with Dashboard, Transactions, Settings items
    - Highlight active view with conditional className
    - Render dark mode toggle button
    - Use icons/emojis for menu items
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 8.1_

  - [x] 6.2 Implement components/layout/MainContent.jsx
    - Accept children prop
    - Render main content area wrapper with appropriate styling
    - Apply responsive layout classes
    - _Requirements: 16.4_

  - [x] 6.3 Implement components/layout/Layout.jsx
    - Compose Sidebar and MainContent
    - Accept currentView, onNavigate, children props
    - Use useTheme hook for dark mode
    - Pass theme props to Sidebar
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

  - [x] 6.4 Extract and organize CSS for layout components
    - Move relevant styles from App.css to component-specific sections
    - Ensure sidebar, navigation, and layout styles are properly scoped
    - Add dark mode styles for layout components
    - _Requirements: 8.5, 16.5_

- [ ] 7. Phase 5: Build Dashboard Components
  - [x] 7.1 Implement components/dashboard/StatCard.jsx
    - Accept props: title, amount, icon, color, trend (optional)
    - Use formatCurrency from exportUtils for amount display
    - Apply color-based styling (green/red/blue)
    - Render trend indicator if provided
    - _Requirements: 4.1, 20.1, 20.2, 20.3, 20.5_

  - [x] 7.2 Implement components/dashboard/ExpenseChart.jsx
    - Accept props: transactions, chartType (default 'pie')
    - Filter expense transactions only
    - Use calculateCategoryPercentages from financialCalculations
    - Integrate recharts PieChart component
    - Map categories to colors from CATEGORY_COLORS
    - Render legend with category names and percentages
    - Show empty state when no expenses exist
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6, 19.1, 19.2, 19.3, 19.4, 19.5, 19.6_

  - [x] 7.3 Implement components/dashboard/Dashboard.jsx
    - Use useTransactionContext to get transactions
    - Calculate totalIncome, totalExpenses, balance using financialCalculations
    - Render three StatCard components for income (green), expenses (red), balance (blue)
    - Render ExpenseChart component
    - Update when transactions change
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [ ]* 7.4 Write integration tests for Dashboard
    - Test dashboard displays correct statistics
    - Test chart renders with expense data
    - Test empty state when no transactions
    - Test updates when transactions change
    - _Requirements: 3.1-3.5, 4.1-4.6_

- [ ] 8. Phase 6: Build Transaction Components
  - [x] 8.1 Implement components/transactions/TransactionItem.jsx
    - Accept props: transaction, onEdit, onDelete
    - Display date, description, category, amount
    - Apply income/expense styling (green/red)
    - Use formatCurrency for amount display
    - Render edit and delete buttons
    - _Requirements: 1.2, 20.1, 20.2, 20.3, 20.5_

  - [x] 8.2 Implement components/transactions/TransactionList.jsx
    - Accept props: transactions, onEdit, onDelete
    - Map transactions to TransactionItem components
    - Show empty state message when no transactions
    - Apply list styling
    - _Requirements: 1.2_

  - [x] 8.3 Implement components/transactions/TransactionFilters.jsx
    - Accept props: filters, onFilterChange, categories
    - Render filter controls: type dropdown, date range inputs, category dropdown, search input
    - Call onFilterChange when any filter changes
    - Render "Reset Filters" button
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [x] 8.4 Implement components/transactions/Transactions.jsx
    - Use useTransactionContext for transactions and CRUD operations
    - Manage local state: filters, showAddModal, editingTransaction, deletingTransactionId
    - Implement handleFilterChange to update filters state
    - Use filterTransactions utility to get filtered transactions
    - Render TransactionFilters component
    - Render "Add Transaction", "Export CSV", "Print" buttons
    - Render TransactionList with filtered transactions
    - Handle exportToCSV and prepareForPrint button clicks
    - Manage modal open/close state
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 7.1, 7.2, 7.3, 7.4_

  - [ ]* 8.5 Write integration tests for Transactions
    - Test transaction list displays all transactions
    - Test filters work correctly
    - Test export CSV button triggers download
    - Test print button opens print dialog
    - _Requirements: 1.2, 5.1-5.7, 6.1-6.6, 7.1-7.4_

- [ ] 9. Checkpoint - Verify transaction components
  - Ensure transaction list displays and filters work, ask the user if questions arise.

- [ ] 10. Phase 7: Build Modal Components
  - [x] 10.1 Implement components/modals/AddTransactionModal.jsx
    - Accept props: isOpen, onClose, onSubmit, categories
    - Manage form state: date, description, category, amount, type
    - Manage errors state for validation messages
    - Use validateTransaction from dataProcessing on submit
    - Display field-specific error messages
    - Call onSubmit with form data if valid
    - Reset form on close
    - Render modal overlay and form with all fields
    - _Requirements: 1.1, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 12.1, 12.4, 12.5, 12.6, 14.1_

  - [x] 10.2 Implement components/modals/EditTransactionModal.jsx
    - Accept props: isOpen, transaction, onClose, onSubmit, categories
    - Pre-populate form with transaction data when transaction prop changes
    - Manage form state and errors like AddTransactionModal
    - Use validateTransaction on submit
    - Call onSubmit with transaction id and updated data
    - Reset form on close
    - _Requirements: 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 12.2, 12.4, 12.5, 12.6, 14.1_

  - [x] 10.3 Implement components/modals/DeleteConfirmModal.jsx
    - Accept props: isOpen, transactionDescription, onClose, onConfirm
    - Render confirmation message with transaction description
    - Render "Cancel" and "Delete" buttons
    - Call onConfirm when delete clicked
    - Call onClose when cancel clicked or overlay clicked
    - _Requirements: 1.4, 12.3, 12.4_

  - [x] 10.4 Create shared modal styles
    - Add CSS for modal overlay, modal container, form inputs, buttons
    - Ensure modals are centered and responsive
    - Add dark mode styles for modals
    - _Requirements: 8.5, 12.1, 12.2, 12.3_

  - [ ]* 10.5 Write integration tests for modals
    - Test AddTransactionModal form submission and validation
    - Test EditTransactionModal pre-population and submission
    - Test DeleteConfirmModal confirmation flow
    - Test modal open/close behavior
    - Test form reset on close
    - _Requirements: 1.1, 1.3, 1.4, 12.1-12.6_

- [ ] 11. Phase 8: Build Settings Component
  - [x] 11.1 Implement components/settings/Settings.jsx
    - Use useTheme for dark mode state and toggle
    - Use useTransactionContext for categories and updateCategories
    - Render theme settings section with dark mode toggle
    - Render category management section (display list, add/remove categories)
    - Render data management section with "Clear All Data" button
    - Implement handleClearData with confirmation
    - Persist category changes to localStorage via context
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 10.3, 10.4, 17.1, 17.2, 17.3, 17.5_

  - [ ]* 11.2 Write integration tests for Settings
    - Test dark mode toggle updates theme
    - Test category management (add/remove)
    - Test clear all data functionality
    - Test settings persist to localStorage
    - _Requirements: 8.1-8.5, 10.3, 10.4, 17.1-17.5_

- [ ] 12. Phase 9: Integration and Wiring
  - [x] 12.1 Update App.jsx to use new component structure
    - Wrap app with ThemeProvider and TransactionProvider
    - Manage currentView state ('dashboard' | 'transactions' | 'settings')
    - Implement handleNavigate to change currentView
    - Render Layout component with Sidebar and MainContent
    - Conditionally render Dashboard, Transactions, or Settings based on currentView
    - Remove old Vite template code
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 16.1, 16.2, 16.3, 16.4, 16.5_

  - [x] 12.2 Update App.css with complete application styles
    - Organize styles by component section
    - Ensure all components have proper styling
    - Add responsive breakpoints for mobile/tablet
    - Add dark mode color variables and styles
    - Ensure print styles are included
    - _Requirements: 8.5, 7.2, 7.3, 7.4_

  - [ ] 12.3 Verify all features work end-to-end
    - Test navigation between all views
    - Test adding, editing, deleting transactions
    - Test filtering and sorting transactions
    - Test CSV export and print functionality
    - Test dark mode toggle
    - Test localStorage persistence (refresh page)
    - Test all modals open/close correctly
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 5.1-5.7, 6.1-6.6, 7.1-7.4, 8.1-8.5, 9.1-9.5, 12.1-12.6, 16.1-16.5_

  - [ ]* 12.4 Write end-to-end integration tests
    - Test complete user flow: add transaction → view in list → edit → delete
    - Test filter and export flow
    - Test theme persistence across page reload
    - Test error handling scenarios
    - _Requirements: 1.1-1.5, 14.1-14.6_

- [ ] 13. Checkpoint - Full application verification
  - Ensure all features work correctly, all tests pass, ask the user if questions arise.

- [ ] 14. Phase 10: Polish and Optimization
  - [ ] 14.1 Add React.memo to pure components
    - Wrap StatCard, TransactionItem, TransactionFilters with React.memo
    - Prevent unnecessary re-renders
    - _Requirements: 15.1, 15.2_

  - [ ] 14.2 Add useMemo and useCallback optimizations
    - Memoize expensive calculations in Dashboard (totalIncome, totalExpenses, balance)
    - Memoize filtered transactions in Transactions component
    - Memoize chart data processing in ExpenseChart
    - Use useCallback for event handlers passed as props
    - _Requirements: 15.1, 15.2, 15.4_

  - [ ] 14.3 Add error boundaries
    - Create ErrorBoundary component to catch rendering errors
    - Wrap main sections (Dashboard, Transactions, Settings) with ErrorBoundary
    - Display user-friendly error messages
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

  - [ ] 14.4 Implement error notifications
    - Create notification system for user feedback
    - Show success messages for CRUD operations
    - Show error messages for validation failures and localStorage errors
    - Auto-dismiss notifications after timeout
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

  - [ ] 14.5 Add loading states
    - Show loading indicator when initializing from localStorage
    - Show loading state during expensive operations
    - Disable buttons during processing
    - _Requirements: 15.1_

  - [ ]* 14.6 Performance testing and optimization
    - Test with 1000+ transactions
    - Measure render times for key components
    - Optimize if performance issues found
    - Consider virtual scrolling if needed
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ] 15. Final checkpoint and documentation
  - [ ] 15.1 Final testing checklist
    - Verify all 20 requirements are met
    - Test dark mode in all views
    - Test CSV export with various data sets
    - Test print functionality
    - Test localStorage persistence and quota handling
    - Test all modals and forms
    - Test filters with edge cases
    - Test chart with various data
    - Verify no console errors or warnings
    - _Requirements: All (1.1-20.5)_

  - [ ] 15.2 Code cleanup and documentation
    - Remove any commented-out code
    - Add JSDoc comments to utility functions
    - Ensure consistent code formatting
    - Update README with project structure and setup instructions
    - _Requirements: 11.5_

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- Each task references specific requirements from the requirements document for traceability
- The implementation follows a bottom-up approach: utilities → contexts → components → integration
- Checkpoints ensure incremental validation and provide opportunities for user feedback
- The refactoring maintains all existing functionality while improving code organization
- All components use functional React with hooks (no class components)
- localStorage is used for all data persistence (no backend required)
- The application is fully client-side and works offline after initial load
