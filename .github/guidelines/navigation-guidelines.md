# Navigation Guidelines - test React Native Project

## 🧭 **MANDATORY NAVIGATION ARCHITECTURE**

**⚠️ CRITICAL RULE**: ALL navigation MUST use the centralized navigation system with typed routes, utility functions, and deep linking support.

## Navigation Architecture

### MANDATORY Navigation Structure

```typescript
// constants/NavigationRoutes.ts - REQUIRED route definitions
export enum ROUTES {
  // Authentication Stack
  SignIn = 'SignIn',
  SignUp = 'SignUp',
  ForgotPassword = 'ForgotPassword',

  // Main Stack
  Home = 'Home',
  Details = 'Details',
  Profile = 'Profile',
  Settings = 'Settings',

  // Nested Stacks
  AuthStack = 'AuthStack',
  MainStack = 'MainStack',
  TabStack = 'TabStack'
}

// navigation/AppNavigation.tsx - REQUIRED navigation setup
// Type definitions for route parameters
export type RootStackParamList = {
  [ROUTES.SignIn]: undefined;
  [ROUTES.SignUp]: undefined;
  [ROUTES.Home]: undefined;
  [ROUTES.Details]: { id: string; title?: string };
  [ROUTES.Profile]: { userId: string };
  [ROUTES.Settings]: undefined;
};
```

### MANDATORY Navigation Utils

```typescript
// utils/NavigatorUtils.ts - REQUIRED navigation functions
import { NavigationContainerRef, StackActions, CommonActions } from '@react-navigation/native';
import { ROUTES } from '../constants';
import type { RootStackParamList } from '../navigation';

// REQUIRED: Global navigation reference
export const navigationRef = React.createRef<NavigationContainerRef<RootStackParamList>>();

/**
 * Navigation readiness check
 * @returns boolean indicating if navigation is ready
 */
const navigationCheck = (): boolean => {
  return navigationRef.current?.isReady() ?? false;
};

/**
 * Basic navigation functions
 */

// Navigate to screen with parameters
export const navigateWithParam = <T extends keyof RootStackParamList>(
  route: T,
  params?: RootStackParamList[T]
): void => {
  if (navigationCheck()) {
    navigationRef.current?.navigate(route, params);
  }
};

// Navigate and replace current screen
export const navigateWithReplace = <T extends keyof RootStackParamList>(
  route: T,
  params?: RootStackParamList[T]
): void => {
  if (navigationCheck()) {
    navigationRef.current?.dispatch(StackActions.replace(route, params));
  }
};

// Push new screen to stack
export const navigateWithPush = <T extends keyof RootStackParamList>(
  route: T,
  params?: RootStackParamList[T]
): void => {
  if (navigationCheck()) {
    navigationRef.current?.dispatch(StackActions.push(route, params));
  }
};

/**
 * Stack management functions
 */

// Pop screens from stack
export const navigatePop = (count: number = 1, toTop: boolean = false): void => {
  if (navigationCheck()) {
    if (toTop) {
      navigationRef.current?.dispatch(StackActions.popToTop());
    } else {
      navigationRef.current?.dispatch(StackActions.pop(count));
    }
  }
};

// Go back one screen
export const navigateBack = (): void => {
  if (navigationCheck()) {
    navigationRef.current?.goBack();
  }
};

/**
 * Advanced navigation functions
 */

// Navigate to nested stack with parameters
export const navigateStackWithParam = <T extends keyof RootStackParamList>(
  stackName: string,
  route: T,
  params?: RootStackParamList[T]
): void => {
  if (navigationCheck()) {
    navigationRef.current?.navigate(stackName, {
      screen: route,
      params
    });
  }
};

// Reset navigation state
export const navigateWithReset = <T extends keyof RootStackParamList>(
  stackName: string,
  route: T,
  params?: RootStackParamList[T]
): void => {
  if (navigationCheck()) {
    navigationRef.current?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: stackName,
            state: {
              routes: [{ name: route, params }]
            }
          }
        ]
      })
    );
  }
};

/**
 * Drawer navigation functions (if using drawer)
 */
export const navigateOpenDrawer = (): void => {
  if (navigationCheck()) {
    navigationRef.current?.dispatch(DrawerActions.openDrawer());
  }
};

export const navigateCloseDrawer = (): void => {
  if (navigationCheck()) {
    navigationRef.current?.dispatch(DrawerActions.closeDrawer());
  }
};

export const navigateToggleDrawer = (): void => {
  if (navigationCheck()) {
    navigationRef.current?.dispatch(DrawerActions.toggleDrawer());
  }
};

export const navigateJumpToDrawer = <T extends keyof RootStackParamList>(route: T): void => {
  if (navigationCheck()) {
    navigationRef.current?.dispatch(DrawerActions.jumpTo(route));
  }
};

/**
 * Tab navigation functions (if using tabs)
 */
export const navigateJumpToTab = <T extends keyof RootStackParamList>(route: T): void => {
  if (navigationCheck()) {
    navigationRef.current?.dispatch(TabActions.jumpTo(route));
  }
};
```

## Screen Integration

### MANDATORY Screen Navigation Hooks

```typescript
// In screen components - REQUIRED patterns
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { navigateWithParam, navigateBack } from '../../utils';
import { ROUTES } from '../../constants';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, ROUTES.Details>;

const DetailsScreen: React.FC = () => {
  // REQUIRED: Navigation hook
  const navigation = useNavigation();

  // REQUIRED: Route parameters
  const route = useRoute<DetailsScreenRouteProp>();
  const { id, title } = route.params;

  // REQUIRED: Focus effect for screen actions
  useFocusEffect(
    useCallback(() => {
      // Screen focused logic
      console.log('Screen focused');

      return () => {
        // Screen unfocused cleanup
        console.log('Screen unfocused');
      };
    }, [])
  );

  // REQUIRED: Navigation handlers
  const handleGoBack = useCallback(() => {
    navigateBack();
  }, []);

  const handleNavigateToProfile = useCallback(() => {
    navigateWithParam(ROUTES.Profile, { userId: id });
  }, [id]);

  return (
    <View>
      {/* Screen content */}
    </View>
  );
};
```

### MANDATORY Header Integration

```typescript
// Screen with custom header
const ScreenWithHeader: React.FC = () => {
  const navigation = useNavigation();

  // REQUIRED: Set navigation options
  useLayoutEffect(() => {
    navigation.setOptions({
      title: Strings.Details.screenTitle,
      headerShown: true,
      headerLeft: () => (
        <Pressable onPress={() => navigateBack()}>
          <Icons.backArrow />
        </Pressable>
      ),
      headerRight: () => (
        <Pressable onPress={handleShare}>
          <Icons.share />
        </Pressable>
      ),
    });
  }, [navigation]);

  return <View>{/* Screen content */}</View>;
};

// Or using CustomHeader component
const ScreenWithCustomHeader: React.FC = () => {
  return (
    <View style={styles.screen}>
      <CustomHeader
        title={Strings.Details.screenTitle}
        showBackButton
        onBackPress={() => navigateBack()}
        rightComponent={
          <Pressable onPress={handleShare}>
            <Icons.share />
          </Pressable>
        }
      />
      {/* Screen content */}
    </View>
  );
};
```

## Deep Linking Integration

### Deep Link Configuration

```typescript
// navigation/AppNavigation.tsx - Deep linking setup
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from '../utils';
import { ROUTES } from '../constants';

const Stack = createNativeStackNavigator();

// REQUIRED: Deep link configuration
const linking = {
  prefixes: ['test://', 'test.page.link//', 'https://test.page.link'],

  config: {
    screens: {
      [ROUTES.Home]: 'home',
      [ROUTES.Details]: 'details/:id',
      [ROUTES.Profile]: 'profile/:userId',
      [ROUTES.SignIn]: 'auth/signin',
      [ROUTES.SignUp]: 'auth/signup',
    },
  },

  // REQUIRED: Custom URL parsing
  getInitialURL: async () => {
    // Check for deep link on app launch
    const url = await Linking.getInitialURL();
    return url;
  },

  // REQUIRED: Handle incoming URLs
  subscribe: (listener: (url: string) => void) => {
    const subscription = Linking.addEventListener('url', ({ url }) => {
      listener(url);
    });

    return () => subscription?.remove();
  },
};

const AppNavigation: React.FC = () => {
  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      onReady={() => {
        // Navigation ready callback
      }}
    >
      {/* Navigation stacks */}
    </NavigationContainer>
  );
};
```

### Deep Link Handling

```typescript
// utils/DeepLinkUtils.ts - Deep link utilities
import { Linking } from 'react-native';
import { navigateWithParam, navigateWithReset } from './NavigatorUtils';
import { ROUTES } from '../constants/NavigationRoutes';

/**
 * Deep link handler for incoming URLs
 */
export const handleDeepLink = (url: string): void => {
  try {
    const route = parseDeepLinkURL(url);

    if (route) {
      const { screen, params } = route;
      navigateWithParam(screen, params);
    }
  } catch (error) {
    console.error('Deep link handling failed:', error);
  }
};

/**
 * Parse deep link URL to extract route and parameters
 */
const parseDeepLinkURL = (url: string) => {
  const urlParts = url.split('/');

  // Parse different URL patterns
  if (url.includes('/details/')) {
    const id = urlParts[urlParts.length - 1];
    return {
      screen: ROUTES.Details,
      params: { id }
    };
  }

  if (url.includes('/profile/')) {
    const userId = urlParts[urlParts.length - 1];
    return {
      screen: ROUTES.Profile,
      params: { userId }
    };
  }

  // Add more URL patterns as needed

  return null;
};

/**
 * Generate deep link URL for sharing
 */
export const generateDeepLink = (screen: string, params?: any): string => {
  const baseURL = 'https://test.page.link';

  switch (screen) {
    case ROUTES.Details:
      return `${baseURL}/details/${params.id}`;
    case ROUTES.Profile:
      return `${baseURL}/profile/${params.userId}`;
    default:
      return baseURL;
  }
};

/**
 * Open external URL
 */
export const openExternalURL = async (url: string): Promise<void> => {
  try {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.warn(`Cannot open URL: ${url}`);
    }
  } catch (error) {
    console.error('Failed to open URL:', error);
  }
};
```

## Navigation State Management

### MANDATORY Navigation State Handling

```typescript
// hooks/useNavigationState.ts - Navigation state hook
import { useCallback } from 'react';
import { useNavigation, useNavigationState } from '@react-navigation/native';

export const useNavigationHelper = () => {
  const navigation = useNavigation();

  // REQUIRED: Get current route information
  const getCurrentRoute = useNavigationState((state) => {
    const route = state?.routes[state.index];
    return route;
  });

  // REQUIRED: Check if can go back
  const canGoBack = useNavigationState((state) => {
    return state?.index > 0;
  });

  // REQUIRED: Get navigation history
  const getNavigationHistory = useNavigationState((state) => {
    return state?.routes || [];
  });

  // REQUIRED: Safe navigation with validation
  const safeNavigate = useCallback(
    (route: string, params?: any) => {
      if (navigation.isFocused()) {
        navigateWithParam(route, params);
      }
    },
    [navigation]
  );

  return {
    getCurrentRoute,
    canGoBack,
    getNavigationHistory,
    safeNavigate
  };
};
```

### MANDATORY Screen Transition Handling

```typescript
// Screen with transition effects
const ScreenWithTransitions: React.FC = () => {
  const navigation = useNavigation();

  // REQUIRED: Configure screen options for transitions
  useLayoutEffect(() => {
    navigation.setOptions({
      // Custom transition animations
      cardStyleInterpolator: ({ current, layouts }) => {
        return {
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
            ],
          },
        };
      },

      // Header transition
      headerStyleInterpolator: ({ current }) => {
        return {
          leftLabelStyle: {
            opacity: current.progress,
          },
        };
      },
    });
  }, [navigation]);

  return <View>{/* Screen content */}</View>;
};
```

## Navigation Security & Validation

### MANDATORY Route Protection

```typescript
// components/ProtectedRoute.tsx - Route protection wrapper
import React from 'react';
import { useAppSelector } from '../../redux';
import { navigateWithReset } from '../../utils';
import { ROUTES } from '../../constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requiredRole,
}) => {
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  // Check authentication
  if (requireAuth && !isAuthenticated) {
    navigateWithReset('AuthStack', ROUTES.SignIn);
    return null;
  }

  // Check role permissions
  if (requiredRole && user?.role !== requiredRole) {
    navigateWithParam(ROUTES.Home);
    return null;
  }

  return <>{children}</>;
};

// Usage in navigation
const ProtectedScreen = () => (
  <ProtectedRoute requireAuth requiredRole="admin">
    <AdminScreen />
  </ProtectedRoute>
);
```

### MANDATORY Navigation Validation

```typescript
// utils/NavigationValidation.ts - Navigation validation
import { ROUTES } from '../constants';
import type { RootStackParamList } from '../navigation';

/**
 * Validate navigation parameters
 */
export const validateNavigationParams = <T extends keyof RootStackParamList>(
  route: T,
  params: RootStackParamList[T]
): boolean => {
  switch (route) {
    case ROUTES.Details:
      return !!(params as any)?.id;
    case ROUTES.Profile:
      return !!(params as any)?.userId;
    default:
      return true;
  }
};

/**
 * Safe navigation with parameter validation
 */
export const safeNavigateWithParam = <T extends keyof RootStackParamList>(
  route: T,
  params?: RootStackParamList[T]
): boolean => {
  if (validateNavigationParams(route, params)) {
    navigateWithParam(route, params);
    return true;
  } else {
    console.warn(`Invalid parameters for route: ${route}`);
    return false;
  }
};
```

## Enforcement Rules

1. **⚠️ MANDATORY**: Use ROUTES enum for all navigation
2. **REQUIRED**: Type all route parameters with RootStackParamList
3. **MANDATORY**: Use NavigatorUtils functions for navigation
4. **REQUIRED**: Implement proper deep linking support
5. **MANDATORY**: Validate navigation parameters
6. **REQUIRED**: Protect sensitive routes with authentication
7. **MANDATORY**: Handle navigation state properly
8. **REQUIRED**: Optimize performance with lazy loading
9. **MANDATORY**: Use proper screen transition handling
10. **REQUIRED**: Implement error handling for navigation failures

## Examples

### ✅ CORRECT Navigation Implementation

```typescript
import { navigateWithParam, navigateBack } from '../../utils';
import { ROUTES } from '../../constants';

const MyComponent = () => {
  const handleNavigate = useCallback(() => {
    navigateWithParam(ROUTES.Details, { id: '123', title: 'Sample' });
  }, []);

  return (
    <Button title="Navigate" onPress={handleNavigate} />
  );
};
```

### ❌ INCORRECT Implementation (FORBIDDEN)

```typescript
// ❌ This violates navigation guidelines
const MyComponent = () => {
  const navigation = useNavigation();

  const handleNavigate = () => {
    navigation.navigate('Details', { id: '123' }); // ❌ No route constants
  };

  return <Button title="Navigate" onPress={handleNavigate} />;
};
```

**🚨 CRITICAL**: Navigation compliance ensures type safety, deep linking support, and consistent navigation behavior across the app.
