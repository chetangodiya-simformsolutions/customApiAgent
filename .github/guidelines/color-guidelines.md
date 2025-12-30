# Color Guidelines - test React Native Project

## 🎨 **MANDATORY COLOR SYSTEM**

**⚠️ CRITICAL RULE**: ALL colors MUST be defined in the theme system and accessed through `Colors[theme]?.colorName`. No hardcoded hex values are allowed anywhere in the codebase.

## Color Architecture

### Theme Color Structure
```typescript
// theme/Colors.ts structure
export const Colors = {
  light: ThemeColors,
  dark: ThemeColors,
  system: ThemeColors // Follows device preference
};
```

### Color Categories

#### 1. **Adaptive Colors** (swap between themes)
```typescript
// These colors automatically swap in dark mode
const adaptiveColors = {
  white: '#FFFFFF',      // → '#000000' in dark mode
  black: '#000000',      // → '#FFFFFF' in dark mode
  transparentWhite: '#FFFFFF00',  // → '#00000000' in dark mode
  transparentBlack: '#00000000'   // → '#FFFFFF00' in dark mode
};
```

#### 2. **Static Theme Colors** (consistent across themes)
```typescript
// These colors remain the same in both light and dark themes
const staticColors = {
  primary: '#141414',           // Brand primary color
  secondary: '#F1C336',         // Brand secondary color
  gray: '#7B7B7B',             // Neutral gray
  error: '#E53E3E',            // Error/danger color
  pink: '#BA25EB',             // Accent pink
  orange: '#F39C3C',           // Accent orange
  lightBlue: '#3787FC',        // Accent light blue
  red: '#DD2C2C',              // Accent red
  darkBlue: '#374dfc',         // Accent dark blue
  transparent: 'transparent'    // Transparent color
};
```

## Color Definition Rules

### ✅ CORRECT Color Definition
```typescript
// theme/Colors.ts - MANDATORY structure
const themeColors: Record<Keys, string> = {
  primary: '#141414',
  secondary: '#F1C336',
  gray: '#7B7B7B',
  error: '#E53E3E',
  // ... other static colors
};

const commonColors: Record<CommonKeys, string> = {
  white: '#FFFFFF',
  black: '#000000',
  transparentBlack: '#00000000',
  transparentWhite: '#FFFFFF00'
};

// Light theme implementation
const light: ThemeColors = {
  ...themeColors,
  black: commonColors.black,      // Normal mapping
  white: commonColors.white,
  transparentWhite: commonColors.transparentWhite,
  transparentBlack: commonColors.transparentBlack
};

// Dark theme implementation  
const dark: ThemeColors = {
  ...themeColors,
  black: commonColors.white,      // Swapped for dark mode
  white: commonColors.black,      // Swapped for dark mode
  transparentWhite: commonColors.transparentBlack,  // Swapped
  transparentBlack: commonColors.transparentWhite   // Swapped
};
```

### ❌ FORBIDDEN Color Practices
```typescript
// ❌ NEVER define colors outside theme system
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',  // ❌ FORBIDDEN
    borderColor: '#E53E3E',     // ❌ FORBIDDEN
  }
});

// ❌ NEVER use inline hex colors
<View style={{ backgroundColor: '#000000' }} />  // ❌ FORBIDDEN
```

## Color Usage Patterns

### MANDATORY Color Access
```typescript
// REQUIRED: Always access through theme
import { Colors } from '../../theme';

const styleSheet = (theme: ThemeMode) => StyleSheet.create({
  container: {
    backgroundColor: Colors[theme]?.white",     // ✅ Adaptive color
    borderColor: Colors[theme]?.primary,      // ✅ Static color
  },
  
  text: {
    color: Colors[theme]?.black,              // ✅ Adaptive color
  },
  
  errorText: {
    color: Colors[theme]?.error,              // ✅ Static themed color
  }
});
```

### Color Use Cases

#### Background Colors
```typescript
// Primary backgrounds
backgroundColor: Colors[theme]?.white,        // Main background
backgroundColor: Colors[theme]?.primary,      // Brand background

// Status backgrounds  
backgroundColor: Colors[theme]?.error,        // Error states
backgroundColor: Colors[theme]?.gray,         // Neutral states
```

#### Text Colors
```typescript
// Primary text
color: Colors[theme]?.black,                 // Main text color
color: Colors[theme]?.gray,                  // Secondary text

// Status text
color: Colors[theme]?.error,                 // Error text
color: Colors[theme]?.primary,               // Brand text
```

#### Border Colors
```typescript
// Standard borders
borderColor: Colors[theme]?.gray,            // Standard borders
borderColor: Colors[theme]?.primary,         // Brand borders
borderColor: Colors[theme]?.error,           // Error borders
```

#### Overlay Colors
```typescript
// Transparent overlays
backgroundColor: Colors[theme]?.transparentBlack,  // Dark overlay
backgroundColor: Colors[theme]?.transparentWhite,  // Light overlay
```

## Semantic Color Naming

### MANDATORY Semantic Categories
```typescript
// Status Colors (use static theme colors)
success: Colors[theme]?.primary,    // For success states
warning: Colors[theme]?.orange,     // For warning states  
error: Colors[theme]?.error,        // For error states
info: Colors[theme]?.lightBlue,     // For info states

// Interactive Colors
disabled: Colors[theme]?.gray,      // For disabled states
focus: Colors[theme]?.secondary,    // For focus states
hover: Colors[theme]?.gray,         // For hover states (web)

// Content Colors
primary: Colors[theme]?.black,      // Primary text/content
secondary: Colors[theme]?.gray,     // Secondary text/content
inverse: Colors[theme]?.white,      // Inverse text (on dark backgrounds)
```

### Color Naming Conventions
- **Descriptive**: Use semantic names (`error`, `success`, `primary`)
- **Consistent**: Follow established naming patterns
- **Contextual**: Group by usage context (`button`, `badge`, `input`)
- **Hierarchical**: Use primary/secondary/tertiary hierarchy

## Dark Mode Implementation

### Adaptive Color Logic
```typescript
// MANDATORY: Colors that adapt to theme
const adaptiveMapping = {
  // Light mode → Dark mode
  white: '#FFFFFF' → '#000000',
  black: '#000000' → '#FFFFFF',
  transparentWhite: '#FFFFFF00' → '#00000000',
  transparentBlack: '#00000000' → '#FFFFFF00'
};

// Static colors remain unchanged
const staticColors = {
  primary: '#141414',     // Same in both themes
  error: '#E53E3E',      // Same in both themes
  // ... other static colors
};
```

### Theme-Aware Component Colors
```typescript
// Component should adapt to theme automatically
const MyComponent = () => {
  const { styles, theme } = useTheme(styleSheet);
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Content</Text>
    </View>
  );
};

const styleSheet = (theme: ThemeMode) => StyleSheet.create({
  container: {
    backgroundColor: Colors[theme]?.white,  // Auto-adapts to theme
  },
  text: {
    color: Colors[theme]?.black,           // Auto-adapts to theme
  }
});
```

## Color Accessibility

### MANDATORY Contrast Requirements
```typescript
// Ensure sufficient contrast ratios
const accessiblePairs = {
  // High contrast combinations
  primaryText: Colors[theme]?.black,     // on white background
  inverseText: Colors[theme]?.white,     // on dark background
  
  // Medium contrast for secondary content
  secondaryText: Colors[theme]?.gray,    // on white background
  
  // Status colors with sufficient contrast
  errorText: Colors[theme]?.error,       // on white background
};
```

### Color Blind Considerations
- **Avoid**: Red/green only distinctions
- **Include**: Additional visual cues (icons, patterns)
- **Test**: Validate with color blind simulators
- **Contrast**: Maintain WCAG AA standards (4.5:1 ratio)

## Color Configuration Management

### Theme Configuration File
```typescript
// theme/Colors.ts - MANDATORY structure
export interface ThemeColors {
  // Adaptive colors
  white: string;
  black: string;
  transparentWhite: string;
  transparentBlack: string;
  
  // Static theme colors
  primary: string;
  secondary: string;
  gray: string;
  error: string;
  // ... other colors
}

export type ThemeMode = 'light' | 'dark' | 'system';

export const Colors: Record<ThemeMode, ThemeColors> = {
  light: lightTheme,
  dark: darkTheme,
  system: systemTheme  // Follows device preference
};
```

## Performance Considerations

### Color Caching
```typescript
// Colors are cached in theme context
const themeContext = {
  colors: Colors[currentTheme],  // Cached color object
  theme: currentTheme,           // Current theme mode
  changeTheme: (newTheme) => {}  // Theme switching function
};
```

### Memory Optimization
- **Static Colors**: Defined once, reused across components
- **Theme Switch**: Efficient color swapping without recreation
- **Caching**: Color objects cached in theme context

## Enforcement Rules

1. **⚠️ MANDATORY**: All colors MUST be defined in `theme/Colors.ts`
2. **REQUIRED**: Access colors only via `Colors[theme]?.colorName`
3. **FORBIDDEN**: No hardcoded hex values anywhere in codebase
4. **MANDATORY**: Use adaptive colors for backgrounds and text
5. **REQUIRED**: Maintain contrast ratios for accessibility
6. **MANDATORY**: Follow semantic color naming conventions
7. **REQUIRED**: Support both light and dark themes
8. **MANDATORY**: Validate all color definitions

## Examples

### ✅ CORRECT Color Implementation
```typescript
// Proper color usage in component
const styleSheet = (theme: ThemeMode) => StyleSheet.create({
  container: {
    backgroundColor: Colors[theme]?.white,
    borderColor: Colors[theme]?.gray,
  },
  primaryText: {
    color: Colors[theme]?.black,
  },
  errorText: {
    color: Colors[theme]?.error,
  }
});
```

### ❌ INCORRECT Implementation (FORBIDDEN)
```typescript
// ❌ This violates color guidelines
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',  // ❌ Hardcoded color
    borderColor: '#E53E3E',     // ❌ Hardcoded color
  }
});
```

**🚨 CRITICAL**: Color compliance is non-negotiable. Any hardcoded colors will break theme switching and accessibility support. even don't define fallback colors, colors should be from theme only.
