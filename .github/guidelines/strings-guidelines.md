# String Guidelines - test React Native Project

## 📝 **MANDATORY STRING MANAGEMENT**

**⚠️ CRITICAL RULE**: ALL user-facing text MUST be managed through the centralized string system. No hardcoded strings are allowed anywhere in components.

## String Architecture

### Centralized String System
```typescript
// constants/Strings.ts - MANDATORY structure
import I18n from '../translations/i18n';

const freezeStringsObject = <T extends Record<string, string>>(obj: T): Readonly<T> => {
  return Object.freeze(obj);
};

// Module-based organization
const Home = freezeStringsObject({
  homeScreenTitle: I18n.t('home:title'),
  welcomeMessage: I18n.t('home:welcome'),
  details: I18n.t('home:details')
});

const Auth = freezeStringsObject({
  hintEmail: I18n.t('auth:hintEmail'),
  btnSignIn: I18n.t('auth:btnSignIn'),
  forgotPassword: I18n.t('auth:forgotPassword')
});

export const Strings = {
  Home,
  Auth,
  // ... other modules
} as const;
```

### Translation File Structure
```json
// translations/en.json - MANDATORY structure
{
  "home": {
    "title": "Home Screen",
    "welcome": "Welcome to test",
    "details": "View Details"
  },
  "auth": {
    "hintEmail": "Email Address",
    "btnSignIn": "Sign In",
    "forgotPassword": "Forgot Password?"
  },
  "apiError": {
    "networkError": "Network connection failed",
    "serverError": "Server error occurred"
  },
  "yupError": {
    "required": "This field is required",
    "emailInvalid": "Please enter a valid email"
  }
}
```

## String Organization Rules

### MANDATORY Module Grouping
```typescript
// REQUIRED: Organize strings by feature modules
export const Strings = {
  // Authentication module
  Auth: freezeStringsObject({
    signIn: I18n.t('auth:signIn'),
    signUp: I18n.t('auth:signUp'),
    forgotPassword: I18n.t('auth:forgotPassword'),
    invalidCredentials: I18n.t('auth:invalidCredentials')
  }),
  
  // Home module
  Home: freezeStringsObject({
    title: I18n.t('home:title'),
    welcome: I18n.t('home:welcome'),
    logout: I18n.t('home:logout')
  }),
  
  // Details module
  Details: freezeStringsObject({
    title: I18n.t('details:title'),
    description: I18n.t('details:description'),
    backButton: I18n.t('details:backButton')
  }),
  
  // Common strings
  Common: freezeStringsObject({
    ok: I18n.t('common:ok'),
    cancel: I18n.t('common:cancel'),
    save: I18n.t('common:save'),
    delete: I18n.t('common:delete'),
    loading: I18n.t('common:loading')
  }),
  
  // Error messages
  Error: freezeStringsObject({
    networkError: I18n.t('error:networkError'),
    serverError: I18n.t('error:serverError'),
    validationError: I18n.t('error:validationError')
  }),
  
  // Validation messages
  Validation: freezeStringsObject({
    required: I18n.t('validation:required'),
    emailInvalid: I18n.t('validation:emailInvalid'),
    passwordTooShort: I18n.t('validation:passwordTooShort')
  })
} as const;
```

### Naming Conventions

#### String Key Patterns
```typescript
// MANDATORY naming patterns
const StringKeys = {
  // Actions: use verb + noun
  btnSignIn: 'Sign In',           // Button actions
  btnSave: 'Save',               // Button actions
  
  // Labels: use noun or adjective
  labelEmail: 'Email',           // Form labels
  labelPassword: 'Password',     // Form labels
  
  // Hints: use descriptive text
  hintEmail: 'Enter your email', // Input hints
  hintPassword: 'Password must be 8+ characters', // Input hints
  
  // Titles: use noun or short phrase
  titleHome: 'Home',             // Screen titles
  titleSettings: 'Settings',     // Screen titles
  
  // Messages: use complete sentences
  msgWelcome: 'Welcome to our app!',        // User messages
  msgSuccess: 'Operation completed successfully', // Status messages
  
  // Errors: use descriptive error text
  errNetworkFailed: 'Network connection failed',   // Error messages
  errInvalidInput: 'Please check your input',     // Validation errors
};
```

#### Hierarchical Organization
```typescript
// REQUIRED: Use dot notation for nested organization
const ModuleStrings = {
  // Screen-level strings
  screenTitle: I18n.t('module:screenTitle'),
  
  // Component-level strings
  button: {
    primary: I18n.t('module:button.primary'),
    secondary: I18n.t('module:button.secondary')
  },
  
  // Form-related strings
  form: {
    validation: {
      required: I18n.t('module:form.validation.required'),
      invalid: I18n.t('module:form.validation.invalid')
    }
  }
};
```

## String Usage Rules

### ✅ CORRECT String Usage
```typescript
import { Strings } from '../../constants';

// REQUIRED: Use centralized strings
const MyComponent = () => {
  return (
    <View>
      <Text>{Strings.Auth.signInTitle}</Text>
      <Button title={Strings.Auth.btnSignIn} />
      <TextInput placeholder={Strings.Auth.hintEmail} />
    </View>
  );
};

// REQUIRED: Dynamic string usage
const DynamicComponent = ({ userName }: { userName: string }) => {
  return (
    <Text>
      {I18n.t('home:welcomeUser', { name: userName })}
    </Text>
  );
};
```

### ❌ FORBIDDEN String Practices
```typescript
// ❌ NEVER use hardcoded strings
const BadComponent = () => {
  return (
    <View>
      <Text>Sign In</Text>                    // ❌ FORBIDDEN
      <Button title="Submit" />               // ❌ FORBIDDEN
      <TextInput placeholder="Enter email" /> // ❌ FORBIDDEN
    </View>
  );
};

// ❌ NEVER define strings inline
const styles = StyleSheet.create({
  // Even in comments, prefer descriptive names over hardcoded text
});
```

## Internationalization (i18n) Integration

### MANDATORY i18n Setup
```typescript
// translations/i18n.ts - REQUIRED configuration
import I18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import { Storage } from '../services';
import { MMKVKeys } from '../constants';

// Translation resources
import en from './en.json';
import es from './es.json';  // Additional languages as needed

const resources = {
  en: { translation: en },
  es: { translation: es }
};

// MANDATORY: Device locale detection
const deviceLanguage = getLocales()[0]?.languageCode || 'en';
const savedLanguage = Storage.getString(MMKVKeys.appLanguage) || deviceLanguage;

I18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: 'en',
  
  interpolation: {
    escapeValue: false // React already escapes values
  },
  
  // Namespace support for module organization
  defaultNS: 'translation',
  ns: ['translation']
});

export default I18n;
```

### Language Switching
```typescript
// MANDATORY: Language switching functionality
const changeLanguage = async (languageCode: string) => {
  try {
    await I18n.changeLanguage(languageCode);
    Storage.setString(MMKVKeys.appLanguage, languageCode);
    
    // Update strings after language change
    // This triggers re-render with new translations
  } catch (error) {
    console.error('Failed to change language:', error);
  }
};

// Usage in component
const LanguageSelector = () => {
  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang);
  };
  
  return (
    <View>
      <Button 
        title="English" 
        onPress={() => handleLanguageChange('en')} 
      />
      <Button 
        title="Español" 
        onPress={() => handleLanguageChange('es')} 
      />
    </View>
  );
};
```

## Dynamic String Handling

### Parameterized Strings
```typescript
// Translation file with parameters
{
  "welcome": "Welcome back, {{name}}!",
  "itemsCount": "You have {{count}} items",
  "lastSeen": "Last seen {{time}} ago"
}

// REQUIRED: Usage with parameters
const WelcomeMessage = ({ userName }: { userName: string }) => {
  return (
    <Text>
      {I18n.t('welcome', { name: userName })}
    </Text>
  );
};

const ItemCounter = ({ count }: { count: number }) => {
  return (
    <Text>
      {I18n.t('itemsCount', { count })}
    </Text>
  );
};
```

### Pluralization Support
```typescript
// Translation with pluralization
{
  "items": {
    "zero": "No items",
    "one": "One item",
    "other": "{{count}} items"
  }
}

// REQUIRED: Pluralization usage
const ItemsList = ({ count }: { count: number }) => {
  return (
    <Text>
      {I18n.t('items', { count })}
    </Text>
  );
};
```

## String Categories & Organization

### 1. **UI Labels & Actions**
```typescript
const UI = freezeStringsObject({
  // Navigation
  navHome: I18n.t('ui:nav.home'),
  navSettings: I18n.t('ui:nav.settings'),
  navProfile: I18n.t('ui:nav.profile'),
  
  // Actions
  actionSave: I18n.t('ui:action.save'),
  actionCancel: I18n.t('ui:action.cancel'),
  actionDelete: I18n.t('ui:action.delete'),
  actionEdit: I18n.t('ui:action.edit'),
  
  // Status
  statusLoading: I18n.t('ui:status.loading'),
  statusSuccess: I18n.t('ui:status.success'),
  statusError: I18n.t('ui:status.error')
});
```

### 2. **Form & Input Labels**
```typescript
const Forms = freezeStringsObject({
  // Field labels
  labelEmail: I18n.t('forms:label.email'),
  labelPassword: I18n.t('forms:label.password'),
  labelConfirmPassword: I18n.t('forms:label.confirmPassword'),
  
  // Placeholders
  placeholderEmail: I18n.t('forms:placeholder.email'),
  placeholderSearch: I18n.t('forms:placeholder.search'),
  
  // Hints
  hintPasswordStrength: I18n.t('forms:hint.passwordStrength'),
  hintOptionalField: I18n.t('forms:hint.optional')
});
```

### 3. **Error & Validation Messages**
```typescript
const Errors = freezeStringsObject({
  // Validation errors
  validationRequired: I18n.t('errors:validation.required'),
  validationEmail: I18n.t('errors:validation.email'),
  validationMinLength: I18n.t('errors:validation.minLength'),
  
  // API errors
  apiNetworkError: I18n.t('errors:api.network'),
  apiServerError: I18n.t('errors:api.server'),
  apiUnauthorized: I18n.t('errors:api.unauthorized'),
  
  // Generic errors
  errorUnknown: I18n.t('errors:generic.unknown'),
  errorTryAgain: I18n.t('errors:generic.tryAgain')
});
```

### 4. **Success & Info Messages**
```typescript
const Messages = freezeStringsObject({
  // Success messages
  successSaved: I18n.t('messages:success.saved'),
  successDeleted: I18n.t('messages:success.deleted'),
  successUpdated: I18n.t('messages:success.updated'),
  
  // Info messages
  infoNoData: I18n.t('messages:info.noData'),
  infoComingSoon: I18n.t('messages:info.comingSoon'),
  infoOffline: I18n.t('messages:info.offline')
});
```

## String Storage & Performance

### MMKV Integration
```typescript
// Language preference storage
const LANGUAGE_KEY = MMKVKeys.appLanguage;

// Save language preference
const saveLanguagePreference = (languageCode: string) => {
  Storage.setString(LANGUAGE_KEY, languageCode);
};

// Load language preference
const loadLanguagePreference = (): string => {
  return Storage.getString(LANGUAGE_KEY) || 'en';
};
```

### Performance Optimization
```typescript
// MANDATORY: Freeze string objects for immutability
const freezeStringsObject = <T extends Record<string, string>>(obj: T): Readonly<T> => {
  return Object.freeze(obj);
};

// REQUIRED: Lazy loading for large string sets
const getLargeStringSet = () => {
  return freezeStringsObject({
    // Large set of strings loaded on demand
  });
};
```

## Accessibility & String Guidelines

### Screen Reader Support
```typescript
// REQUIRED: Accessibility labels and hints
const AccessibilityStrings = freezeStringsObject({
  labelButton: I18n.t('a11y:label.button'),
  hintDoubleTab: I18n.t('a11y:hint.doubleTap'),
  announcementSaved: I18n.t('a11y:announcement.saved')
});

// Usage in components
<Button
  title={Strings.Auth.btnSignIn}
  accessibilityLabel={AccessibilityStrings.labelButton}
  accessibilityHint={AccessibilityStrings.hintDoubleTab}
/>
```

### Context-Aware Strings
```typescript
// REQUIRED: Provide context for translators
{
  "button": {
    "save": "Save",              // Context: Button text
    "save_hint": "Save changes"  // Context: Accessibility hint
  }
}
```

## Quality Assurance

### String Validation
```typescript
// MANDATORY: Validate string completeness
const validateStrings = () => {
  const requiredKeys = ['title', 'description', 'action'];
  const missingKeys = requiredKeys.filter(key => !Strings.Module[key]);
  
  if (missingKeys.length > 0) {
    console.warn('Missing string keys:', missingKeys);
  }
};
```

### Translation Coverage
```typescript
// REQUIRED: Ensure all strings have translations
const checkTranslationCoverage = (language: string) => {
  const englishKeys = Object.keys(enTranslations);
  const targetKeys = Object.keys(translationsForLanguage);
  
  const missingKeys = englishKeys.filter(key => !targetKeys.includes(key));
  return missingKeys;
};
```

## Enforcement Rules

1. **⚠️ MANDATORY**: All user-facing text MUST use centralized strings
2. **REQUIRED**: Organize strings by feature modules
3. **FORBIDDEN**: No hardcoded strings in components
4. **MANDATORY**: Use i18n for all text content
5. **REQUIRED**: Support parameterized and pluralized strings
6. **MANDATORY**: Follow consistent naming conventions
7. **REQUIRED**: Provide accessibility strings
8. **MANDATORY**: Validate string completeness and coverage

## Examples

### ✅ CORRECT String Implementation
```typescript
import { Strings } from '../../constants';

const LoginScreen = () => {
  return (
    <View>
      <Text>{Strings.Auth.screenTitle}</Text>
      <TextInput placeholder={Strings.Auth.hintEmail} />
      <Button title={Strings.Auth.btnSignIn} />
    </View>
  );
};
```

### ❌ INCORRECT Implementation (FORBIDDEN)
```typescript
// ❌ This violates string guidelines
const LoginScreen = () => {
  return (
    <View>
      <Text>Login</Text>                         // ❌ Hardcoded string
      <TextInput placeholder="Enter email" />   // ❌ Hardcoded string
      <Button title="Sign In" />               // ❌ Hardcoded string
    </View>
  );
};
```

**🚨 CRITICAL**: String compliance is mandatory for internationalization and maintainability. Any hardcoded strings will break translation support and create inconsistencies.