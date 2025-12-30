#  test React Native Project - AI Coding Guidelines

**⚠️ CRITICAL MANDATE**: Before implementing ANY code, component, module, or feature, you MUST consult and strictly follow ALL specialized guideline files listed below. These guidelines are MANDATORY and ensure code quality, consistency, and project architecture compliance.

## 📋 **MANDATORY GUIDELINES CONSULTATION**

**🚨 BEFORE ANY IMPLEMENTATION**: Review these specialized guideline files:

1. **[Theme Guidelines](./guidelines/theme-guidelines.md)** - Theme system, colors, metrics, scaling
2. **[Component Guidelines](./guidelines/component-guidelines.md)** - Component architecture, files, types, styles
3. **[Color Guidelines](./guidelines/color-guidelines.md)** - Color definitions, usage, accessibility
4. **[Strings Guidelines](./guidelines/strings-guidelines.md)** - String management, i18n, organization
5. **[Code Guidelines](./guidelines/code-guidelines.md)** - Code architecture, structure, conventions
6. **[Navigation Guidelines](./guidelines/navigation-guidelines.md)** - Navigation patterns, routing, deep linking
7. **[Redux Guidelines](./guidelines/redux-guidelines.md)** - State management, async actions, selectors
8. **[Performance Guidelines](./guidelines/performance-guidelines.md)** - Optimization, memory, animations
9. **[Assets Guidelines](./guidelines/assets-guidelines.md)** - Asset management, SVG preference, optimization
10. **[Static Data Guidelines](./guidelines/static-data-guidelines.md)** - Centralized static data management
11. **[Code Review Guidelines](./guidelines/code-review-guidelines.md)** - PR reviews, checklist, best practices

**⚠️ ENFORCEMENT RULE**: Every code generation MUST demonstrate compliance with these guidelines. Reference specific rules and patterns from the appropriate guideline files in your implementations.

## Project Architecture Overview

**Framework**: React Native 0.78.2 with TypeScript
**State Management**: Redux Toolkit with redux-persist (MMKV storage)
**Navigation**: React Navigation v6 (native stack)
**Styling**: Theme-based with dark/light mode support

## Critical Development Rules

### 🚨 **MANDATORY GUIDELINE COMPLIANCE**

1. **Consult Guidelines First**: Always reference appropriate guideline files before implementation
2. **Follow Architectural Patterns**: Adhere to established module, component, and code structure
3. **Theme Integration**: Use theme system for all colors, metrics, and responsive design
4. **String Management**: Use centralized string system with i18n support
5. **Performance Focus**: Implement all performance optimization patterns
6. **Type Safety**: Maintain strict TypeScript compliance throughout

### ⚡ **IMPLEMENTATION WORKFLOW**

1. **Read Relevant Guidelines**: Identify and review applicable guideline files
2. **Plan Architecture**: Design implementation following established patterns
3. **Generate Code**: Implement with strict adherence to guidelines
4. **Validate Compliance**: Ensure all rules and patterns are followed
5. **Document Decisions**: Reference specific guidelines used in implementation
6. **Use Existing Components**: Always utilize pre-implemented components from the `components` folder (e.g., `Button`, `Input`, `Card`) when building features, instead of creating new ones unless absolutely necessary.

### 🧩 **Example Decision Flow (for Copilot)***
| Implementation Type | Required Guidelines                                |
| ------------------- | -------------------------------------------------- |
| New UI Component    | Component, Theme, Color, String, Code, Performance |
| New Feature Screen  | All except Assets/Static Data                      |
| Redux Slice         | Redux, Code, Performance                           |
| Navigation Update   | Navigation, Code                                   |
| Asset Addition      | Assets, Code                                       |
| Static Data Update  | Static Data, Code                                  |

## Quick Reference Links

- **🎨 Theming**: [Theme Guidelines](./guidelines/theme-guidelines.md) - Colors, metrics, responsive design
- **🧩 Components**: [Component Guidelines](./guidelines/component-guidelines.md) - Architecture, files, types
- **🌈 Colors**: [Color Guidelines](./guidelines/color-guidelines.md) - Definition, usage, accessibility
- **📝 Strings**: [Strings Guidelines](./guidelines/strings-guidelines.md) - i18n, organization, management
- **📁 Code Structure**: [Code Guidelines](./guidelines/code-guidelines.md) - Architecture, conventions, best practices
- **🧭 Navigation**: [Navigation Guidelines](./guidelines/navigation-guidelines.md) - Routing, deep linking, state
- **🔄 State**: [Redux Guidelines](./guidelines/redux-guidelines.md) - Store, actions, selectors, middleware
- **Static Data**: [Static Data Guidelines](./guidelines/static-data-guidelines.md) - Centralized static data management
- **⚡ Performance**: [Performance Guidelines](./guidelines/performance-guidelines.md) - Optimization, memory, animations
- **Code Review**: [Code Review Guidelines](./guidelines/code-review-guidelines.md) - PR reviews, checklist, best practices

**🎯 SUCCESS CRITERIA**: All implementations must demonstrate explicit compliance with relevant guidelines and maintain project architecture consistency.

### Module Organization

```
app/
├── modules/          # Feature-based modules (auth, home, details)
├── navigation/       # Navigation configuration
├── components/       # Shared UI components
├── redux/            # Store, reducers, actions
├── hooks/            # Custom hooks (useTheme, usePermission, etc.)
├── services/         # Storage, API configurations
├── utils/            # Common utilities and helpers
├── constants/        # App constants, routes, strings
├── theme/            # Colors, metrics, styles
└── types/            # TypeScript type definitions
```

### Feature Module Structure

```
modules/feature-name/
├── FeatureScreen.tsx         # Main screen component
├── FeatureStyles.ts          # Screen-level styles
├── FeatureTypes.ts           # Screen-level types
├── useFeature.ts             # Screen-level custom hook
├── index.ts                  # Barrel export
└── sub-components/           # Feature-specific components
    ├── SubComponent.tsx
    ├── SubComponentStyles.ts
    ├── SubComponentTypes.ts
    ├── SubComponentUtils.ts
    └── index.ts
```

### Module Development Patterns

- **Screen Components**: Main feature entry points (e.g., `SigninScreen.tsx`)
- **Custom Hooks**: Feature-specific logic (e.g., `useSignin.ts`)
- **Sub-components**: Feature-specific UI components with full component architecture
- **Utils**: Feature-specific utility functions for form validation, business logic
- **Types**: Feature-specific TypeScript interfaces and route parameters
- **Barrel Exports**: Each module and sub-component has index.ts for clean imports

### Redux Store Structure

- **Whitelist persistence**: `['auth']` - only auth state persists
- **MMKV encryption**: Custom key for secure storage
- **Redux Toolkit**: Use `createSlice` patterns for reducers
- **Reactotron integration**: Development-only debugging

### Core Integration Overview

- **Navigation**: All routing managed through typed ROUTES enum and NavigatorUtils
- **String Management**: Centralized i18n system with frozen string objects
- **State Management**: Redux Toolkit with MMKV persistence and typed selectors

## Development Workflows

### Build Commands

- **Development**: `yarn android:dev` or `yarn ios:dev`
- **Staging**: `yarn android:stage` or `yarn ios:stage`
- **Production**: `yarn android:prod` or `yarn ios:prod`
- **Environment Files**: Uses `.env.development`, `.env.staging`, `.env.production`

### Code Quality Pipeline

- **Pre-commit**: `yarn lint` (enforced by Husky)
- **Full Check**: `yarn local-check` (lint + format + types + spelling)
- **Test Coverage**: `yarn test` with Jest configuration

### Environment Configuration

- **react-native-config**: Environment variables from `.env.*` files
- **Multi-scheme builds**: Different app IDs for dev/staging/prod
- **Feature Flags**: Use `AppConst.isDevelopment` for dev-only features

## Project-Specific Conventions

### Core Technology Stack

- **Theming**: Dark/light mode with `useTheme(styleSheet)` pattern and `scale()` for responsive design
- **Components**: 4-file architecture (Component, Styles, Types, index) with strict TypeScript
- **Styling**: Theme-aware colors via `Colors[theme]?.colorName` and platform detection

### API & Storage

- **Apisauce**: HTTP client built on Axios with interceptors
- **MMKV**: Primary storage with encryption for sensitive data
- **Redux Persist**: Selective state persistence with whitelist/blacklist
- **Sentry**: Error tracking configured per environment

### Asset & File Management

- **File Naming**: PascalCase for components, camelCase for utilities, UPPER_CASE for constants
- **Asset Organization**: Centralized in `app/assets/` with barrel exports and multi-resolution support
- **Responsive Design**: Universal `scale()` function and `globalMetrics` for platform detection

## Development Environment

### Key Dependencies

- **Form Handling**: Formik + Yup validation schemas
- **Permissions**: `react-native-permissions` with platform configuration
- **Development Tools**: Reactotron, Flipper, ESLint with strict TypeScript rules

### Platform Configuration

- **Multi-Environment**: Different schemes/buildTypes for dev/staging/prod
- **Deep Linking**: Custom URL prefixes with automatic parameter parsing
- **Asset Optimization**: Multi-resolution support with automatic selection

## Implementation Best Practices

### Core Development Principles

- **Guideline Compliance**: Always consult specialized guideline files before implementation
- **Architecture Consistency**: Follow established patterns for modules, components, and state management
- **Performance First**: Implement React.memo, useCallback, useMemo for optimal performance
- **Type Safety**: Maintain strict TypeScript compliance with comprehensive interfaces
- **Error Handling**: Implement proper error boundaries and defensive programming patterns
- **Documentation**: Include JSDoc comments for all public functions and complex logic

### Quality Assurance

- **Pre-commit Hooks**: Automatic linting and formatting via Husky
- **Code Review**: Validate guideline compliance and architectural patterns
- **Testing**: Comprehensive coverage with Jest and component testing
- **Performance Monitoring**: Track render times and memory usage in development
