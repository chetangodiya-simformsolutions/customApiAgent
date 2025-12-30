# Redux Guidelines - test React Native Project

## 🔄 **MANDATORY REDUX ARCHITECTURE**

**⚠️ CRITICAL RULE**: ALL state management MUST use Redux Toolkit with proper async thunks, MMKV persistence, and typed selectors.

## Redux Store Architecture

### MANDATORY Store Configuration

```typescript
// redux/Store.ts - REQUIRED store setup
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { MMKV } from 'react-native-mmkv';
import { FeatureReducer } from './feature';
import { encryptionKey } from '../services/Storage';

// REQUIRED: MMKV storage configuration
const storage = new MMKV({
  id: 'redux-storage',
  encryptionKey: encryptionKey
});

const mmkvStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key: string) => {
    storage.delete(key);
    return Promise.resolve();
  }
};

// REQUIRED: Persist configuration
const persistConfig = {
  key: 'root',
  storage: mmkvStorage,
  whitelist: ['feature'], // Only persist feature state
  blacklist: [] // Add states to exclude from persistence
};

// REQUIRED: Root reducer
const rootReducer = {
  feature: FeatureReducer
  // Add other slices here
};

const persistedReducer = persistReducer(persistConfig, combineReducers(rootReducer));

// REQUIRED: Store configuration
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat([
      // Add custom middleware here
    ]),
  devTools: __DEV__
});

export const persistor = persistStore(store);

// REQUIRED: Type definitions
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### MANDATORY Typed Hooks

```typescript
// redux/useRedux.ts - REQUIRED typed hooks
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './Store';

// REQUIRED: Typed hooks for Redux
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// REQUIRED: Async dispatch helper
export const useAsyncDispatch = () => {
  const dispatch = useAppDispatch();

  return {
    dispatch,
    dispatchAsync: <T>(action: any): Promise<T> => {
      return dispatch(action).unwrap();
    }
  };
};
```

## Slice Architecture

### MANDATORY Initial State Structure

```typescript
// redux/feature/FeatureInitial.ts - REQUIRED structure
// REQUIRED: Import initial state from separate file
import type { FeatureData, FeatureError, FeatureResponse } from '../types';

// REQUIRED: State interface definition with JSDoc
export interface FeatureState {
  data: FeatureData | null;
  loading: boolean;
  newData: FeatureResponse | null;
  error: FeatureError | null;
  lastUpdated: number | null;
}

// REQUIRED: Initial state definition with JSDoc
const initialState: FeatureState = {
  data: null,
  loading: false,
  newData: null,
  error: null,
  lastUpdated: null
};
```

### MANDATORY Slice Structure

```typescript
// redux/feature/FeatureSlice.ts - REQUIRED structure
import {
  createSlice,
  createAsyncThunk,
  type ActionReducerMapBuilder,
  type Draft,
  type PayloadAction
} from '@reduxjs/toolkit';
import { APIConst, ToolkitAction } from '../../constants';
import { authorizedAPI, unauthorizedAPI } from '../../configs';
import { createAsyncThunkWithCancelToken } from '../../configs/APIConfig';
import { APIService } from '../../services';
import type { FeatureData, FeatureError, FeatureResponse } from '../types';
// REQUIRED: Import initial state from separate file
import INITIAL_STATE, { type FeatureState } from './FeatureInitial';

// REQUIRED: Async thunks for unauthorized API calls with JSDoc
export const fetchFeatureData = createAsyncThunkWithCancelToken<FeatureResponse>(
  ToolkitAction.signin,
  'POST',
  APIConst.signin,
  UserResponse,
  unauthorizedAPI
);

// REQUIRED: Async thunks for authorized API calls with JSDoc
export const fetchAuthFeatureData = createAsyncThunkWithCancelToken<FeatureResponse>(
  ToolkitAction.signin,
  'POST',
  APIConst.signin,
  UserResponse,
  authorizedAPI
);

// REQUIRED: Slice definition with JSDoc
const featureSlice = createSlice({
  name: 'feature',
  initialState: INITIAL_STATE,
  reducers: {
    // REQUIRED: Synchronous actions
    setData: (state, action: PayloadAction<FeatureData>) => {
      state.data = action.payload;
      state.lastUpdated = Date.now();
    },

    setError: (state, action: PayloadAction<FeatureError>) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    resetState: () => initialState
  },
  extraReducers: (builder) => {
    // REQUIRED: Async action handling for unauthorized API with JSDoc
    builder
      .addCase(fetchFeatureData.pending, (state: Draft<AuthStateType>) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFeatureData.fulfilled,
        (state: Draft<AuthStateType>, action: PayloadAction<FeatureResponse>) => {
          state.loading = false;
          state.newData = action.payload;
          state.lastUpdated = Date.now();
        }
      )
      .addCase(
        fetchFeatureData.rejected,
        (state: Draft<AuthStateType>, action: PayloadAction<FeatureError>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );

    // REQUIRED: Async action handling for authorized API with JSDoc
    builder
      .addCase(fetchAuthFeatureData.pending, (state: Draft<AuthStateType>) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAuthFeatureData.fulfilled,
        (state: Draft<AuthStateType>, action: PayloadAction<FeatureResponse>) => {
          state.loading = false;
          state.newData = action.payload;
          state.lastUpdated = Date.now();
        }
      )
      .addCase(
        fetchAuthFeatureData.rejected,
        (state: Draft<AuthStateType>, action: PayloadAction<FeatureError>) => {
          state.loading = false;
          state.error = action.payload as FeatureError;
        }
      );
  }
});

// REQUIRED: Export actions and reducer
export const FeatureActions = {
  ...featureSlice.actions,
  fetchAuthFeatureData,
  fetchFeatureData
};
export const FeatureReducer = featureSlice.reducer;
```

### MANDATORY Selector Structure

```typescript
// redux/feature/FeatureSelectors.ts - REQUIRED structure
import { FeatureResponse, FeatureData, ErrorResponse } from '../../types';
import type { FeatureState } from './FeatureInitial';
import type { RootStateType } from '../Store';

// REQUIRED: Selector interface definition with JSDoc
interface FeatureSelectorsType {
  getFeature: (state: RootStateType) => FeatureState;
  getLoading: (state: RootStateType) => boolean;
  getError: (state: RootStateType) => ErrorResponse | undefined;
  getFeatures: (state: RootStateType) => FeatureData | null;
  getNewData: (state: RootStateType) => FeatureResponse | null;
}

// REQUIRED: Selector implementations with JSDoc
const FeatureSelectors: FeatureSelectorsType = {
  getFeature: (state: RootStateType): FeatureState => state.feature;
  getLoading: (state: RootStateType): boolean => state.feature.loading;
  getError: (state: RootStateType): ErrorResponse | undefined => state.feature?.error || undefined;
  getFeatures: (state: RootStateType): FeatureData | null => state.feature.data;
  getNewData: (state: RootStateType): FeatureResponse | null => state.feature.newData;
};

export default FeatureSelectors;
```

### MANDATORY Barrel exports Structure

```typescript
// redux/feature/index.ts - REQUIRED structure
export { default as FeatureSelectors } from './FeatureSelector';
export { FeatureActions, FeatureReducer } from './FeatureSlice';
```

### MANDATORY Types Structure

```typescript
// types/FeatureResponse.ts - REQUIRED structure
// REQUIRED: Type definitions for Feature module with JSDoc
export interface FeatureData {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  timestamp: string; // ISO date string
  value: number;
}

// Required: Feature response structure from API with JSDoc
export interface FeatureResponse {
  id: string;
  name: string;
  description?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
```

## Component Integration

### MANDATORY Component Usage

```typescript
// modules/feature/FeatureScreen.tsx - Example component integration
import { useAppDispatch, useAppSelector } from '../../redux/useRedux';
import { FeatureSelectors, FeatureActions } from '../../redux';

const FeatureScreen: React.FC = () => {
  const dispatch = useAppDispatch();

  // REQUIRED: Use typed selectors
  const feature = useAppSelector(FeatureSelectors.getFeatures);
  const loading = useAppSelector(FeatureSelectors.getLoading);
  const error = useAppSelector(FeatureSelectors.getError);
  const newData = useAppSelector(FeatureSelectors.getNewData);

  // REQUIRED: Handle async actions with proper error handling
  const handleFeature = useCallback(async (payload: Request) => {
    try {
      dispatch(FeatureActions.clearError()); // Clear previous errors

      const result = await dispatch(FeatureActions.actions(payload)).unwrap();

      // Success handling
      console.log('Feature successful:', result);
      navigateWithParam(ROUTES.Home);

    } catch (error) {
      // Error is already handled in the slice
      console.error('Feature failed:', error);
    }
  }, []);

  // REQUIRED: Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(FeatureActions.clearError());
    };
  }, [dispatch]);

  return (
    <View style={styles.container}>
      {/* Component JSX */}
    </View>
  );
};
```

### MANDATORY Async Action Handling

```typescript
// Custom hook for async actions with loading states
export const useAsyncAction = () => {
  const [localLoading, setLocalLoading] = useState<Record<string, boolean>>({});
  const dispatch = useAppDispatch();

  const executeAsync = useCallback(async <T>(
    action: any,
    actionName: string
  ): Promise<T> => {
    setLocalLoading(prev => ({ ...prev, [actionName]: true }));

    try {
      const result = await dispatch(action).unwrap();
      return result;
    } finally {
      setLocalLoading(prev => ({ ...prev, [actionName]: false }));
    }
  }, [dispatch]);

  return {
    executeAsync,
    isLoading: (actionName: string) => localLoading[actionName] || false,
  };
};

// Usage in component
const MyComponent = () => {
  const { executeAsync, isLoading } = useAsyncAction();

  const handleSubmit = async (data: any) => {
    try {
      await executeAsync(
        loginUser(data),
        'login'
      );
    } catch (error) {
      // Handle error
    }
  };

  return (
    <Button
      loading={isLoading('login')}
      onPress={handleSubmit}
    />
  );
};
```

## Advanced Patterns

### MANDATORY RTK Query Integration (for API calls)

```typescript
// redux/api/ApiSlice.ts - RTK Query setup
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../Store';

// REQUIRED: Base API configuration
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    }
  }),

  tagTypes: ['User', 'Post'], // For cache invalidation

  endpoints: (builder) => ({
    // REQUIRED: Query endpoint
    getUserProfile: builder.query<User, string>({
      query: (userId) => `users/${userId}`,
      providesTags: ['User']
    }),

    // REQUIRED: Mutation endpoint
    updateUserProfile: builder.mutation<User, { id: string; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `users/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['User']
    })
  })
});

// REQUIRED: Export hooks
export const { useGetUserProfileQuery, useUpdateUserProfileMutation } = apiSlice;
```

## Performance Optimization

### MANDATORY Selector Optimization

```typescript
// Use memoized selectors for expensive computations
export const selectFilteredUsers = createSelector(
  [selectUsers, selectSearchQuery, selectActiveFilters],
  (users, searchQuery, filters) => {
    // Expensive filtering logic
    return users.filter((user) => {
      // Apply search and filters
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilters = filters.every((filter) => filter.check(user));

      return matchesSearch && matchesFilters;
    });
  }
);

// Use selector factories for parameterized selectors
export const makeSelectUserById = () =>
  createSelector([selectUsers, (state: RootState, userId: string) => userId], (users, userId) =>
    users.find((user) => user.id === userId)
  );
```

### MANDATORY Component Optimization

```typescript
// Optimize component re-renders with specific selectors
const UserProfile = React.memo(({ userId }: { userId: string }) => {
  // REQUIRED: Use specific selectors to minimize re-renders
  const user = useAppSelector(state =>
    state.users.items.find(u => u.id === userId)
  );

  const isLoading = useAppSelector(state =>
    state.users.loading
  );

  // Avoid selecting entire state
  // ❌ const { users, loading } = useAppSelector(state => state.users);

  return (
    <View>
      {/* Component content */}
    </View>
  );
});
```

## Enforcement Rules

1. **⚠️ MANDATORY**: Use Redux Toolkit with createSlice and createAsyncThunk
2. **REQUIRED**: Type all state, actions, and selectors properly
3. **MANDATORY**: Use MMKV for persistence with encryption
4. **REQUIRED**: Implement proper error handling in all async thunks
5. **MANDATORY**: Use memoized selectors for performance
6. **REQUIRED**: Handle loading and error states consistently
7. **MANDATORY**: Clear errors on component unmount
8. **REQUIRED**: Use cancellation tokens for async operations
9. **MANDATORY**: Implement proper middleware for side effects
10. **REQUIRED**: Optimize component re-renders with specific selectors

## Examples

### ✅ CORRECT Redux Implementation

```typescript
import { useAppDispatch, useAppSelector, AuthSelectors, AuthActions } from '../../redux';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(AuthSelectors.selectAuthLoading);
  const error = useAppSelector(AuthSelectors.selectAuthError);

  const handleLogin = useCallback(async (data) => {
    try {
      await dispatch(AuthActions.loginUser(data)).unwrap();
    } catch (error) {
      console.error('Login failed:', error);
    }
  }, []);

  return <View>{/* Component content */}</View>;
};
```

### ❌ INCORRECT Implementation (FORBIDDEN)

```typescript
// ❌ This violates Redux guidelines
import { useSelector, useDispatch } from 'react-redux';

const MyComponent = () => {
  const dispatch = useDispatch(); // ❌ Not typed
  const state = useSelector(state => state); // ❌ Selecting entire state

  const handleLogin = (data) => {
    dispatch({ type: 'LOGIN_USER', payload: data }); // ❌ Plain action
  };

  return <View>{/* Component content */}</View>;
};
```

**🚨 CRITICAL**: Redux compliance ensures type safety, proper state management, and optimal performance across the application.
