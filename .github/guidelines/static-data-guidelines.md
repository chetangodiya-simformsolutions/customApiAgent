# Static Data Guidelines - test React Native Project

## 📊 **MANDATORY STATIC DATA MANAGEMENT**

**⚠️ CRITICAL RULE**: ALL static data MUST be centrally managed through the StaticData system. No inline static arrays, objects, or hardcoded data structures are allowed in components.

## Static Data Architecture

### Static Data Organization Rules

#### 1. **MANDATORY Data Categories**

```typescript
// REQUIRED: Import necessary types and constants
import { JobTypes, NotificationSettings, ValidationError } from '../types';
import { Strings } from '../constants';
import { ROUTES } from '../navigation';
import { SVGs } from '../assets';

// REQUIRED: Organize static data by functional categories

// ✅ Form Options Data
export const jobTypes: JobTypes = [
  { id: 1, title: 'Full-time', isSelected: false },
  { id: 2, title: 'Part-time', isSelected: false },
  { id: 3, title: 'Contract', isSelected: false }
];

// ✅ Navigation Configuration Data
export const tabConfig = [
  { id: 1, title: Strings.Workplaces.myWorkplaces, isSelected: true },
  { id: 2, title: Strings.Workplaces.jobs, isSelected: false },
  { id: 3, title: Strings.Workplaces.myApplications, isSelected: false }
];

// ✅ Geographic Data
export const provincesList = [
  { id: 'AB', name: 'Alberta', country: 1 },
  { id: 'BC', name: 'British Columbia', country: 1 }
  // ... more provinces/states
];

// ✅ Mock/Development Data (clearly marked)
export const dummyJobList = [
  {
    id: 1,
    title: 'Radiology Specialist',
    address: '456 Pine Street, Vancouver, BC, V6B 1A1',
    datePosted: '2025-01-28T15:30:00.906Z',
    designation: 'PSW',
    jobType: 'Full-time'
  }
  // ... more dummy data
];
```

## Data Structure Rules

### MANDATORY Immutability Patterns

```typescript
// REQUIRED: Import necessary constants
import { Strings } from '../constants';

// REQUIRED: Use 'as const' for immutable arrays and objects
export const weekDays = [
  Strings.WeekDays.sunday,
  Strings.WeekDays.monday,
  Strings.WeekDays.tuesday,
  Strings.WeekDays.wednesday,
  Strings.WeekDays.thursday,
  Strings.WeekDays.friday,
  Strings.WeekDays.saturday
];
```

## Static Data Categories

### 1. **Form Configuration Data**

```typescript
// REQUIRED: Centralize all form-related static data
export const formConfigs = {
  // Dropdown options
  jobClassifications: [
    { id: 1, name: 'Personal Support Worker', isSelected: false },
    { id: 2, name: 'Registered Practical Nurse', isSelected: false },
    { id: 3, name: 'Janitor', isSelected: false }
  ],

  // Validation rules
  passwordRules: {
    minLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  },

  // File upload constraints
  fileUploadLimits: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxFiles: 5
  }
};
```

### 2. **Navigation & Menu Data**

```typescript
// REQUIRED: Import necessary components and constants
import React from 'react';
import { Strings } from '../constants';
import { SVGs } from '../assets';
import { ROUTES } from '../navigation';

// REQUIRED: Centralize navigation-related data
export const navigationData = {
  // Account menu items
  accountMenuItems: [
    {
      id: 1,
      title: Strings.Account.profile,
      route: ROUTES.ProfileDetails,
      icon: <SVGs.Account />
    },
    {
      id: 2,
      title: Strings.Account.payment,
      route: ROUTES.Payment,
      icon: <SVGs.BankNote />
    }
    // ... more menu items
  ],

  // Tab navigation
  bottomTabs: [
    {
      name: 'Dashboard',
      component: 'DashboardScreen',
      icon: 'dashboard',
      label: Strings.Navigation.dashboard
    }
    // ... more tabs
  ]
};
```

### 3. **Configuration & Settings Data**

```typescript
// REQUIRED: Centralize app configuration
export const appSettings = {
  // Feature flags
  features: {
    darkModeEnabled: true,
    biometricLoginEnabled: true,
    pushNotificationsEnabled: true,
    offlineModeEnabled: false
  },

  // Timing configurations
  timeouts: {
    apiRequest: 30000,
    authentication: 900000, // 15 minutes
    sessionRefresh: 3600000 // 1 hour
  },

  // UI configurations
  ui: {
    animationDuration: 300,
    maxRetryAttempts: 3,
    defaultPageSize: 20,
    maxImageSize: 2 * 1024 * 1024 // 2MB
  }
};
```

### 4. **Business Logic Configuration**

```typescript
// REQUIRED: Centralize business rules and constants
export const businessRules = {
  // Shift management rules
  shifts: {
    maxAdvanceBooking: 30, // days
    minCancellationNotice: 24, // hours
    maxDailyHours: 12,
    overtimeThreshold: 8
  },

  // Payment rules
  payments: {
    biweeklyPayoutDay: 'Friday',
    minimumPayout: 50, // CAD
    processingDays: 3,
    currency: 'CAD'
  },

  // File management rules
  documents: {
    expiryWarningDays: 30,
    maxRetentionDays: 2555, // 7 years
    requiredDocuments: ['backgroundCheck', 'sinNumber', 'healthCard']
  }
};
```

## Validation & Quality Assurance

### MANDATORY Data Validation

```typescript
// REQUIRED: Validate static data structure on app start
export const validateStaticData = () => {
  const validationResults: ValidationError[] = [];

  // Validate required fields
  if (!Array.isArray(provincesList) || provincesList.length === 0) {
    validationResults.push({
      type: 'MISSING_DATA',
      field: 'provincesList',
      message: 'Provinces list is empty or invalid'
    });
  }

  // Validate data consistency
  const duplicateIds = findDuplicateIds(jobTypes);
  if (duplicateIds.length > 0) {
    validationResults.push({
      type: 'DUPLICATE_DATA',
      field: 'jobTypes',
      message: `Duplicate IDs found: ${duplicateIds.join(', ')}`
    });
  }

  return validationResults;
};

// REQUIRED: Runtime type checking for critical data
export const ensureDataIntegrity = <T>(
  data: T,
  validator: (item: T) => boolean,
  errorMessage: string
): T => {
  if (!validator(data)) {
    throw new Error(`Data integrity check failed: ${errorMessage}`);
  }
  return data;
};
```

### MANDATORY Sensitive Data Handling

```typescript
// REQUIRED: Separate sensitive configuration
const sensitiveConfig = {
  // Never include actual secrets in static data
  apiKeysPlaceholder: 'USE_ENVIRONMENT_VARIABLES',
  encryptionKeysPlaceholder: 'USE_SECURE_STORAGE'
};

// REQUIRED: Data classification
export const dataClassification = {
  public: {
    weekDays,
    jobTypes,
    provincesList
  },
  internal: {
    businessRules,
    uiConfig
  },
  confidential: {
    // Never store actual confidential data in static files
    placeholders: sensitiveConfig
  }
};
```

## Enforcement Rules

1. **⚠️ MANDATORY**: All static data MUST be centralized in StaticData.tsx
2. **REQUIRED**: Use proper TypeScript interfaces for all data structures
3. **FORBIDDEN**: No inline arrays, objects, or hardcoded data in components
4. **MANDATORY**: Use 'as const' assertions for immutability
5. **REQUIRED**: Organize data by functional categories
6. **MANDATORY**: Include proper JSDoc documentation
7. **REQUIRED**: Validate data structure and integrity
8. **FORBIDDEN**: Never include sensitive data in static files
9. **MANDATORY**: Use environment-specific data loading
10. **REQUIRED**: Support data versioning and migration

## File Organization Structure

```typescript
// StaticData.tsx - Main static data file
constants/
├── StaticData.tsx           # Main static data exports
```

## Examples

### ✅ CORRECT Static Data Implementation

```typescript
// In StaticData.tsx
export const accountSetupSteps: CheckListItem[] = [
  {
    id: 1,
    title: Strings.AccountSetup.createAccount,
    isChecked: true
  },
  {
    id: 2,
    title: Strings.AccountSetup.backgroundCheck,
    isChecked: false,
    route: ROUTES.BackgroundCheck
  }
];

// In component
import { accountSetupSteps } from '../../constants/StaticData';

const SetupChecklist = () => {
  return (
    <FlatList
      data={accountSetupSteps}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ChecklistItem title={item.title} isChecked={item.isChecked} />
      )}
    />
  );
};
```

### ❌ INCORRECT Implementation (FORBIDDEN)

```typescript
// ❌ This violates static data guidelines
const BadSetupChecklist = () => {
  // ❌ NEVER define static data inline
  const steps = [
    { id: 1, title: 'Create Account', isChecked: true },
    { id: 2, title: 'Background Check', isChecked: false }
  ];

  return (
    <FlatList
      data={steps}
      renderItem={({ item }) => <ChecklistItem {...item} />}
    />
  );
};
```

**🚨 CRITICAL**: Static data compliance is mandatory for maintainability, performance, and consistency. Any inline static data will create maintenance nightmares and performance issues.
