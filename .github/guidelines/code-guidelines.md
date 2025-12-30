# Code Guidelines - test React Native Project

## 💻 **MANDATORY CODE ARCHITECTURE**

**⚠️ CRITICAL RULE**: ALL code MUST follow the established architectural patterns, file organization, and coding standards. No deviations from the defined structure are allowed.

## Project Architecture Patterns

### MANDATORY Directory Structure

```
app/
├── modules/          # Feature-based modules (auth, home, details)
│   └── feature-name/
│       ├── FeatureScreen.tsx         # Main screen component
│       ├── FeatureStyles.ts          # Screen-level styles
│       ├── FeatureTypes.ts           # Screen-level types
│       ├── useFeature.ts             # Screen-level custom hook
│       ├── index.ts                  # Barrel export
│       └── sub-components/           # Feature-specific components
│           ├── SubComponent.tsx
│           ├── SubComponentStyles.ts
│           ├── SubComponentTypes.ts
│           ├── SubComponentUtils.ts
│           └── index.ts
├── components/       # Reusable UI components
│   └── component-name/
│       ├── ComponentName.tsx
│       ├── ComponentNameStyles.ts
│       ├── ComponentNameTypes.ts
│       └── index.ts
├── navigation/       # Navigation configuration
├── redux/           # Store, reducers, actions
├── hooks/           # Custom hooks (useTheme, usePermission, etc.)
├── services/        # Storage, API configurations
├── utils/           # Common utilities and helpers
├── constants/       # App constants, routes, strings
├── theme/           # Colors, metrics, styles
├── types/           # TypeScript type definitions
├── translations/    # i18n translation files
└── assets/          # Images, icons, fonts
```

## File Naming Conventions

### MANDATORY Naming Patterns

```typescript
// Components & Screens (PascalCase)
HomeScreen.tsx;
CustomButton.tsx;
UserProfile.tsx;

// Styles (PascalCase + "Styles")
HomeScreenStyles.ts;
CustomButtonStyles.ts;
UserProfileStyles.ts;

// Types (PascalCase + "Types")
HomeScreenTypes.ts;
CustomButtonTypes.ts;
UserProfileTypes.ts;

// Hooks (camelCase with "use" prefix)
useAuth.ts;
useTheme.ts;
usePermission.ts;

// Utils (PascalCase + "Utils")
NavigatorUtils.ts;
ValidationUtils.ts;
CommonUtils.ts;

// Constants (PascalCase)
NavigationRoutes.ts;
AppConst.ts;
MMKVKeys.ts;

// Barrel exports (lowercase)
index.ts;
```

### File Organization Rules

1. **One component per file**: Each component gets its own file
2. **Four-file pattern**: Component, Styles, Types, Index for reusable components
3. **Barrel exports**: Every directory must have index.ts
4. **Consistent naming**: Follow PascalCase for components, camelCase for utilities

## Component Architecture

- See [Component Guidelines](component-guidelines.md) for detailed component architecture patterns, including screen structure, and custom hooks.

## Module Architecture

### MANDATORY Screen Structure

```typescript
// FeatureScreen.tsx - REQUIRED structure
import React, { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../hooks';
import { CustomHeader } from '../../components';
import { Strings } from '../../constants';
import { ROUTES } from '../../constants';
import { useAppDispatch, useAppSelector, FeatureSelectors } from '../../redux';
import styleSheet from './FeatureStyles';
import useFeature from './useFeature';
import type { FeatureScreenProps, FeatureRouteParams } from './FeatureTypes';

/**
 * FeatureScreen Component
 *
 * Main screen component for the Feature module.
 * Handles [brief description of screen purpose].
 *
 * Features:
 * - Feature-specific functionality
 * - Navigation integration
 * - Redux state management
 * - Custom hook integration
 *
 * @returns JSX.Element
 */
const FeatureScreen: React.FC = () => {
  // REQUIRED: Navigation and routing
  const navigation = useNavigation();
  const route = useRoute<FeatureRouteParams>();

  // REQUIRED: Theme integration
  const { styles, theme } = useTheme(styleSheet);

  // REQUIRED: Redux integration
  const dispatch = useAppDispatch();
  const loading = useAppSelector(FeatureSelectors.getLoading);

  // REQUIRED: Feature-specific logic via custom hook
  const {
    data,
    error,
    handleAction,
    isFormValid
  } = useFeature();

  // REQUIRED: Screen initialization
  useEffect(() => {
    // Screen setup logic
    const initializeScreen = async () => {
      try {
        // Initialization logic
      } catch (error) {
        // Error handling
      }
    };

    initializeScreen();
  }, []);

  return (
    <View style={styles.screen}>
      <CustomHeader
        title={Strings.Feature.screenTitle}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen content */}
      </ScrollView>
    </View>
  );
};

export default FeatureScreen;
```

### MANDATORY Custom Hook Structure

```typescript
// useFeature.ts - REQUIRED structure
import { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useAppDispatch, useAppSelector, AuthActions, AuthSelectors } from '../../redux';
import { ValidationSchema } from '../../utils';
import type { FeatureFormValues, UseFeatureReturn } from './FeatureTypes';

/**
 * Custom hook for Feature screen logic
 *
 * Manages feature-specific state, form handling, and business logic.
 *
 * @returns UseFeatureReturn object with state and handlers
 */
const useFeature = (): UseFeatureReturn => {
  // REQUIRED: Local state management
  const [localState, setLocalState] = useState<string>('');

  // REQUIRED: Redux integration
  const dispatch = useAppDispatch();
  // REQUIRED: Fetch data from Redux store
  const { data, loading, error } = useAppSelector(AuthSelectors.getFeatures);

  // REQUIRED: Form management with Formik
  const formik = useFormik<FeatureFormValues>({
    initialValues: {
      field1: '',
      field2: ''
    },
    validationSchema: ValidationSchema.featureSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(AuthActions.submitData(values));
      } catch (error) {
        // Handle submission error
      }
    }
  });

  // REQUIRED: Action handlers with useCallback
  const handleSpecificAction = useCallback(async () => {
    try {
      // Action logic
    } catch (error) {
      // Error handling
    }
  }, []);

  // REQUIRED: Effect for initialization
  useEffect(() => {
    // Hook initialization logic
  }, []);

  // REQUIRED: Return object with consistent interface
  return {
    // State
    data,
    loading,
    error,
    localState,

    // Form
    formik,
    isFormValid: formik.isValid && formik.dirty,

    // Actions
    handleSpecificAction,
    setLocalState
  };
};

export default useFeature;
```

## Redux Architecture

- See [Redux Code Guidelines](redux-guidelines.md) for comprehensive Redux architecture patterns, including actions, reducers, selectors, and async thunk.

## Utility Functions

### MANDATORY Utility Structure

```typescript
// utils/FeatureUtils.ts - REQUIRED structure
import { isEmpty, isEqual } from 'lodash';
import type { FeatureData, ValidationResult } from '../types';

// REQUIRED: Standalone utility functions with JSDoc
export const validateData = (data: FeatureData): ValidationResult => {
  const errors: string[] = [];

  if (isEmpty(data.requiredField)) {
    errors.push('Required field is missing');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// REQUIRED: Standalone utility functions with JSDoc
export const formatForDisplay = (data: FeatureData): FormattedData => {
  return {
    ...data,
    formattedDate: new Date(data.timestamp).toLocaleDateString(),
    formattedValue: data.value.toFixed(2)
  };
};

// REQUIRED: Standalone utility functions with JSDoc
export const isDataEqual = (obj1: FeatureData, obj2: FeatureData): boolean => {
  return isEqual(obj1, obj2);
};

/**
 * Standalone utility functions
 */

/**
 * Checks if form is complete and valid
 * @param values - Form values object
 * @param errors - Form errors object
 * @returns boolean indicating if form is ready for submission
 */
export const isFormComplete = (
  values: Record<string, any>,
  errors: Record<string, any>
): boolean => {
  const hasValues = Object.values(values).every((value) => !isEmpty(value));
  const hasNoErrors = isEmpty(errors);

  return hasValues && hasNoErrors;
};

/**
 * Debounce function for input handling
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
```

## Code Quality Standards

### MANDATORY Documentation

````typescript
/**
 * Component/Function documentation template
 *
 * Brief description of what this component/function does.
 * Include any important behavior or side effects.
 *
 * Features:
 * - List key features
 * - Include important details
 * - Mention any dependencies
 *
 * @param param1 - Description of parameter
 * @param param2 - Description of parameter
 * @returns Description of return value
 *
 * @example
 * ```typescript
 * const result = myFunction('value1', 'value2');
 * ```
 */
````

### MANDATORY Error Handling

```typescript
// REQUIRED: Comprehensive error handling
const handleAsyncOperation = async () => {
  try {
    const result = await someAsyncOperation();
    return result;
  } catch (error) {
    console.error('Operation failed:', error);

    // Handle specific error types
    if (error instanceof NetworkError) {
      // Handle network errors
    } else if (error instanceof ValidationError) {
      // Handle validation errors
    } else {
      // Handle unknown errors
    }

    throw error; // Re-throw if needed
  }
};

// REQUIRED: Defensive programming
const safeAccess = (obj: any, path: string, defaultValue: any = null) => {
  try {
    return path.split('.').reduce((current, key) => current?.[key], obj) ?? defaultValue;
  } catch {
    return defaultValue;
  }
};
```

### MANDATORY Performance Optimization

```typescript
// REQUIRED: Use React performance hooks
const MemoizedComponent = React.memo<ComponentProps>((props) => {
  const { expensiveProp, simpleProp } = props;

  // REQUIRED: Memoize expensive calculations
  const expensiveValue = useMemo(() => {
    return calculateExpensiveValue(expensiveProp);
  }, [expensiveProp]);

  // REQUIRED: Optimize callbacks
  const handleCallback = useCallback(() => {
    // Callback logic
  }, [/* dependencies */]);

  return <View />;
});
```

## Import/Export Organization

### MANDATORY Import Order

```typescript
// 1. React and React Native imports
import React, { useCallback, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';

// 2. Third-party library imports
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';

// 3. Project hooks (closest to React imports)
import { useTheme, usePermission } from '../../hooks';

// 4. Project constants and utilities
import { Strings, ROUTES } from '../../constants';
import { NavigatorUtils, ValidationUtils } from '../../utils';

// 5. Project services and API
import { APIService, Storage } from '../../services';

// 6. Redux imports
import { useAppSelector, useAppDispatch, FeatureActions, FeatureSelectors } from '../../redux';

// 7. Component imports (local first, then global)
import SubComponent from './sub-components/SubComponent';
import { CustomButton, CustomHeader } from '../../components';

// 8. Type imports (grouped at end)
import type { ComponentProps, RouteParams } from './ComponentTypes';
import type { RootState } from '../../redux/types';
```

### MANDATORY Export Patterns

```typescript
// Default export for main component
export default ComponentName;

// Named exports for additional items
export { ComponentUtils } from './ComponentUtils';
export type { ComponentProps, ComponentVariant, ComponentConfig } from './ComponentTypes';

// Barrel exports in index.ts
export { default } from './ComponentName';
export { ComponentUtils } from './ComponentUtils';
export type * from './ComponentTypes';
```

## Enforcement Rules

1. **⚠️ MANDATORY**: Follow 4-file architecture for all components
2. **REQUIRED**: Use PascalCase for components, camelCase for utilities
3. **MANDATORY**: Include comprehensive TypeScript interfaces
4. **REQUIRED**: Document all public functions with JSDoc
5. **MANDATORY**: Use theme system for all styling
6. **REQUIRED**: Implement proper error handling
7. **MANDATORY**: Follow import/export organization
8. **REQUIRED**: Optimize performance with React hooks
9. **MANDATORY**: Use centralized strings and constants
10. **REQUIRED**: Include accessibility and testing support

**🚨 CRITICAL**: Code architecture compliance is non-negotiable. Any deviation will result in maintenance issues and architectural inconsistencies.
