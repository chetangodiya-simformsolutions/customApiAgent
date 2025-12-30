import { Dimensions, Platform, type ScaledSize } from 'react-native';

/**
 * Interface representing the dimensions of a device.
 * @interface DimensionsType
 * @property {number} width - The width of the device screen.
 * @property {number} height - The height of the device screen.
 */
export interface DimensionsType {
  width: number;
  height: number;
}

/**
 * Get the width and height of the device screen.
 * @returns {DimensionsType} - the width and height of the device screen.
 */
const getDimensions = (): DimensionsType => {
  let { width, height }: ScaledSize = Dimensions.get('window');

  if (width > height) {
    [width, height] = [height, width];
  }
  return { width, height };
};

// Get dimensions
const { width, height }: DimensionsType = getDimensions();

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth: number = 375;

const guidelineBaseHeight: number = 812;

// Calculate the base size by averaging the base width and base height
const baseWidth: number = width / guidelineBaseWidth;

const baseHeight: number = height / guidelineBaseHeight;

// Calculate the base size by averaging the base width and base height.
let baseSize: number = (baseWidth + baseHeight) / 2;

// Consider 1.2 as a threshold for identifying tablets based on analyzing multiple devices.
const isTablet: boolean = (Platform.OS === 'ios' && Platform.isPad) || baseSize > 1.2;

// Adjust the base size based on whether the device is identified as a tablet or not.
baseSize = (baseWidth + baseHeight) * (isTablet ? 0.4 : 0.5);

/**
 * Converts the provided size based on the calculated base size.
 * @param {number} size - The screen's size that UI element should cover
 * @returns {number} The scaled size depending on the current device's screen size.
 */
const scale = (size: number, disableCeil: boolean = false): number => 
  disableCeil ? size * baseSize : Math.ceil(size * baseSize);

/**
 * A type that contains the global metrics for the current device.
 * @typedef {Object} GlobalMetricsType - A type that contains the global metrics for the current device.
 * @property {boolean} isAndroid - Whether the current device is an Android device.
 */
interface GlobalMetricsType {
  isAndroid: boolean;
  isIos: boolean;
  isPad: boolean;
  isTV: boolean;
  isWeb: boolean;
}

/**
 * A type that contains the global metrics for the app.
 * @type {GlobalMetricsType}
 */
const globalMetrics: GlobalMetricsType = {
  isAndroid: Platform.OS === 'android',
  isIos: Platform.OS === 'ios',
  isPad: Platform.OS === 'ios' && Platform.isPad,
  isTV: Platform.isTV,
  isWeb: Platform.OS === 'web'
};

export { globalMetrics, scale, width, height };
