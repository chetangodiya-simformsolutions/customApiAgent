# Performance Guidelines - test React Native Project

## ⚡ **MANDATORY PERFORMANCE OPTIMIZATION**

**⚠️ CRITICAL RULE**: ALL components and modules MUST follow performance best practices for optimal React Native performance.

## React Performance Optimization

### MANDATORY Component Optimization
```typescript
// REQUIRED: Use React.memo for functional components
const OptimizedComponent = React.memo<ComponentProps>(({ data, onPress }) => {
  const { styles } = useTheme(styleSheet);
  
  return (
    <View style={styles.container}>
      <Text>{data.title}</Text>
      <Button onPress={onPress} />
    </View>
  );
});

// REQUIRED: Use useCallback for event handlers
const MyComponent: React.FC<Props> = ({ onSubmit, data }) => {
  const [loading, setLoading] = useState(false);
  
  // REQUIRED: Memoize callbacks to prevent unnecessary re-renders
  const handlePress = useCallback(async () => {
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  }, [onSubmit, data]);
  
  // REQUIRED: Memoize complex calculations
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      displayName: `${item.firstName} ${item.lastName}`,
      isActive: item.status === 'active',
    }));
  }, [data]);
  
  return (
    <View>
      <FlatList
        data={processedData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout} // REQUIRED for known item sizes
      />
      <Button onPress={handlePress} loading={loading} />
    </View>
  );
};

// REQUIRED: Memoize render functions
const renderItem = useCallback(({ item, index }) => (
  <ItemComponent 
    key={item.id}
    item={item}
    index={index}
    onPress={handleItemPress}
  />
), [handleItemPress]);

// REQUIRED: Optimize key extractor
const keyExtractor = useCallback((item: Item) => item.id, []);
```

### MANDATORY List Performance
```typescript
// REQUIRED: FlatList optimization
const OptimizedList: React.FC<ListProps> = ({ data, onItemPress }) => {
  const { styles } = useTheme(styleSheet);
  
  // REQUIRED: Memoize callbacks
  const renderItem = useCallback(({ item, index }: ListRenderItemInfo<Item>) => (
    <ListItem 
      item={item}
      index={index}
      onPress={onItemPress}
    />
  ), [onItemPress]);
  
  const keyExtractor = useCallback((item: Item) => item.id, []);
  
  // REQUIRED: getItemLayout for known item heights
  const getItemLayout = useCallback((data: any, index: number) => ({
    length: scale(80), // Known item height
    offset: scale(80) * index,
    index,
  }), []);
  
  // REQUIRED: View configuration for better scrolling
  const viewabilityConfig = useMemo(() => ({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 300,
  }), []);
  
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      viewabilityConfig={viewabilityConfig}
      
      // REQUIRED: Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={100}
      initialNumToRender={10}
      windowSize={10}
      
      // REQUIRED: Memory optimization
      onEndReachedThreshold={0.5}
      onEndReached={handleLoadMore}
      
      style={styles.list}
    />
  );
};

// REQUIRED: Optimized list item component
const ListItem = React.memo<ListItemProps>(({ item, onPress }) => {
  const { styles } = useTheme(styleSheet);
  
  const handlePress = useCallback(() => {
    onPress(item.id);
  }, [onPress, item.id]);
  
  return (
    <Pressable style={styles.item} onPress={handlePress}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </Pressable>
  );
}, (prevProps, nextProps) => {
  return prevProps.item.id === nextProps.item.id &&
         prevProps.item.title === nextProps.item.title;
});
```

### MANDATORY Image Optimization
```typescript
// REQUIRED: Optimized image component
const OptimizedImage: React.FC<ImageProps> = ({ 
  source, 
  style, 
  placeholder,
  onLoad,
  onError 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const handleLoad = useCallback(() => {
    setImageLoaded(true);
    onLoad?.();
  }, [onLoad]);
  
  const handleError = useCallback(() => {
    setImageError(true);
    onError?.();
  }, [onError]);
  
  return (
    <View style={style}>
      {/* REQUIRED: Show placeholder while loading */}
      {!imageLoaded && !imageError && (
        <View style={styles.placeholder}>
          {placeholder || <ActivityIndicator />}
        </View>
      )}
      
      {/* REQUIRED: Show error state */}
      {imageError && (
        <View style={styles.errorState}>
          <Text>Failed to load image</Text>
        </View>
      )}
      
      {/* REQUIRED: Optimized image with proper props */}
      <Image
        source={source}
        style={[style, { opacity: imageLoaded ? 1 : 0 }]}
        onLoad={handleLoad}
        onError={handleError}
        
        // REQUIRED: Performance optimizations
        resizeMode="cover"
        fadeDuration={300}
        progressiveRenderingEnabled={true}
        
        // REQUIRED: Memory optimization
        recyclingKey={source.uri} // For FastImage if used
      />
    </View>
  );
};

// REQUIRED: Use FastImage for better performance (if installed)
import FastImage from 'react-native-fast-image';

const FastOptimizedImage: React.FC<ImageProps> = ({ source, style }) => (
  <FastImage
    source={{
      uri: source.uri,
      priority: FastImage.priority.normal,
      cache: FastImage.cacheControl.immutable,
    }}
    style={style}
    resizeMode={FastImage.resizeMode.cover}
  />
);
```

## Navigation Performance

### MANDATORY Screen Optimization
```typescript

// REQUIRED: Screen with performance optimizations
const OptimizedScreen: React.FC = () => {
  const { styles } = useTheme(styleSheet);
  const navigation = useNavigation();
  
  // REQUIRED: Prevent unnecessary re-renders on navigation
  const isFocused = useIsFocused();
  
  // REQUIRED: Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup expensive operations
      clearInterval(intervalRef.current);
      abortControllerRef.current?.abort();
    };
  }, []);
  
  // REQUIRED: Focus effect for screen-specific logic
  useFocusEffect(
    useCallback(() => {
      // Screen focused - start expensive operations
      startLocationTracking();
      
      return () => {
        // Screen unfocused - stop expensive operations
        stopLocationTracking();
      };
    }, [])
  );
  
  return (
    <View style={styles.screen}>
      {/* Conditional rendering based on focus */}
      {isFocused && <ExpensiveComponent />}
    </View>
  );
};
```

### MANDATORY Navigation Optimization
```typescript
// REQUIRED: Optimize navigation options
const NavigationStack = () => (
  <Stack.Navigator
    screenOptions={{
      // REQUIRED: Optimize header performance
      headerMode: 'screen',
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      
      // REQUIRED: Reduce animation overhead
      transitionSpec: {
        open: TransitionSpecs.TransitionIOSSpec,
        close: TransitionSpecs.TransitionIOSSpec,
      },
      
      // REQUIRED: Lazy loading
      lazy: true,
    }}
  >
    <Stack.Screen 
      name={ROUTES.Home}
      component={HomeScreen}
      options={{
        // REQUIRED: Static options for better performance
        title: 'Home',
        headerShown: true,
      }}
    />
  </Stack.Navigator>
);
```

## State Management Performance

### MANDATORY Redux Optimization
```typescript
// REQUIRED: Memoized selectors
export const selectFilteredItems = createSelector(
  [selectItems, selectFilter, selectSearchQuery],
  (items, filter, searchQuery) => {
    // Expensive filtering logic
    return items
      .filter(item => filter.check(item))
      .filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }
);

// REQUIRED: Selector factories for parameterized selectors
export const makeSelectItemById = () =>
  createSelector(
    [selectItems, (state: RootState, id: string) => id],
    (items, id) => items.find(item => item.id === id)
  );

// REQUIRED: Component with optimized Redux usage
const OptimizedReduxComponent: React.FC<Props> = ({ itemId }) => {
  // REQUIRED: Use specific selectors to minimize re-renders
  const item = useAppSelector(state => 
    state.items.data.find(i => i.id === itemId)
  );
  const loading = useAppSelector(state => state.items.loading);
  
  // REQUIRED: Avoid selecting entire state
  // ❌ const itemsState = useAppSelector(state => state.items);
  
  return (
    <View>
      {loading ? <Loader /> : <ItemDisplay item={item} />}
    </View>
  );
};
```

### MANDATORY State Updates Optimization
```typescript
// REQUIRED: Batch state updates
const batchedStateUpdate = useCallback(() => {
  unstable_batchedUpdates(() => {
    setLoading(false);
    setData(newData);
    setError(null);
  });
}, []);

// REQUIRED: Debounce expensive operations
const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    dispatch(searchItems(query));
  }, 300),
  [dispatch]
);

// REQUIRED: Throttle high-frequency updates
const throttledScroll = useMemo(
  () => throttle((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    handleScrollPosition(contentOffset.y);
  }, 16), // 60fps
  []
);
```

## Memory Management

### MANDATORY Memory Optimization
```typescript
// REQUIRED: Cleanup timers and subscriptions
const MyComponent: React.FC = () => {
  const intervalRef = useRef<NodeJS.Timeout>();
  const subscriptionRef = useRef<any>();
  
  useEffect(() => {
    // Setup timers and subscriptions
    intervalRef.current = setInterval(() => {
      // Periodic work
    }, 1000);
    
    subscriptionRef.current = someService.subscribe(() => {
      // Handle updates
    });
    
    // REQUIRED: Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, []);
  
  return <View>{/* Component content */}</View>;
};

// REQUIRED: Abort async operations
const AsyncComponent: React.FC = () => {
  const abortControllerRef = useRef<AbortController>();
  
  const fetchData = useCallback(async () => {
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    try {
      const response = await fetch('/api/data', {
        signal: abortControllerRef.current.signal,
      });
      
      const data = await response.json();
      setData(data);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Fetch failed:', error);
      }
    }
  }, []);
  
  useEffect(() => {
    fetchData();
    
    // REQUIRED: Abort on unmount
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchData]);
  
  return <View>{/* Component content */}</View>;
};
```

### MANDATORY Large List Handling
```typescript
// REQUIRED: Virtualized list for large datasets
import { VirtualizedList } from 'react-native';

const VirtualizedComponent: React.FC<Props> = ({ data }) => {
  const getItem = useCallback((data: any[], index: number) => data[index], []);
  const getItemCount = useCallback((data: any[]) => data.length, []);
  
  const renderItem = useCallback(({ item, index }) => (
    <ListItem item={item} index={index} />
  ), []);
  
  return (
    <VirtualizedList
      data={data}
      initialNumToRender={10}
      renderItem={renderItem}
      getItem={getItem}
      getItemCount={getItemCount}
      keyExtractor={keyExtractor}
      
      // REQUIRED: Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={100}
      windowSize={10}
    />
  );
};

// REQUIRED: Sectioned list optimization
const OptimizedSectionList: React.FC<Props> = ({ sections }) => {
  const renderItem = useCallback(({ item }) => (
    <SectionItem item={item} />
  ), []);
  
  const renderSectionHeader = useCallback(({ section }) => (
    <SectionHeader title={section.title} />
  ), []);
  
  const keyExtractor = useCallback((item, index) => `${item.id}-${index}`, []);
  
  return (
    <SectionList
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      keyExtractor={keyExtractor}
      
      // REQUIRED: Performance optimizations
      stickySectionHeadersEnabled={false} // Better performance
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      initialNumToRender={10}
    />
  );
};
```

## Animation Performance

### MANDATORY Animation Optimization
```typescript
// REQUIRED: Use useNativeDriver for better performance
const animatedValue = useRef(new Animated.Value(0)).current;

const startAnimation = useCallback(() => {
  Animated.timing(animatedValue, {
    toValue: 1,
    duration: 300,
    useNativeDriver: true, // REQUIRED for performance
    easing: Easing.out(Easing.cubic),
  }).start();
}, [animatedValue]);

// REQUIRED: Optimize transform animations
const AnimatedComponent: React.FC = () => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  
  const animatedStyle = useMemo(() => ({
    transform: [{ translateY }],
    opacity,
  }), [translateY, opacity]);
  
  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {/* Content */}
    </Animated.View>
  );
};

// REQUIRED: Use react-native-reanimated for complex animations
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const ReanimatedComponent: React.FC = () => {
  const offset = useSharedValue(0);
  const opacity = useSharedValue(1);
  
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
    opacity: opacity.value,
  }));
  
  const handlePress = () => {
    offset.value = withSpring(offset.value + 100);
  };
  
  return (
    <Animated.View style={[styles.container, animatedStyles]}>
      <Pressable onPress={handlePress}>
        <Text>Animate</Text>
      </Pressable>
    </Animated.View>
  );
};
```

## Bundle Size Optimization

### MANDATORY Import Optimization
```typescript
// REQUIRED: Use specific imports instead of barrel imports
// ✅ Correct
import { debounce } from 'lodash/debounce';
import { isEmpty } from 'lodash/isEmpty';

// ❌ Incorrect - imports entire lodash
import _ from 'lodash';
import * as _ from 'lodash';

// REQUIRED: Dynamic imports for code splitting
const LazyComponent = React.lazy(async () => {
  const module = await import('./ExpensiveComponent');
  return { default: module.ExpensiveComponent };
});

// REQUIRED: Conditional imports
const conditionalImport = async () => {
  if (Platform.OS === 'ios') {
    const { IOSSpecificModule } = await import('./IOSSpecificModule');
    return IOSSpecificModule;
  } else {
    const { AndroidSpecificModule } = await import('./AndroidSpecificModule');
    return AndroidSpecificModule;
  }
};

// REQUIRED: Tree-shaking friendly exports
// components/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Modal } from './Modal';

// Don't use default exports for barrel files
// ❌ export { default as Button } from './Button';
```

### MANDATORY Asset Optimization
```typescript
// REQUIRED: Optimize image assets
const OptimizedImageAssets = {
  // Use WebP format when possible
  avatar: require('../assets/images/avatar.webp'),
  
  // Provide multiple resolutions
  logo: {
    '1x': require('../assets/images/logo.png'),
    '2x': require('../assets/images/logo@2x.png'),
    '3x': require('../assets/images/logo@3x.png'),
  },
  
  // Use vector icons when possible
  icons: {
    home: require('../assets/icons/home.svg'),
    profile: require('../assets/icons/profile.svg'),
  },
};

// REQUIRED: Lazy load large assets
const LazyImageComponent: React.FC<Props> = ({ imageName }) => {
  const [imageSource, setImageSource] = useState(null);
  
  useEffect(() => {
    const loadImage = async () => {
      try {
        const source = await import(`../assets/images/${imageName}.png`);
        setImageSource(source.default);
      } catch (error) {
        console.error('Failed to load image:', error);
      }
    };
    
    loadImage();
  }, [imageName]);
  
  return imageSource ? (
    <Image source={imageSource} style={styles.image} />
  ) : (
    <View style={styles.placeholder} />
  );
};
```

## Enforcement Rules

1. **⚠️ MANDATORY**: Use React.memo for all functional components
2. **REQUIRED**: Implement useCallback for all event handlers
3. **MANDATORY**: Use useMemo for expensive calculations
4. **REQUIRED**: Optimize FlatList with proper props
5. **MANDATORY**: Implement lazy loading for screens and components
6. **REQUIRED**: Use specific Redux selectors to minimize re-renders
7. **MANDATORY**: Clean up timers, subscriptions, and async operations
8. **REQUIRED**: Use useNativeDriver for animations
9. **MANDATORY**: Optimize imports to reduce bundle size
10. **REQUIRED**: Monitor performance in development

## Examples

### ✅ CORRECT Performance Implementation
```typescript
const OptimizedComponent = React.memo<Props>(({ data, onPress }) => {
  const { styles } = useTheme(styleSheet);
  
  const handlePress = useCallback(() => {
    onPress(data.id);
  }, [onPress, data.id]);
  
  const processedData = useMemo(() => {
    return data.map(item => ({ ...item, formatted: true }));
  }, [data]);
  
  return (
    <View style={styles.container}>
      <FlatList
        data={processedData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
      />
    </View>
  );
});
```

### ❌ INCORRECT Implementation (FORBIDDEN)
```typescript
// ❌ This violates performance guidelines
const SlowComponent = ({ data, onPress }) => { // ❌ No React.memo
  const handlePress = () => { // ❌ No useCallback
    onPress(data.id);
  };
  
  const processedData = data.map(item => ({ // ❌ No useMemo
    ...item, 
    formatted: true 
  }));
  
  return (
    <View>
      <FlatList
        data={processedData}
        renderItem={({ item }) => <Item item={item} onPress={handlePress} />} // ❌ Inline render
      />
    </View>
  );
};
```

**🚨 CRITICAL**: Performance compliance ensures smooth user experience, efficient memory usage, and optimal app performance on all devices.
