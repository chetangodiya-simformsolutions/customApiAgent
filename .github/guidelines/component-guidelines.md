# Component Guidelines - test React Native Project

## 🧩 **MANDATORY COMPONENT ARCHITECTURE**

**⚠️ CRITICAL RULE**: ALL components MUST follow the established 4-file architecture pattern and strict implementation guidelines.

## Component Architecture Pattern

### MANDATORY File Structure

```
component-name/
├── ComponentName.tsx        # Main component implementation
├── ComponentNameStyles.ts   # Themed style functions
├── ComponentNameTypes.ts    # TypeScript interfaces and types
└── index.ts                # Barrel export
```

For Example

```
button/
├── Button.tsx        # Main component implementation
├── ButtonStyles.ts   # Themed style functions
├── ButtonTypes.ts    # TypeScript interfaces and types
└── index.ts                # Barrel export
```

### File Naming Conventions

- **PascalCase**: Component files (`MyComponent.tsx`, `MyComponentStyles.ts`) e.g Avatar.tsx, Button.tsx, Same name for respective component in files as well which means file and component name should be same.
- **Interfaces**: Match component name (`MyComponentProps`, `MyComponentDefaultProps`)
- **Style Functions**: `styleSheet` function name consistently used
- **Barrel Export**: Always named `index.ts`

## Component Implementation Rules

### 1. MANDATORY Component Structure

```typescript
// ComponentName.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../hooks';
import { Strings } from '../../constants';
import styleSheet from './ComponentNameStyles';
import { ComponentNameDefaultProps } from './ComponentNameTypes';
import type { ComponentNameProps } from './ComponentNameTypes';

/**
 * ComponentName Component
 *
 * Brief description of component purpose and features.
 *
 * Features:
 * - Feature 1
 * - Feature 2
 * - Theme-aware styling
 * - Accessibility support
 *
 * @param props Component props
 * @returns JSX.Element
 */
const ComponentName: React.FC<ComponentNameProps> = (props) => {
  const {
    prop1 = ComponentNameDefaultProps.prop1!,
    prop2 = ComponentNameDefaultProps.prop2!,
    onPress,
    customStyle,
    testID
  } = props;

  const { styles, theme } = useTheme(styleSheet);

  return (
    <View
      style={[styles.container, customStyle]}
      testID={testID}
      accessibilityRole="button"
    >
      <Text style={styles.text}>{Strings.SomeModule.someText}</Text>
    </View>
  );
};

export default ComponentName;
ComponentName.displayName = 'ComponentName';
```

### 2. MANDATORY Types File Structure

```typescript
// ComponentNameTypes.ts
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';

/**
 * Props interface for ComponentName component
 */
export interface ComponentNameProps {
  /** Required prop description */
  prop1: string;

  /** Optional prop description */
  prop2?: boolean;

  /** Callback function description */
  onPress?: () => void;

  /** Custom style override */
  customStyle?: StyleProp<ViewStyle>;

  /** Custom text style override */
  customTextStyle?: StyleProp<TextStyle>;

  /** Test identifier for testing */
  testID?: string;

  /** Accessibility label */
  accessibilityLabel?: string;
}

/**
 * Default props for ComponentName component
 */
export const ComponentNameDefaultProps: Partial<ComponentNameProps> = {
  prop2: false,
  testID: 'component-name'
} as const;

/**
 * Additional types specific to this component
 */
export type ComponentVariant = 'primary' | 'secondary' | 'tertiary';
export type ComponentSize = 'small' | 'medium' | 'large';

/**
 * Configuration interfaces
 */
export interface ComponentConfig {
  variant: ComponentVariant;
  size: ComponentSize;
  disabled?: boolean;
}
```

### 3. MANDATORY Styles File Structure

```typescript
// ComponentNameStyles.ts
import { StyleSheet } from 'react-native';
import { ApplicationStyles, Colors, scale, globalMetrics, type ThemeMode } from '../../theme';

/**
 * Style function for ComponentName component
 *
 * @param theme Current theme mode
 * @param isDark Optional dark mode boolean
 * @returns StyleSheet object
 */
const styleSheet = (theme: ThemeMode, isDark?: boolean) =>
  StyleSheet.create({
    ...ApplicationStyles(theme), // MANDATORY: Inherit common styles

    container: {
      backgroundColor: Colors[theme]?.white,
      borderRadius: scale(12),
      padding: scale(16),
      alignItems: 'center',
      justifyContent: 'center',

      // Platform-specific adjustments
      marginTop: globalMetrics.isAndroid ? scale(8) : scale(10),
      shadowOpacity: globalMetrics.isIos ? 0.1 : 0,
      elevation: globalMetrics.isAndroid ? scale(2) : 0
    },

    text: {
      color: Colors[theme]?.black,
      fontSize: scale(14),
      fontWeight: '600',
      textAlign: 'center'
    },

    // State-based styles
    disabled: {
      opacity: 0.5
    },

    // Size variants
    small: {
      padding: scale(8),
      minHeight: scale(32)
    },

    large: {
      padding: scale(20),
      minHeight: scale(56)
    }
  });

export default styleSheet;
```

### 4. MANDATORY Barrel Export

```typescript
// index.ts
export { default } from './ComponentName';
export type { ComponentNameProps } from './ComponentNameTypes';
```

## Theme Integration Requirements

### MANDATORY useTheme Pattern

```typescript
// REQUIRED in every component
const { styles, theme, isDark, changeTheme } = useTheme(styleSheet);

// Access themed styles
<View style={styles.container} />

// Conditional theming
<View style={[styles.base, isDark ? styles.darkMode : styles.lightMode]} />
```

### MANDATORY Style Application

```typescript
// REQUIRED: Combine styles properly
style={[styles.container, customStyle]}
style={[styles.text, textStyle, customTextStyle]}

// REQUIRED: Platform-specific handling
style={[
  styles.base,
  globalMetrics.isAndroid ? styles.android : styles.ios
]}
```

## String Usage Requirements

### MANDATORY String Constants

```typescript
import { Strings } from '../../constants';

// REQUIRED: Use centralized strings
<Text>{Strings.Auth.signInButton}</Text>
<Text>{Strings.Home.welcomeMessage}</Text>

// FORBIDDEN: Hardcoded strings
<Text>Sign In</Text> // ❌ NEVER hardcode text
```

### String Organization

- **Module-based**: `Strings.ModuleName.stringKey`
- **Type Safety**: All strings are frozen objects
- **i18n Ready**: Automatic translation support
- **Consistent**: Same strings used across components

## Accessibility Requirements

### MANDATORY Accessibility Props

```typescript
// REQUIRED accessibility implementation
<Pressable
  accessible
  accessibilityRole="button"
  accessibilityLabel={accessibilityLabel || label}
  accessibilityHint="Double tap to perform action"
  accessibilityState={{ disabled, selected }}
  testID={testID}
>
```

### Accessibility Guidelines

- **Role**: Always specify `accessibilityRole`
- **Label**: Provide meaningful `accessibilityLabel`
- **State**: Include `accessibilityState` for interactive elements
- **Hint**: Add `accessibilityHint` for complex actions
- **TestID**: Include `testID` for testing

## TypeScript Requirements

### MANDATORY Type Safety

```typescript
// REQUIRED: Strict interface definitions
interface ComponentProps {
  requiredProp: string;
  optionalProp?: boolean;
  callbackProp: (value: string) => void;
  styleProp?: StyleProp<ViewStyle>;
}

// REQUIRED: Use React.FC with props type
const Component: React.FC<ComponentProps> = (props) => {
  // Implementation
};
```

### Type Patterns

- **Props**: Always define comprehensive interfaces
- **Defaults**: Use `ComponentNameDefaultProps` pattern
- **Styles**: Use `StyleProp<ViewStyle | TextStyle>` for style props
- **Callbacks**: Define proper function signatures
- **Enums**: Use union types for variants and sizes

## Component Lifecycle & Performance

### MANDATORY Performance Patterns

```typescript
// REQUIRED: Use useCallback for event handlers
const handlePress = useCallback(() => {
  onPress?.();
}, [onPress]);

// REQUIRED: Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(prop1, prop2);
}, [prop1, prop2]);

// OPTIONAL: Memo for expensive re-renders
const Component = React.memo<ComponentProps>((props) => {
  // Component implementation
});
```

### State Management

- **Local State**: Use `useState` for component-specific state
- **Global State**: Use Redux via `useAppSelector` and `useAppDispatch`
- **Form State**: Use Formik with Yup validation
- **Async State**: Use `createAsyncThunkWithCancelToken` for API calls

## Error Handling

### MANDATORY Error Boundaries

```typescript
// REQUIRED: Proper error handling
try {
  // Component logic
} catch (error) {
  // Handle error appropriately
  console.error('Component error:', error);
}

// REQUIRED: Defensive programming
const safeValue = prop?.nestedProp ?? defaultValue;
const safeCallback = useCallback(() => {
  callback?.();
}, [callback]);
```

## Component Integration

### MANDATORY Import/Export Patterns

```typescript
// REQUIRED: Barrel exports in index.ts files
export { default as ComponentName } from './component-name';
export type { ComponentNameProps } from './component-name';

// REQUIRED: Proper import organization
import React from 'react'; // React imports first
import { View, Text } from 'react-native'; // React Native imports
import { useSelector } from 'react-redux'; // Third-party imports
import { useTheme } from '../../hooks'; // Project hooks
import { Strings } from '../../constants'; // Project constants
import { SomeUtil } from '../../utils'; // Project utilities
import OtherComponent from '../other'; // Relative component imports
```

### Component Registration

- **Export**: Add to appropriate `index.ts` files
- **Documentation**: Include JSDoc comments
- **Examples**: Provide usage examples in comments
- **Testing**: Include test identifiers

## Validation & Quality

### MANDATORY Code Quality

- **Linting**: All components must pass ESLint rules
- **TypeScript**: Strict type checking required
- **Testing**: Include testID for component testing
- **Documentation**: Comprehensive JSDoc comments
- **Performance**: Optimize re-renders and calculations

### Common Patterns to Follow

- **Loading States**: Handle loading with proper indicators
- **Error States**: Display meaningful error messages
- **Empty States**: Provide appropriate empty state UI
- **Animations**: Use consistent animation patterns
- **Gestures**: Implement proper touch handling

## Enforcement Rules

1. **⚠️ MANDATORY**: Follow 4-file architecture pattern
2. **REQUIRED**: Use theme system for all styling
3. **MANDATORY**: Implement proper TypeScript interfaces
4. **REQUIRED**: Use centralized strings from constants
5. **MANDATORY**: Include accessibility props
6. **REQUIRED**: Follow performance optimization patterns
7. **MANDATORY**: Use proper import/export organization
8. **REQUIRED**: Include comprehensive documentation

**🚨 CRITICAL**: Any deviation from these component guidelines will result in inconsistent architecture and maintenance issues.
