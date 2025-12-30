# Code Review Guidelines - test React Native

## 🔍 **Code Review Process Overview**

**⚠️ CRITICAL RULE**: ALL code must pass comprehensive review checklist before merge. No exceptions allowed for architectural compliance, performance, and security standards.

---

## Pre-Review Requirements

### MANDATORY Pre-Review Checklist

Before submitting code for review, ensure ALL of the following requirements are met:

- [ ] **Tests Pass**: All automated tests are green
- [ ] **Linting Clean**: ESLint passes without errors or warnings
- [ ] **Type Checking**: TypeScript compilation is successful with no errors
- [ ] **Build Success**: Both iOS and Android builds complete without errors
- [ ] **Code Coverage**: Maintain or improve test coverage percentage
- [ ] **SonarCloud Rules**: All SonarCloud linting rules are followed
- [ ] **Spell Check**: CSpell passes without spelling errors
- [ ] **Architecture Compliance**: Code follows established patterns from guidelines

---

## Core Architecture Review

### 1. MANDATORY Component Architecture Compliance

#### Component Structure Validation

**✅ REQUIRED PATTERNS:**

```typescript
// ✅ Good - Follow 4-file architecture pattern
components/
├── button/
│   ├── Button.tsx           # Component implementation
│   ├── ButtonStyles.ts      # Themed styles function
│   ├── ButtonTypes.ts       # TypeScript interfaces
│   └── index.ts             # Barrel export

// ✅ Good - Proper component structure
const Button: React.FC<ButtonProps> = (props) => {
  const {
    title = ButtonDefaultProps.title!,
    variant = ButtonDefaultProps.variant!,
    disabled = ButtonDefaultProps.disabled!,
    onPress,
    customStyle,
    testID = ButtonDefaultProps.testID!
  } = props;

  const { styles, theme } = useTheme(styleSheet);

  const handlePress = useCallback(() => {
    if (!disabled && onPress) {
      onPress();
    }
  }, [disabled, onPress]);

  return (
    <Pressable
      style={[styles.container, styles[variant], customStyle]}
      onPress={handlePress}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};
```

**❌ FORBIDDEN PATTERNS:**

```typescript
// ❌ Bad - Missing 4-file structure
Button.tsx // Only single file
Button.js  // Wrong file extension

// ❌ Bad - Wrong component structure
const Button = ({ title, onPress }: any) => { // Missing FC type, using any
  return (
    <div onClick={onPress}> {/* Web element in React Native */}
      {title}
    </div>
  );
};

// ❌ Bad - Missing theme integration
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#007AFF' // Hardcoded colors
  }
});
```

### 2. MANDATORY Module Architecture Compliance

#### Screen/Module Structure Validation

**✅ REQUIRED PATTERNS:**

```typescript
// ✅ Good - Feature module structure
modules/
└── auth/
    ├── AuthScreen.tsx           # Main screen
    ├── AuthStyles.ts            # Screen styles
    ├── AuthTypes.ts             # Screen types
    ├── useAuth.ts               # Custom hook
    ├── index.ts                 # Barrel export
    └── sub-components/          # Feature-specific components
        ├── LoginForm.tsx
        ├── LoginFormStyles.ts
        ├── LoginFormTypes.ts
        └── index.ts

// ✅ Good - Screen implementation
const AuthScreen: React.FC = () => {
  const navigation = useNavigation();
  const { styles, theme } = useTheme(styleSheet);

  const {
    formik,
    loading,
    error,
    handleSubmit
  } = useAuth();

  useEffect(() => {
    // Initialization logic
  }, []);

  return (
    <View style={styles.screen}>
      <CustomHeader title={Strings.Auth.screenTitle} />
      <ScrollView style={styles.scrollView}>
        {/* Screen content */}
      </ScrollView>
    </View>
  );
};
```

**❌ FORBIDDEN PATTERNS:**

```typescript
// ❌ Bad - Missing custom hook
const AuthScreen = () => {
  const [email, setEmail] = useState(''); // Direct state in screen
  const [loading, setLoading] = useState(false);
  // Business logic directly in screen component
};

// ❌ Bad - Missing proper structure
const AuthScreen = () => {
  return <div>Login</div>; // Web element
};
```

### 3. MANDATORY Redux Architecture Compliance

#### Redux Structure Validation

**✅ REQUIRED PATTERNS:**

```typescript
// ✅ Good - Redux slice structure
redux/
└── auth/
    ├── AuthInitial.ts           # Initial state
    ├── AuthSlice.ts             # Slice with actions
    ├── AuthSelectors.ts         # Selectors
    └── index.ts                 # Barrel export

// ✅ Good - Proper async thunk usage
export const loginUser = createAsyncThunkWithCancelToken<UserResponse>(
  ToolkitAction.login,
  'POST',
  APIConst.login,
  UserResponse,
  unauthorizedAPI
);

// ✅ Good - Proper selectors
const AuthSelectors = {
  getAuth: (state: RootStateType): AuthState => state.auth,
  getUser: (state: RootStateType): User | null => state.auth.user,
  getLoading: (state: RootStateType): boolean => state.auth.loading
};
```

**❌ FORBIDDEN PATTERNS:**

```typescript
// ❌ Bad - Direct API calls in components
const handleLogin = async () => {
  const response = await fetch('/api/login'); // Direct API call
};

// ❌ Bad - Missing proper slice structure
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null }, // Inline initial state
  reducers: {} // Missing proper structure
});
```

---

## Code Quality Standards

### 1. MANDATORY SonarLint Rules Compliance

#### SonarLint Requirements

**✅ REQUIRED PATTERNS:**

```typescript
// ✅ Good - Proper null checks
const getUserName = (user?: User): string => {
  if (!user || !user.name) {
    return 'Unknown User';
  }
  return user.name;
};

// ✅ Good - Avoid duplicate code
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateUserEmail = (user: User): boolean => {
  return validateEmail(user.email); // Reuse validation logic
};

// ✅ Good - Proper error handling
const fetchUserData = async (userId: string): Promise<User | null> => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch user data:', error);
    return null;
  }
};

// ✅ Good - Use const for constants
const MAX_RETRY_ATTEMPTS = 3;
const API_TIMEOUT = 5000;

// ✅ Good - Proper function complexity (avoid nested conditions)
const processUserStatus = (user: User): UserStatus => {
  if (!user.isActive) {
    return UserStatus.INACTIVE;
  }

  if (user.isPremium) {
    return UserStatus.PREMIUM_ACTIVE;
  }

  return UserStatus.ACTIVE;
};
```

**❌ REJECT PATTERNS:**

```typescript
// ❌ REJECT - Missing null checks (SonarLint: Potential NullPointerException)
const getUserName = (user: User): string => {
  return user.name; // What if user is null/undefined?
};

// ❌ REJECT - Duplicate code blocks
const validateUserEmail = (user: User): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(user.email);
};

const validateAdminEmail = (admin: Admin): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Duplicate regex
  return emailRegex.test(admin.email);
};

// ❌ REJECT - Ignoring promise rejections
fetchUserData(userId); // Missing await or catch

// ❌ REJECT - Magic numbers
setTimeout(callback, 5000); // Use named constant

// ❌ REJECT - Overly complex functions
const complexFunction = (user: User): string => {
  if (user.isActive) {
    if (user.isPremium) {
      if (user.hasSubscription) {
        if (user.subscriptionExpiry > Date.now()) {
          return 'premium-active';
        } else {
          return 'premium-expired';
        }
      } else {
        return 'premium-no-subscription';
      }
    } else {
      return 'basic-active';
    }
  } else {
    return 'inactive';
  }
};
```

### 2. MANDATORY TypeScript Types Rules

#### Type Definition Standards

**✅ REQUIRED PATTERNS:**

```typescript
// ✅ Good - Simple interface definitions in types/UserResponse.ts
export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  profileImage?: string;
}

// ✅ Good - Nested interface definitions
export interface UserProfile {
  user: UserResponse;
  preferences: UserPreferences;
  permissions: UserPermissions[];
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: string;
}

export interface UserPermissions {
  module: string;
  actions: string[];
}

// ✅ Good - Enum definitions
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

// ✅ Good - Union types for variants
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type InputSize = 'small' | 'medium' | 'large';

// ✅ Good - Generic interfaces
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

// ✅ Good - Utility types
export type PartialUser = Partial<UserResponse>;
export type RequiredUserFields = Pick<UserResponse, 'id' | 'email' | 'firstName'>;
export type UserUpdate = Omit<UserResponse, 'id' | 'createdAt' | 'updatedAt'>;
```

**❌ REJECT PATTERNS:**

```typescript
// ❌ REJECT - Using classes for simple data structures
export class UserResponse {
  // Should be interface
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string
  ) {}
}

// ❌ REJECT - Using any type
export interface UserResponse {
  id: string;
  data: any; // Never use any
  metadata: any; // Never use any
}

// ❌ REJECT - Missing optional modifiers
export interface UserResponse {
  id: string;
  firstName: string;
  phoneNumber: string; // Should be optional with ?
}

// ❌ REJECT - Inconsistent naming
export interface user_response {
  // Should be PascalCase
  user_id: string; // Should be camelCase
  First_Name: string; // Should be camelCase
}

// ❌ REJECT - Mixed concerns in single interface
export interface UserResponse {
  // User data
  id: string;
  name: string;

  // API metadata (should be separate)
  statusCode: number;
  headers: Record<string, string>;

  // UI state (should be separate)
  isLoading: boolean;
  error: string;
}
```

### 3. MANDATORY Utils Rules

#### Utility Function Standards

**✅ REQUIRED PATTERNS:**

```typescript
// ✅ Good - Pure utility functions in utils/ValidationUtils.ts
export const ValidationUtils = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  },

  isValidPhoneNumber: (phone: string): boolean => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  },

  isValidPassword: (password: string): boolean => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password)
    );
  }
};

// ✅ Good - Date utilities in utils/DateUtils.ts
export const DateUtils = {
  formatDate: (date: string | Date, format: string = 'YYYY-MM-DD'): string => {
    return dayjs(date).format(format);
  },

  isDateInPast: (date: string | Date): boolean => {
    return dayjs(date).isBefore(dayjs(), 'day');
  },

  addDaysToDate: (date: string | Date, days: number): string => {
    return dayjs(date).add(days, 'day').toISOString();
  },

  getDateDifference: (startDate: string | Date, endDate: string | Date): number => {
    return dayjs(endDate).diff(dayjs(startDate), 'day');
  }
};

// ✅ Good - String utilities in utils/StringUtils.ts
export const StringUtils = {
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  truncateText: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength).trim()}...`;
  },

  removeSpaces: (str: string): string => {
    return str.replace(/\s+/g, '');
  },

  isEmptyOrWhitespace: (str?: string): boolean => {
    return !str || str.trim().length === 0;
  }
};

// ✅ Good - Array utilities in utils/ArrayUtils.ts
export const ArrayUtils = {
  groupBy: <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
    return array.reduce(
      (groups, item) => {
        const groupKey = String(item[key]);
        (groups[groupKey] = groups[groupKey] || []).push(item);
        return groups;
      },
      {} as Record<string, T[]>
    );
  },

  uniqueBy: <T, K extends keyof T>(array: T[], key: K): T[] => {
    const seen = new Set();
    return array.filter((item) => {
      const keyValue = item[key];
      if (seen.has(keyValue)) {
        return false;
      }
      seen.add(keyValue);
      return true;
    });
  },

  sortBy: <T, K extends keyof T>(array: T[], key: K, order: 'asc' | 'desc' = 'asc'): T[] => {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (order === 'desc') {
        return aVal < bVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
  }
};
```

**❌ REJECT PATTERNS:**

```typescript
// ❌ REJECT - Stateful utilities (should be hooks or services)
export const UserUtils = {
  currentUser: null, // Utilities should be stateless

  setCurrentUser: (user: User) => {
    // Side effects in utils
    UserUtils.currentUser = user;
  },

  getCurrentUser: () => UserUtils.currentUser
};

// ❌ REJECT - API calls in utilities (should be in services)
export const DataUtils = {
  fetchUserData: async (id: string) => {
    // API calls don't belong in utils
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  }
};

// ❌ REJECT - Complex business logic (should be in hooks/services)
export const BusinessUtils = {
  calculateUserPermissions: (user: User, roles: Role[]) => {
    // Complex business logic should not be in utils
    // This should be in a service or custom hook
  }
};

// ❌ REJECT - Mixing utility types
export const MixedUtils = {
  // String operations
  formatString: (str: string) => str.toUpperCase(),

  // Date operations
  formatDate: (date: Date) => date.toISOString(),

  // Array operations
  sortArray: (arr: any[]) => arr.sort()

  // Should be separated into focused utility files
};

// ❌ REJECT - Mutable operations
export const BadArrayUtils = {
  addItem: <T>(array: T[], item: T): T[] => {
    array.push(item); // Mutating input array
    return array;
  }
};
```

### 4. MANDATORY API Calling Rules

#### API Integration Standards

**✅ REQUIRED PATTERNS:**

```typescript
// ✅ Good - Redux async thunk usage
import { createAsyncThunkWithCancelToken } from '../configs/APIConfig';

export const fetchUserProfile = createAsyncThunkWithCancelToken<UserResponse>(
  'user/fetchProfile',
  'GET',
  APIConst.USER_PROFILE,
  UserResponse,
  authorizedAPI
);

export const updateUserProfile = createAsyncThunkWithCancelToken<
  UserResponse,
  Partial<UserResponse>
>('user/updateProfile', 'PUT', APIConst.USER_PROFILE, UserResponse, authorizedAPI);

// ✅ Good - Custom hook for API calls
const useUserProfile = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector(UserSelectors.getProfile);

  const fetchProfile = useCallback(async () => {
    try {
      await dispatch(UserActions.fetchUserProfile()).unwrap();
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  }, [dispatch]);

  const updateProfile = useCallback(
    async (updates: Partial<UserResponse>) => {
      try {
        await dispatch(UserActions.updateUserProfile(updates)).unwrap();
        showSuccessToast('Profile updated successfully');
      } catch (error) {
        showErrorToast('Failed to update profile');
      }
    },
    [dispatch]
  );

  return {
    user,
    loading,
    error,
    fetchProfile,
    updateProfile
  };
};
```

**❌ REJECT PATTERNS:**

```typescript
// ❌ REJECT - Direct API calls in components
const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Direct API call in component
    fetch('/api/user/profile')
      .then((response) => response.json())
      .then(setUser);
  }, []);

  const handleUpdate = async () => {
    // Direct API call in component
    await fetch('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  };
};

// ❌ REJECT - Missing error handling
export const UserService = {
  getProfile: async (): Promise<UserResponse> => {
    const response = await authorizedAPI.get(APIConst.USER_PROFILE);
    return response.data; // No error handling
  }
};

// ❌ REJECT - Inconsistent API patterns
export const UserService = {
  login: async (credentials: LoginRequest) => {
    // Missing return type
    return fetch('/api/login', {
      // Using fetch instead of configured axios
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  getProfile: () => {
    // Missing async
    return authorizedAPI.get('/user/profile'); // Different pattern
  }
};

// ❌ REJECT - Mixed responsibilities
export const UserService = {
  getProfile: async (): Promise<UserResponse> => {
    const response = await authorizedAPI.get(APIConst.USER_PROFILE);

    // Business logic should not be in service layer
    const processedUser = {
      ...response.data,
      displayName: `${response.data.firstName} ${response.data.lastName}`,
      isAdmin: response.data.role === 'admin'
    };

    return processedUser;
  }
};
```

### 5. MANDATORY Static Data Rules

#### Static Data Standards

**✅ REQUIRED PATTERNS:**

```typescript
// ✅ Good - Constants in constants/AppConst.ts
export const AppConst = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGE_WIDTH: 1920,
  MAX_IMAGE_HEIGHT: 1080,
  DEFAULT_PAGE_SIZE: 20,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes

  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
} as const;

// ✅ Good - API constants in constants/APIConst.ts
export const APIConst = {
  // Auth endpoints
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',

  // User endpoints
  USER_PROFILE: '/user/profile',
  USER_UPDATE: '/user/update',
  USER_DELETE: '/user/delete',

  // Common parameters
  DEFAULT_TIMEOUT: 10000,
  MAX_RETRIES: 3
} as const;

// ✅ Good - Enums for static options
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
  GUEST = 'guest'
}

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

// ✅ Good - Configuration objects
export const ThemeConfig = {
  LIGHT: {
    name: 'light',
    primary: '#007AFF',
    background: '#FFFFFF',
    text: '#000000'
  },
  DARK: {
    name: 'dark',
    primary: '#0A84FF',
    background: '#1C1C1E',
    text: '#FFFFFF'
  }
} as const;

// ✅ Good - Static arrays for dropdowns/pickers
export const CountryOptions = [
  { label: 'United States', value: 'US', code: '+1' },
  { label: 'Canada', value: 'CA', code: '+1' },
  { label: 'United Kingdom', value: 'GB', code: '+44' },
  { label: 'Australia', value: 'AU', code: '+61' }
] as const;

// ✅ Good - Form validation schemas as static data
export const ValidationMessages = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
  PASSWORDS_DONT_MATCH: 'Passwords do not match'
} as const;
```

**❌ REJECT PATTERNS:**

```typescript
// ❌ REJECT - Mutable static data
export let AppConfig = { // Should be const
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

AppConfig.apiUrl = 'https://new-api.example.com'; // Allowing mutations

// ❌ REJECT - Magic numbers/strings scattered in code
const handleSubmit = () => {
  if (password.length < 8) { // Magic number, should be constant
    setError('Password too short');
  }

  setTimeout(() => {
    setLoading(false);
  }, 3000); // Magic number, should be constant
};

// ❌ REJECT - Hardcoded arrays in components
const CountryPicker = () => {
  // Hardcoded data should be in constants
  const countries = [
    'United States',
    'Canada',
    'United Kingdom'
  ];

  return (
    <Picker>
      {countries.map(country => (
        <Picker.Item key={country} label={country} value={country} />
      ))}
    </Picker>
  );
};

// ❌ REJECT - Mixed data types in constants
export const MixedConstants = {
  API_URL: 'https://api.example.com', // String
  TIMEOUT: 5000, // Number
  CONFIG: { // Object
    retries: 3,
    cache: true
  },
  USERS: [ // Array (should be separate)
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
  ],
  getCurrentTime: () => new Date() // Function (doesn't belong in constants)
};

// ❌ REJECT - Missing type safety
export const ApiEndpoints = {
  LOGIN: '/auth/login',
  USERS: '/users'
}; // Missing 'as const' - values can be mutated

// ❌ REJECT - Environment-specific data hardcoded
export const Config = {
  API_URL: 'https://prod-api.example.com', // Should use env variables
  DEBUG: false // Should use env variables
};
```

### 6. MANDATORY I18n String Management Rules

#### I18n Internationalization Standards

**✅ REQUIRED PATTERNS:**

```typescript
// ✅ Good - Namespaced translations in app/translations/en.json
{
  "common": {
    "ok": "OK",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "retry": "Retry",
    "close": "Close"
  },

  "auth": {
    "signIn": "Sign In",
    "signUp": "Sign Up",
    "signOut": "Sign Out",
    "forgotPassword": "Forgot Password?",
    "resetPassword": "Reset Password",
    "hintEmail": "Enter your email",
    "hintPassword": "Enter your password",
    "confirmPasswordPlaceholder": "Confirm your password",

    // Error messages
    "invalidCredentials": "Invalid email or password",
    "emailRequired": "Email is required",
    "passwordRequired": "Password is required",
    "passwordTooShort": "Password must be at least 8 characters",
    "emailInvalid": "Please enter a valid email address"
  },

  "profile": {
    "title": "Profile",
    "editProfile": "Edit Profile",
    "personalInfo": "Personal Information",
    "firstName": "First Name",
    "lastName": "Last Name",
    "email": "Email",
    "phoneNumber": "Phone Number",

    // Success messages
    "updateSuccess": "Profile updated successfully",

    // Error messages
    "updateFailed": "Failed to update profile",
    "firstNameRequired": "First name is required",
    "lastNameRequired": "Last name is required"
  },

  "apiError": {
    "connectionError": "Connection error. Please check your internet connection.",
    "serverError": "Server error. Please try again later.",
    "timeoutError": "Request timeout. Please try again.",
    "unknownError": "An unexpected error occurred. Please try again."
  }
}

// ✅ Good - Centralized strings wrapper in constants/Strings.ts using I18n.t()
import { I18n } from '../translations';

const Common = freezeStringsObject({
  ok: I18n.t('common:ok'),
  cancel: I18n.t('common:cancel'),
  save: I18n.t('common:save'),
  delete: I18n.t('common:delete'),
  edit: I18n.t('common:edit'),
  loading: I18n.t('common:loading'),
  error: I18n.t('common:error'),
  success: I18n.t('common:success'),
  retry: I18n.t('common:retry'),
  close: I18n.t('common:close')
});

const Auth = freezeStringsObject({
  signIn: I18n.t('auth:signIn'),
  signUp: I18n.t('auth:signUp'),
  signOut: I18n.t('auth:signOut'),
  forgotPassword: I18n.t('auth:forgotPassword'),
  resetPassword: I18n.t('auth:resetPassword'),
  hintEmail: I18n.t('auth:hintEmail'),
  hintPassword: I18n.t('auth:hintPassword'),

  // Error messages
  invalidCredentials: I18n.t('auth:invalidCredentials'),
  emailRequired: I18n.t('yupError:emailRequire'),
  passwordRequired: I18n.t('yupError:passwordRequire'),
  passwordTooShort: I18n.t('yupError:passwordLength'),
  emailInvalid: I18n.t('yupError:emailInvalid')
});

export const Strings = freezeStringsObject({
  Common,
  Auth,
  Profile,
  ApiError
});

// ✅ Good - Usage in components
import { Strings } from '../constants';

const LoginScreen = () => {
  return (
    <View>
      <Text>{Strings.Auth.signIn}</Text>
      <TextInput placeholder={Strings.Auth.hintEmail} />
      <TextInput placeholder={Strings.Auth.hintPassword} />
      <Button title={Strings.Auth.signIn} />
    </View>
  );
};

// ✅ Good - Dynamic strings with parameters using I18n.t() with interpolation
const Home = freezeStringsObject({
  goodMorningName: (firstName: string) => I18n.t('home:goodMorningName', { firstName }),
  goodAfterNoonName: (firstName: string) => I18n.t('home:goodAfterNoonName', { firstName }),
  healthcareSpendingAccountUnlocked: (amount: string, hour: string) =>
    I18n.t('home:healthcareSpendingAccountUnlocked', { amount, hour })
});

// ✅ Good - Translation JSON with interpolation
{
  "home": {
    "goodMorningName": "Good morning, {{firstName}}",
    "goodAfterNoonName": "Good afternoon, {{firstName}}",
    "healthcareSpendingAccountUnlocked": "{{amount}} healthcare spending account unlocked in {{hour}} hours"
  }
}

// ✅ Good - Validation error strings using I18n
const ValidationStrings = freezeStringsObject({
  required: (fieldName: string) => I18n.t('validation:required', { fieldName }),
  minLength: (fieldName: string, minLength: number) =>
    I18n.t('validation:minLength', { fieldName, minLength }),
  maxLength: (fieldName: string, maxLength: number) =>
    I18n.t('validation:maxLength', { fieldName, maxLength }),
  invalidFormat: (fieldName: string) => I18n.t('validation:invalidFormat', { fieldName })
});
```

**❌ REJECT PATTERNS:**

```typescript
// ❌ REJECT - Hardcoded strings in components
const LoginScreen = () => {
  return (
    <View>
      <Text>Sign In</Text> {/* Hardcoded string - should use Strings.Auth.signIn */}
      <TextInput placeholder="Enter your email" /> {/* Hardcoded string - should use Strings.Auth.hintEmail */}
      <Button title="Login" /> {/* Hardcoded string - should use Strings.Auth.signIn */}
    </View>
  );
};

// ❌ REJECT - Direct I18n.t() usage in components
const LoginScreen = () => {
  return (
    <View>
      <Text>{I18n.t('auth:signIn')}</Text> {/* Direct I18n usage - should use Strings.Auth.signIn */}
      <TextInput placeholder={I18n.t('auth:hintEmail')} /> {/* Direct usage */}
    </View>
  );
};

// ❌ REJECT - Inline error messages
const handleSubmit = () => {
  if (!email) {
    setError('Email is required'); // Hardcoded error message - should use Strings.Auth.emailRequired
    return;
  }

  if (!password) {
    setError('Password is required'); // Hardcoded error message - should use Strings.Auth.passwordRequired
    return;
  }
};

// ❌ REJECT - Mixed string management approaches
const ProfileScreen = () => {
  const SCREEN_TITLE = 'Profile'; // Local constants mixed with hardcoded strings

  return (
    <View>
      <Text>{SCREEN_TITLE}</Text>
      <Text>Personal Information</Text> {/* Hardcoded */}
      <Text>{I18n.t('profile:firstName')}</Text> {/* Direct I18n usage */}
      <Text>{Strings.Profile.lastName}</Text> {/* Correct approach - inconsistent mixing */}
    </View>
  );
};

// ❌ REJECT - Inconsistent translation JSON structure
{
  "loginButton": "Sign In", // Flat structure without namespace
  "auth": {
    "signUp": "Sign Up" // Nested structure - inconsistent with above
  },

  // Inconsistent naming conventions
  "btn_save": "Save", // Snake case
  "deleteButton": "Delete", // Camel case
  "Reset Password": "Reset Password" // Spaces in key - should be camelCase
}

// ❌ REJECT - Missing I18n.t() wrapper in Strings.ts
export const Strings = {
  Auth: {
    signIn: 'Sign In', // Direct string - should use I18n.t('auth:signIn')
    signUp: 'Sign Up'  // Direct string - should use I18n.t('auth:signUp')
  }
};

// ❌ REJECT - Mutable string constants
export let Messages = { // Should be const with freezeStringsObject
  success: 'Success'
};

Messages.success = 'Operation Successful'; // Allowing mutations

// ❌ REJECT - Missing namespace in translation keys
const Auth = freezeStringsObject({
  signIn: I18n.t('signIn'), // Missing namespace - should be 'auth:signIn'
  signUp: I18n.t('signUp')   // Missing namespace - should be 'auth:signUp'
});

// ❌ REJECT - Complex logic in string constants
export const Strings = {
  currentTime: new Date().toLocaleString(), // Dynamic value - should be in utilities
  randomId: Math.random().toString(), // Dynamic value - should be in utilities

  // Complex functions in constants (should be utilities)
  formatComplexMessage: (user: User, data: any) => {
    // Complex logic doesn't belong in string constants
    return `Welcome ${user.name}, you have ${data.count} items`;
  }
};

// ❌ REJECT - Missing freezeStringsObject wrapper
const Auth = { // Should use freezeStringsObject()
  signIn: I18n.t('auth:signIn'),
  signUp: I18n.t('auth:signUp')
};
```

### 7. MANDATORY Import Organization Rules

#### Import Structure Standards

**✅ REQUIRED PATTERNS:**

```typescript
// ✅ Good - Proper import organization with clear sections
// 1. React and React Native core imports (always first)
import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';

// 2. Third-party library imports (alphabetical order)
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';

// 3. Project hooks (closest to React ecosystem)
import { useTheme, usePermission, useKeyboard, useDebounce } from '../../hooks';

// 4. Project constants (core app configuration)
import { Strings, ROUTES, APIConst, AppConst } from '../../constants';

// 5. Project utilities (helper functions)
import { ValidationUtils, DateUtils, StringUtils, NavigatorUtils } from '../../utils';

// 6. Project services (external integrations)
import { APIService, Storage, AnalyticsService } from '../../services';

// 7. Redux imports (state management)
import {
  useAppSelector,
  useAppDispatch,
  AuthActions,
  AuthSelectors,
  ProfileActions,
  ProfileSelectors
} from '../../redux';

// 8. Component imports (UI elements - local first, then shared)
import SubComponent from './sub-components/SubComponent';
import FormField from './sub-components/FormField';
import { CustomButton, CustomHeader, LoadingSpinner, ErrorBoundary } from '../../components';

// 9. Type imports (always last, grouped together)
import type { LoginScreenProps, LoginFormValues, LoginScreenRouteParams } from './LoginTypes';
import type { UserResponse, AuthResponse, ApiError } from '../../types';
import type { RootState, AppDispatch } from '../../redux/types';

// ✅ Good - Nested imports for large modules
import {
  // Core Redux Toolkit
  createSlice,
  createAsyncThunk,
  type PayloadAction,
  type ActionReducerMapBuilder,

  // RTK Query (if used)
  createApi,
  fetchBaseQuery
} from '@reduxjs/toolkit';

// ✅ Good - Grouped related imports
import {
  // Form components
  TextInput as FormTextInput,
  Dropdown as FormDropdown,
  DatePicker as FormDatePicker,

  // Layout components
  Container,
  Section,
  Divider,

  // Interactive components
  Button,
  IconButton,
  Switch
} from '../../components';
```

**❌ REJECT PATTERNS:**

```typescript
// ❌ REJECT - Random import order
import { CustomButton } from '../../components'; // Components before React
import React from 'react'; // React should be first
import { APIService } from '../../services'; // Services before hooks
import { useTheme } from '../../hooks';
import { View, Text } from 'react-native'; // RN should be with React

// ❌ REJECT - Missing section separation
import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks';
import { Strings } from '../../constants';
import { CustomButton } from '../../components';
import type { LoginProps } from './LoginTypes';
// All imports mixed together without logical grouping

// ❌ REJECT - Inconsistent import styles
import React from 'react'; // Default import
import * as RN from 'react-native'; // Namespace import
import { View, Text } from 'react-native'; // Named imports - inconsistent with above
import Button from '../../components/Button'; // Default import
import { CustomHeader } from '../../components'; // Named import from same source

// ❌ REJECT - Overly long single-line imports
import {
  useCallback,
  useMemo,
  useEffect,
  useState,
  useRef,
  useContext,
  useReducer,
  createContext,
  forwardRef,
  memo
} from 'react';

// ❌ REJECT - Mixed default and named imports from same source
import { useTheme } from '../../hooks';
import usePermission from '../../hooks/usePermission'; // Should be in same import

// ❌ REJECT - Relative path inconsistency
import { CustomButton } from '../../components/atoms/Button';
import CustomHeader from '../../../app/components/molecules/Header'; // Different path style
import { Strings } from '../../constants';
import { ValidationUtils } from '../../../app/utils/ValidationUtils'; // Different path style

// ❌ REJECT - Missing type-only imports
import { UserResponse, ApiError } from '../../types'; // Should be "import type"
import React, { Component } from 'react'; // Component not used as type

// ❌ REJECT - Unused imports
import {
  View,
  Text,
  ScrollView, // Not used in component
  Image, // Not used in component
  TouchableOpacity // Not used in component
} from 'react-native';

// ❌ REJECT - Deep nested imports without organization
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  ActionReducerMapBuilder,
  createEntityAdapter,
  EntityState,
  createSelector,
  createDraftSafeSelector,
  isRejectedWithValue,
  isPending,
  isFulfilled,
  isRejected
} from '@reduxjs/toolkit'; // Should be grouped by functionality
```

### 8. MANDATORY TypeScript Compliance

#### Type Safety Requirements

**✅ REQUIRED PATTERNS:**

```typescript
// ✅ Good - Comprehensive interfaces
interface UserProfileProps {
  user: UserProfile;
  onEdit: (user: UserProfile) => void;
  isEditing: boolean;
  customStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

// ✅ Good - Proper type guards
const isValidUser = (user: any): user is UserProfile => {
  return user && typeof user.id === 'string' && typeof user.name === 'string';
};

// ✅ Good - Environment variable typing
declare module 'react-native-config' {
  export interface NativeConfig {
    API_BASE_URL: string;
    ENVIRONMENT: 'development' | 'staging' | 'production';
    FIREBASE_API_KEY: string;
  }
}
```

**❌ FORBIDDEN PATTERNS:**

```typescript
// ❌ Bad - Using any type
const handleData = (data: any) => { // Never use any
  return data.someProperty;
};

// ❌ Bad - Missing type definitions
const Component = (props) => { // Missing props type
  return <View />;
};

// ❌ Bad - Incomplete interfaces
interface Props {
  data; // Missing type definition
}
```

### 9. MANDATORY Performance Optimization

#### Performance Requirements

**✅ REQUIRED PATTERNS:**

```typescript
// ✅ Good - Proper memoization
const ExpensiveComponent = React.memo<ComponentProps>(({ items, onSelect }) => {
  const expensiveValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.value, 0);
  }, [items]);

  const handleSelect = useCallback((id: string) => {
    onSelect(id);
  }, [onSelect]);

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ListItem item={item} onPress={() => handleSelect(item.id)} />
      )}
      getItemLayout={(data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index
      })}
    />
  );
});

// ✅ Good - Proper cleanup
useEffect(() => {
  const abortController = new AbortController();

  const fetchData = async () => {
    try {
      const response = await api.get('/data', {
        signal: abortController.signal
      });
      setData(response.data);
    } catch (error) {
      if (!abortController.signal.aborted) {
        setError(error);
      }
    }
  };

  fetchData();

  return () => {
    abortController.abort();
  };
}, []);
```

**❌ FORBIDDEN PATTERNS:**

```typescript
// ❌ Bad - Missing optimization
const Component = ({ items, onPress }) => {
  return (
    <FlatList
      data={items}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onPress(item)}> {/* New function each render */}
          <Text>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

// ❌ Bad - Missing cleanup
useEffect(() => {
  const interval = setInterval(fetchData, 1000);
  // Missing cleanup return function
}, []);
```

### 10. MANDATORY Theme & Styling Compliance

#### Theme Integration Requirements

**✅ REQUIRED PATTERNS:**

```typescript
// ✅ Good - Proper theme usage
const { styles, theme, isDark } = useTheme(styleSheet);

const styleSheet = (theme: ThemeMode, isDark?: boolean) =>
  StyleSheet.create({
    ...ApplicationStyles(theme), // Inherit common styles

    container: {
      backgroundColor: Colors[theme]?.white,
      borderRadius: scale(12),
      padding: scale(16),

      // Platform-specific styling
      shadowOpacity: globalMetrics.isIos ? 0.1 : 0,
      elevation: globalMetrics.isAndroid ? scale(2) : 0
    },

    text: {
      color: Colors[theme]?.black,
      fontSize: scale(16, true), // Use scaling for text
      fontWeight: '600'
    }
  });
```

**❌ FORBIDDEN PATTERNS:**

```typescript
// ❌ Bad - Hardcoded styling
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF', // Hardcoded color
    padding: 16, // Not using scale function
    fontSize: 14 // Not using text scaling
  }
});

// ❌ Bad - Missing theme integration
<View style={{ backgroundColor: 'white' }}> {/* Inline styles */}
```

---

## Security & Data Handling

### 1. MANDATORY Input Validation

#### Validation Requirements

**✅ REQUIRED PATTERNS:**

```typescript
// ✅ Good - Proper form validation
const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .max(50, 'First name is too long')
    .matches(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),

  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required')
    .max(255, 'Email is too long'),

  phone: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .required('Phone number is required')
});

// ✅ Good - Input sanitization
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
```

**❌ FORBIDDEN PATTERNS:**

```typescript
// ❌ Bad - Missing validation
const handleSubmit = (values) => {
  // Direct submission without validation
  api.post('/submit', values);
};

// ❌ Bad - Storing sensitive data insecurely
AsyncStorage.setItem('password', userPassword); // Insecure storage
```

### 2. MANDATORY Error Handling

#### Error Handling Requirements

**✅ REQUIRED PATTERNS:**

```typescript
// ✅ Good - Comprehensive error handling
const handleSubmit = async (formData: FormData) => {
  try {
    setLoading(true);
    await dispatch(submitForm(formData)).unwrap();

    showSuccessToast(Strings.Form.submitSuccess);
    navigation.goBack();
  } catch (error) {
    if (error instanceof ApiError) {
      showErrorToast(error.userFriendlyMessage);
    } else if (error instanceof NetworkError) {
      showErrorToast(Strings.Errors.networkError);
    } else {
      showErrorToast(Strings.Errors.unexpectedError);
      // Log for debugging
      console.error('Form submission error:', error);
    }
  } finally {
    setLoading(false);
  }
};

// ✅ Good - Proper API error handling
export const loginUser = createAsyncThunkWithCancelToken<UserResponse>(
  ToolkitAction.login,
  'POST',
  APIConst.login,
  UserResponse,
  unauthorizedAPI,
  {
    onError: (error, dispatch) => {
      if (error.status === 401) {
        dispatch(authActions.clearAuth());
      }
    }
  }
);
```

**❌ FORBIDDEN PATTERNS:**

```typescript
// ❌ Bad - Missing error handling
const handleSubmit = async () => {
  const result = await api.post('/submit', data); // No try-catch
  setData(result);
};

// ❌ Bad - Generic error messages
catch (error) {
  alert('Error'); // Not user-friendly
}
```

---

## Testing & Quality Assurance

### 1. MANDATORY Testing Requirements

#### Testing Standards

**✅ REQUIRED PATTERNS:**

```typescript
// ✅ Good - Comprehensive component testing
describe('Button Component', () => {
  const mockOnPress = jest.fn();

  const defaultProps: ButtonProps = {
    title: 'Test Button',
    onPress: mockOnPress
  };

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it('renders correctly with default props', () => {
    const { getByTestId } = render(<Button {...defaultProps} />);

    expect(getByTestId('button')).toBeTruthy();
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('handles press events correctly', () => {
    const { getByTestId } = render(<Button {...defaultProps} />);

    fireEvent.press(getByTestId('button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('disables interaction when disabled prop is true', () => {
    const { getByTestId } = render(
      <Button {...defaultProps} disabled={true} />
    );

    fireEvent.press(getByTestId('button'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });
});

// ✅ Good - Redux testing
describe('Auth Slice', () => {
  const store = configureStore({
    reducer: { auth: authReducer },
    middleware: getDefaultMiddleware({ serializableCheck: false })
  });

  it('handles login success correctly', () => {
    const user = { id: '1', name: 'John Doe' };

    store.dispatch(authActions.loginSuccess(user));

    const state = store.getState();
    expect(state.auth.user).toEqual(user);
    expect(state.auth.loading).toBe(false);
  });
});
```

### 2. MANDATORY Accessibility Requirements

#### Accessibility Standards

**✅ REQUIRED PATTERNS:**

```typescript
// ✅ Good - Complete accessibility implementation
<Pressable
  style={styles.button}
  onPress={handlePress}
  disabled={disabled}
  testID="login-button"
  accessible
  accessibilityRole="button"
  accessibilityLabel="Sign in to your account"
  accessibilityHint="Double tap to sign in with your credentials"
  accessibilityState={{
    disabled,
    busy: loading
  }}
>
  <Text style={styles.buttonText}>
    {loading ? 'Signing In...' : 'Sign In'}
  </Text>
</Pressable>

// ✅ Good - Form accessibility
<TextInput
  style={styles.input}
  value={email}
  onChangeText={setEmail}
  placeholder="Enter your email"
  testID="email-input"
  accessible
  accessibilityLabel="Email address"
  accessibilityHint="Enter your email address"
  accessibilityRequired
  keyboardType="email-address"
  autoCapitalize="none"
  autoComplete="email"
/>
```

**❌ FORBIDDEN PATTERNS:**

```typescript
// ❌ Bad - Missing accessibility props
<TouchableOpacity onPress={handlePress}>
  <Text>Submit</Text>
</TouchableOpacity>

// ❌ Bad - Missing testID
<View style={styles.container}>
  {/* No testID for testing */}
</View>
```

---

## Code Style & Organization

### 1. MANDATORY Import Organization

#### Import Order Requirements

**✅ REQUIRED PATTERNS:**

```typescript
// ✅ Good - Proper import organization
// 1. React and React Native imports
import React, { useCallback, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';

// 2. Third-party library imports
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';

// 3. Project hooks
import { useTheme, usePermission } from '../../hooks';

// 4. Project constants and utilities
import { Strings, ROUTES } from '../../constants';
import { NavigatorUtils, ValidationUtils } from '../../utils';

// 5. Project services
import { APIService, Storage } from '../../services';

// 6. Redux imports
import { useAppSelector, useAppDispatch, AuthActions, AuthSelectors } from '../../redux';

// 7. Component imports
import { CustomButton, CustomHeader } from '../../components';

// 8. Type imports (at the end)
import type { LoginScreenProps, LoginFormValues } from './LoginTypes';
import type { RootState } from '../../redux/types';
```

### 2. MANDATORY I18n String Usage

#### Internationalization Requirements

**✅ REQUIRED PATTERNS:**

```typescript
// ✅ Good - Using centralized I18n strings through Strings constants
import { Strings } from '../../constants';

<Text>{Strings.Auth.signIn}</Text>
<Button title={Strings.Auth.signIn} />
<TextInput placeholder={Strings.Auth.hintEmail} />

// ✅ Good - Error messages from I18n strings
showErrorToast(Strings.ApiError.networkError);
showErrorToast(Strings.Auth.emailRequired);

// ✅ Good - Dynamic strings with parameters
<Text>{Strings.Home.goodMorningName('John')}</Text>

// ✅ Good - Proper translation JSON structure
{
  "auth": {
    "signIn": "Sign In",
    "hintEmail": "Enter your email"
  },
  "home": {
    "goodMorningName": "Good morning, {{firstName}}"
  }
}
```

**❌ FORBIDDEN PATTERNS:**


```typescript
// ❌ Bad - Hardcoded strings
<Text>Welcome to test</Text>
<Button title="Sign In" />

// ❌ Bad - Direct I18n.t() usage in components
<Text>{I18n.t('auth:signIn')}</Text>
<Button title={I18n.t('auth:signIn')} />

// ❌ Bad - Hardcoded error messages
showErrorToast('Something went wrong');
showErrorToast('Email is required');

// ❌ Bad - Missing namespaces in translations
{
  "signIn": "Sign In", // Should be "auth:signIn"
  "email": "Email"     // Should be "auth:hintEmail" or "common:email"
}
```

---

## Review Checklist

### 🔍 **Architecture & Code Quality**

- [ ] Code follows established 4-file architecture pattern
- [ ] Components use proper theme integration with `useTheme(styleSheet)`
- [ ] All styling uses scaling functions (`scale()`, `scale(value, true)` for text)
- [ ] No hardcoded colors, uses `Colors[theme]` pattern
- [ ] Redux follows Initial.ts, Selectors.ts, Slice.ts structure
- [ ] All API calls use `createAsyncThunkWithCancelToken`
- [ ] Proper TypeScript interfaces with no `any` types
- [ ] Imports organized according to established 8-section order
- [ ] All strings use `Strings.Module.key` pattern from centralized constants
- [ ] Components include comprehensive JSDoc documentation

### 🔍 **SonarLint Compliance**

- [ ] No potential null pointer exceptions (proper null checks)
- [ ] No duplicate code blocks (extracted to utility functions)
- [ ] No magic numbers (all constants properly named and extracted)
- [ ] Functions have reasonable complexity (avoid deep nesting)
- [ ] Proper error handling for all async operations
- [ ] No ignored promise rejections
- [ ] All variables properly scoped and typed

### 🔍 **Type Definition Standards**

- [ ] Types defined in separate files: `types/ModuleName.ts`
- [ ] Simple interfaces only, no classes for data structures
- [ ] Consistent PascalCase naming for interfaces
- [ ] Consistent camelCase naming for properties
- [ ] Proper optional property modifiers (`?`)
- [ ] No `any` types used anywhere
- [ ] Generic interfaces where appropriate
- [ ] Utility types used correctly (Partial, Pick, Omit)
- [ ] Enums used for static option sets

### 🔍 **Utils Standards**

- [ ] Utilities are pure functions (stateless)
- [ ] Utilities grouped by functionality in separate files
- [ ] No API calls in utility functions
- [ ] No business logic in utilities (belongs in services/hooks)
- [ ] Utils return immutable results (don't mutate inputs)
- [ ] Comprehensive input validation in utilities
- [ ] Utilities are properly typed with generics where needed

### 🔍 **API Integration Standards**

- [ ] API calls only in service layer or Redux thunks
- [ ] No direct API calls in components
- [ ] Consistent use of configured axios instances
- [ ] Proper error handling in all API methods
- [ ] API responses properly typed
- [ ] Service methods have consistent signatures
- [ ] Custom hooks used for component-level API integration

### 🔍 **Static Data Standards**

- [ ] All constants use `as const` assertion
- [ ] No magic numbers/strings in code
- [ ] Constants grouped logically in separate files
- [ ] Enums used for option sets
- [ ] Configuration objects properly structured
- [ ] No mutable static data
- [ ] Environment-specific data uses env variables

### 🔍 **I18n String Management Standards**

- [ ] No hardcoded strings in components
- [ ] No direct `I18n.t()` usage in components (use `Strings` constants)
- [ ] All translations properly namespaced in `app/translations/en.json`
- [ ] All strings use `I18n.t()` wrapper in `constants/Strings.ts`
- [ ] Consistent namespace structure (`module:key` format)
- [ ] Error messages use proper I18n keys (e.g., `yupError`, `apiError`)
- [ ] Dynamic strings use I18n interpolation `{{paramName}}`
- [ ] String constants use `freezeStringsObject()` wrapper
- [ ] Translation JSON follows camelCase naming convention
- [ ] All modules have dedicated namespace sections

### 🔍 **Import Organization Standards**

- [ ] 8-section import structure followed:
  - React & React Native imports first
  - Third-party library imports (alphabetical)
  - Project hooks
  - Project constants
  - Project utilities
  - Project services
  - Redux imports
  - Component imports (local first, then shared)
  - Type imports last (with `import type`)
- [ ] No mixed import styles from same source
- [ ] Consistent relative path usage
- [ ] No unused imports
- [ ] Long import lists properly formatted (multi-line)
- [ ] Related imports grouped together
- [ ] Type-only imports use `import type`

### 🎨 **Theme & Styling**

- [ ] All styles use theme functions, no hardcoded values
- [ ] Proper responsive scaling for different screen sizes
- [ ] Platform-specific adjustments using `globalMetrics`
- [ ] Dark/light mode compatibility
- [ ] Consistent design system usage

### 📱 **React Native Specific**

- [ ] No web-specific elements (div, span, etc.)
- [ ] Proper React Native component usage
- [ ] Platform-appropriate navigation patterns
- [ ] Correct event handling for mobile

### 🔧 **Performance & Optimization**

- [ ] Proper use of `useCallback` for event handlers
- [ ] `useMemo` for expensive calculations
- [ ] `React.memo` for expensive components
- [ ] Proper cleanup in `useEffect` hooks
- [ ] FlatList optimization for large lists

### 🔒 **Security & Validation**

- [ ] Input validation using Yup schemas
- [ ] Proper error handling with user-friendly messages
- [ ] Secure storage for sensitive data (`react-native-mmkv`)
- [ ] No sensitive data in logs
- [ ] API response validation with `class-transformer`

### 🧪 **Testing & Quality**

- [ ] All tests pass with adequate coverage
- [ ] Components include `testID` props
- [ ] Comprehensive accessibility props
- [ ] ESLint and TypeScript checks pass
- [ ] SonarCloud rules compliance

### 🌐 **Accessibility & UX**

- [ ] `accessibilityRole`, `accessibilityLabel`, `accessibilityHint`
- [ ] `accessibilityState` for interactive elements
- [ ] Screen reader compatibility
- [ ] Proper focus management
- [ ] Sufficient touch target sizes

### 🔄 **State Management**

- [ ] Redux slices follow project patterns
- [ ] Proper selector usage with typed hooks
- [ ] Form state managed with Formik
- [ ] Loading and error states handled

### 📚 **Documentation & Maintenance**

- [ ] Comprehensive JSDoc comments
- [ ] Clear variable and function naming
- [ ] No duplicate code, follows DRY principle
- [ ] Code is self-documenting

---

## Common Anti-Patterns to Reject

### 🚫 **Architectural Violations**

```typescript
// ❌ REJECT - Missing 4-file structure
Button.tsx // Single file component

// ❌ REJECT - Wrong component structure
const Button = (props: any) => { // Missing FC, using any
  return <div>Button</div>; // Web element
};

// ❌ REJECT - Direct Redux usage
const user = useSelector(state => state.auth.user); // Should use typed selectors
```

### 🚫 **SonarLint Violations**

```typescript
// ❌ REJECT - Missing null checks
const getName = (user) => user.name; // Potential null reference

// ❌ REJECT - Duplicate code
const validateEmail1 = (email) => /regex/.test(email);
const validateEmail2 = (email) => /regex/.test(email); // Duplicate logic

// ❌ REJECT - Magic numbers
setTimeout(callback, 5000); // Should use named constant

// ❌ REJECT - Overly complex functions
const complexFunction = (data) => {
  if (condition1) {
    if (condition2) {
      if (condition3) {
        // Too deeply nested
      }
    }
  }
};
```

### 🚫 **Type Definition Violations**

```typescript
// ❌ REJECT - Using classes for simple data
export class UserResponse {
  // Should be interface
  constructor(public id: string) {}
}

// ❌ REJECT - Missing type safety
export interface UserResponse {
  data: any; // Never use any
}

// ❌ REJECT - Inconsistent naming
export interface user_response {
  // Should be PascalCase
  user_id: string; // Should be camelCase
}
```

### 🚫 **Utils Violations**

```typescript
// ❌ REJECT - Stateful utilities
export const UserUtils = {
  currentUser: null, // Utilities should be stateless
  setCurrentUser: (user) => {} // Side effects in utils
};

// ❌ REJECT - API calls in utilities
export const DataUtils = {
  fetchData: async () => fetch('/api') // API calls don't belong in utils
};

// ❌ REJECT - Mixing utility types
export const MixedUtils = {
  formatString: (str) => str, // String operations
  formatDate: (date) => date, // Date operations
  sortArray: (arr) => arr // Array operations - should be separate
};
```

### 🚫 **API Calling Violations**

```typescript
// ❌ REJECT - Direct API calls in components
const Component = () => {
  useEffect(() => {
    fetch('/api/data').then(setData); // Direct API call
  }, []);
};

// ❌ REJECT - Missing error handling
export const ApiService = {
  getData: async () => {
    const response = await api.get('/data');
    return response.data; // No error handling
  }
};

// ❌ REJECT - Inconsistent patterns
export const ApiService = {
  method1: () => fetch('/api1'), // Using fetch
  method2: () => axios.get('/api2') // Using axios - inconsistent
};
```

### 🚫 **Static Data Violations**

```typescript
// ❌ REJECT - Mutable static data
export let Config = {
  // Should be const
  apiUrl: 'https://api.com'
};

// ❌ REJECT - Magic numbers in code
const validate = (password) => {
  if (password.length < 8) {
    // Magic number
    return false;
  }
};

// ❌ REJECT - Mixed data types in constants
export const Constants = {
  API_URL: 'string',
  TIMEOUT: 5000,
  CONFIG: { data: 'object' }, // Mixed types should be separate
  getCurrentTime: () => new Date() // Functions don't belong
};
```

### 🚫 **String Violations**

```typescript
// ❌ REJECT - Hardcoded strings
const Component = () => (
  <Text>Welcome to App</Text> // Should use Strings.Common.welcome
);

// ❌ REJECT - Direct I18n.t() usage in components
const Component = () => (
  <Text>{I18n.t('common:welcome')}</Text> // Should use Strings.Common.welcome
);

// ❌ REJECT - Inline error messages
if (!email) {
  setError('Email is required'); // Should use Strings.Auth.emailRequired
}

// ❌ REJECT - Inconsistent string structure
export const Strings = {
  loginButton: 'Login', // Should use I18n.t('auth:signIn')
  Auth: {
    signUp: I18n.t('auth:signUp') // Mixed approaches - inconsistent
  },
  btn_save: 'Save' // Wrong naming convention + hardcoded string
};

// ❌ REJECT - Missing namespaces in translations
{
  "loginButton": "Login", // Should be nested under "auth" namespace
  "signUpButton": "Sign Up" // Should be "auth:signUp"
}

// ❌ REJECT - Missing freezeStringsObject wrapper
const Auth = { // Should use freezeStringsObject()
  signIn: I18n.t('auth:signIn')
};
```

### 🚫 **Import Organization Violations**

```typescript
// ❌ REJECT - Wrong import order
import { CustomButton } from '../../components'; // Components before React
import React from 'react'; // React should be first
import { useTheme } from '../../hooks'; // Hooks after components

// ❌ REJECT - Missing section separation
import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Strings } from '../../constants';
// All mixed together

// ❌ REJECT - Inconsistent import styles
import React from 'react';
import * as RN from 'react-native'; // Namespace import
import { View } from 'react-native'; // Named import - inconsistent

// ❌ REJECT - Missing type-only imports
import { UserResponse } from '../../types'; // Should be "import type"
```

### 🚫 **Performance Issues**

```typescript
// ❌ REJECT - Missing optimization
const Component = ({ items }) => {
  return items.map(item =>
    <Item key={item.id} onPress={() => handlePress(item)} /> // New function each render
  );
};

// ❌ REJECT - Missing cleanup
useEffect(() => {
  const subscription = subscribe();
  // Missing return cleanup
}, []);
```

### 🚫 **Security Vulnerabilities**

```typescript
// ❌ REJECT - Insecure storage
AsyncStorage.setItem('token', authToken); // Should use secure storage

// ❌ REJECT - Missing validation
const handleSubmit = (data) => {
  api.post('/submit', data); // No validation
};
```

---

## Enforcement Rules

1. **⚠️ MANDATORY**: All code must pass complete checklist
2. **REQUIRED**: Architecture compliance is non-negotiable
3. **MANDATORY**: Performance optimization is required
4. **REQUIRED**: Security standards must be met
5. **MANDATORY**: Testing coverage must be maintained
6. **REQUIRED**: Accessibility standards must be followed
7. **MANDATORY**: Documentation must be comprehensive

**🚨 CRITICAL**: Any violation of these guidelines will result in review rejection and require rework before merge approval.
