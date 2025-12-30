# Assets Guidelines - test React Native Project

## 🖼️ **MANDATORY ASSET MANAGEMENT**

**⚠️ CRITICAL RULE**: ALL assets MUST follow the existing centralized asset system with proper organization, naming conventions, and format preferences.

## Current Asset Architecture Analysis

### MANDATORY Asset Hierarchy (Existing Structure)
```
app/assets/
├── svgs/               # SVG components (PREFERRED)
│   ├── company.svg
│   ├── verified.svg
│   ├── verified-custom.svg
│   ├── verified-star.svg
│   └── index.ts        # Named exports of SVG components
├── icons/              # PNG icons with multi-resolution
│   ├── backArrow.png
│   ├── backArrow@2x.png
│   ├── backArrow@3x.png
│   └── index.ts        # Default export object
├── images/             # PNG images with multi-resolution
│   ├── profile.png
│   ├── profile@2x.png
│   ├── profile@3x.png
│   └── index.ts        # Default export object
├── fonts/              # Font files
│   └── index.ts
└── index.ts            # Main barrel export
```

### Asset Format Preferences (Current Implementation)
1. **🥇 SVG** - Vector graphics, scalable, React components (PREFERRED)
2. **🥈 PNG** - Multi-resolution raster images (@1x, @2x, @3x)
3. **JPG** - Photos and complex images (when needed)

## SVG Implementation (PREFERRED - Current Standard)

### MANDATORY SVG Usage Pattern
```typescript
// Current SVG implementation as React components
// SVGs are imported directly as components from react-native-svg-transformer

// assets/svgs/index.ts - Current export pattern
export { default as company } from './company.svg';
export { default as verified } from './verified.svg';
export { default as verifiedCustom } from './verified-custom.svg';
export { default as verifiedStar } from './verified-star.svg';

// Usage in components (Current pattern)
import { Svgs } from '../../assets';

const MyComponent = () => {
  const IconComponent = status === 'verified' ? Svgs.verified : Svgs.company;
  
  return (
    <IconComponent
      width={24}
      height={24}
      accessibilityLabel="Status icon"
      accessibilityRole="image"
    />
  );
};
```

### MANDATORY SVG File Format
```xml
<!-- SVG files should follow this format -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="12" fill="#2E90FA"/>
  <path d="M17.25 8.25L10.5 15L6.75 11.25" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### MANDATORY SVG Component Properties
```typescript
// SVG components automatically support these props via react-native-svg-transformer
interface SVGComponentProps {
  width?: number | string;
  height?: number | string;
  fill?: string;
  stroke?: string;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  testID?: string;
}

// Usage with theme integration
const ThemedSVGUsage = () => {
  const { theme } = useTheme();
  
  return (
    <Svgs.verified
      width={scale(20)}
      height={scale(20)}
      fill={Colors[theme]?.primary}
      accessibilityLabel="Verified status"
    />
  );
};
```

## PNG Icons Implementation (Fallback)

### MANDATORY PNG Icon Structure
```typescript
// assets/icons/index.ts - Current export pattern
export default {
  backArrow: require('./backArrow.png'),
  // Add more icons following the same pattern
};

// Multi-resolution files required:
// backArrow.png     - @1x (base resolution)
// backArrow@2x.png  - @2x (2x resolution)
// backArrow@3x.png  - @3x (3x resolution)

// Usage in components (Current pattern)
import { Icons } from '../../assets';

const IconUsage = () => (
  <Image 
    source={Icons.backArrow} 
    style={styles.icon}
    accessibilityRole="image"
    accessibilityLabel="Back arrow"
  />
);
```

### MANDATORY Multi-Resolution Support
```typescript
// React Native automatically selects appropriate resolution
// File naming convention is MANDATORY:
const IconFiles = {
  'icon-name.png',     // @1x - base resolution
  'icon-name@2x.png',  // @2x - high DPI
  'icon-name@3x.png',  // @3x - extra high DPI
};

// Example for adding new PNG icon:
// 1. Add files: newIcon.png, newIcon@2x.png, newIcon@3x.png
// 2. Export in icons/index.ts:
export default {
  backArrow: require('./backArrow.png'),
  newIcon: require('./newIcon.png'), // Auto-selects resolution
};
```

## Images Implementation

### MANDATORY Image Structure
```typescript
// assets/images/index.ts - Current export pattern
export default {
  profile: require('./profile.png'),
  // Add more images following the same pattern
};

// Multi-resolution files:
// profile.png     - @1x
// profile@2x.png  - @2x  
// profile@3x.png  - @3x

// Usage in components (Current pattern)
import { Images } from '../../assets';

const ImageUsage = () => (
  <Image 
    source={Images.profile}
    style={styles.profileImage}
    resizeMode="cover"
  />
);
```

## Asset Integration Patterns (Current Implementation)

### MANDATORY Main Barrel Export
```typescript
// assets/index.ts - Current export pattern
export { default as Fonts } from './fonts';
export { default as Icons } from './icons';
export { default as Images } from './images';
import * as SvgsImport from './svgs';
export const Svgs = SvgsImport;

// Usage in components
import { Svgs, Icons, Images, Fonts } from '../../assets';
```

### MANDATORY Component Integration Examples
```typescript
// Example 1: SVG usage in Avatar component (Current pattern)
import { Svgs } from '../../assets';

const AvatarComponent = ({ statusIcon }) => {
  const IconComponent = statusIcon === 'verified' ? Svgs.verified : Svgs.company;
  
  return (
    <View style={styles.statusIconContainer}>
      <IconComponent
        width={statusIconSize.width}
        height={statusIconSize.height}
        accessibilityLabel={`Status: ${statusIcon}`}
        accessibilityRole="image"
      />
    </View>
  );
};

// Example 2: PNG icon usage in Input component (Current pattern)
import { Icons } from '../../assets';

const InputComponent = () => (
  <View>
    <Image source={Icons.backArrow} style={styles.prefixDropdownIcon} />
  </View>
);

// Example 3: Image usage (Current pattern)
import { Images } from '../../assets';

const ProfileComponent = () => (
  <Image 
    source={Images.profile}
    style={styles.profileImage}
    resizeMode="cover"
  />
);
```

## Asset Naming Conventions (Current Standards)

### MANDATORY File Naming Rules
```typescript
// SVG files (kebab-case)
const SVGNaming = [
  'company.svg',
  'verified.svg',
  'verified-custom.svg',
  'verified-star.svg',
  'arrow-left.svg',
  'user-profile.svg',
];

// PNG files (camelCase base name)
const PNGNaming = [
  'backArrow.png',
  'backArrow@2x.png',
  'backArrow@3x.png',
  'userProfile.png',
  'userProfile@2x.png',
  'userProfile@3x.png',
];

// Export naming (camelCase)
const ExportNaming = {
  // SVG exports (named exports)
  svgs: 'export { default as verified } from "./verified.svg"',
  
  // PNG exports (object properties)
  icons: 'backArrow: require("./backArrow.png")',
  images: 'profile: require("./profile.png")',
};
```

## Adding New Assets (Current Process)

### MANDATORY SVG Addition Process
```typescript
// 1. Add SVG file to assets/svgs/
// Example: assets/svgs/new-icon.svg

// 2. Export in assets/svgs/index.ts
export { default as company } from './company.svg';
export { default as verified } from './verified.svg';
export { default as newIcon } from './new-icon.svg'; // Add this line

// 3. Use in components
import { Svgs } from '../../assets';

const MyComponent = () => (
  <Svgs.newIcon
    width={24}
    height={24}
    accessibilityLabel="New icon"
  />
);
```

### MANDATORY PNG Icon Addition Process
```typescript
// 1. Add PNG files to assets/icons/
// Files: newIcon.png, newIcon@2x.png, newIcon@3x.png

// 2. Export in assets/icons/index.ts
export default {
  backArrow: require('./backArrow.png'),
  newIcon: require('./newIcon.png'), // Add this line
};

// 3. Use in components
import { Icons } from '../../assets';

const MyComponent = () => (
  <Image source={Icons.newIcon} style={styles.icon} />
);
```

### MANDATORY Image Addition Process
```typescript
// 1. Add image files to assets/images/
// Files: newImage.png, newImage@2x.png, newImage@3x.png

// 2. Export in assets/images/index.ts
export default {
  profile: require('./profile.png'),
  newImage: require('./newImage.png'), // Add this line
};

// 3. Use in components
import { Images } from '../../assets';

const MyComponent = () => (
  <Image source={Images.newImage} style={styles.image} />
);
```

## Theme Integration (Current Pattern)

### MANDATORY Theme-Aware Asset Usage
```typescript
// SVGs support dynamic theming through props
import { Svgs } from '../../assets';
import { useTheme } from '../../hooks';
import { Colors, scale } from '../../theme';

const ThemedComponent = () => {
  const { theme } = useTheme();
  
  return (
    <Svgs.verified
      width={scale(24)}
      height={scale(24)}
      fill={Colors[theme]?.primary}
      stroke={Colors[theme]?.border}
    />
  );
};

// PNG icons and images use theme through styling
const ThemedPNGComponent = () => {
  const { styles } = useTheme(styleSheet);
  
  return (
    <Image 
      source={Icons.backArrow}
      style={[styles.icon, { tintColor: Colors[theme]?.primary }]}
    />
  );
};
```

## Performance Optimization (Current Implementation)

### MANDATORY Asset Performance
```typescript
// Use FastImage for better performance (if needed)
import FastImage from 'react-native-fast-image';

const OptimizedImage = () => (
  <FastImage
    source={Images.profile}
    style={styles.image}
    resizeMode={FastImage.resizeMode.cover}
  />
);
```

## Accessibility (Current Standards)

### MANDATORY Accessibility Implementation
```typescript
// SVG accessibility (Current pattern)
<Svgs.verified
  width={24}
  height={24}
  accessibilityLabel="Verified status"
  accessibilityRole="image"
/>

// PNG accessibility (Current pattern)
<Image 
  source={Icons.backArrow}
  style={styles.icon}
  accessibilityRole="image"
  accessibilityLabel="Back arrow"
/>
```

## Enforcement Rules (Based on Current Architecture)

1. **⚠️ MANDATORY**: Prefer SVG over PNG for all icons and simple graphics
2. **REQUIRED**: Follow existing directory structure: `svgs/`, `icons/`, `images/`
3. **MANDATORY**: Use named exports for SVGs, default object exports for PNGs
4. **REQUIRED**: Provide @1x, @2x, @3x variants for all PNG assets
5. **MANDATORY**: Follow kebab-case for SVG files, camelCase for PNG files
6. **REQUIRED**: Include accessibility labels for all assets
7. **MANDATORY**: Use theme colors for SVG fill/stroke when needed
8. **REQUIRED**: Import assets through main barrel export
9. **MANDATORY**: Test assets on multiple screen densities
10. **REQUIRED**: Optimize SVG files before adding to project

## Examples

### ✅ CORRECT Asset Implementation (Current Pattern)
```typescript
// SVG usage (PREFERRED)
import { Svgs } from '../../assets';

const MyComponent = () => (
  <Svgs.verified
    width={scale(24)}
    height={scale(24)}
    accessibilityLabel="Verified"
  />
);

// PNG fallback
import { Icons } from '../../assets';

const BackButton = () => (
  <Image 
    source={Icons.backArrow} 
    style={styles.backIcon}
    accessibilityRole="image"
    accessibilityLabel="Back"
  />
);
```

### ❌ INCORRECT Implementation (FORBIDDEN)
```typescript
// ❌ Direct SVG import instead of using barrel export
import VerifiedIcon from '../assets/svgs/verified.svg';

// ❌ Hardcoded require instead of using exported objects
<Image source={require('../assets/icons/backArrow.png')} />

// ❌ Missing multi-resolution variants
// Only having backArrow.png without @2x and @3x variants

// ❌ Wrong naming convention
// Using camelCase for SVG files: verifiedIcon.svg (should be verified-icon.svg)
```

**🚨 CRITICAL**: Asset compliance ensures optimal performance, consistent UI, theme support, and maintainable codebase following the established project architecture.
