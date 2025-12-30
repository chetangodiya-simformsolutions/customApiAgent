import {
  useSafeAreaFrame,
  useSafeAreaInsets,
  type EdgeInsets,
  type Rect
} from 'react-native-safe-area-context';
import { globalMetrics, scale } from '../theme';

/**
 * A status bar hook returns the height of the status bar.
 * @returns {number} The height of the status bar.
 */
export function useStatusBarHeight(): number {
  const insets: EdgeInsets = useSafeAreaInsets();
  return insets.top;
}

/**
 * A header returns the height of the header.
 * @param {boolean} [modalPresentation=false] - Whether the header is being used in a modal presentation.
 * @returns {number} The height of the header.
 */
export function useHeaderHeight(modalPresentation: boolean = false): number {
  const frame: Rect = useSafeAreaFrame();
  const statusBarHeight: number = useStatusBarHeight();
  let headerHeight: number;

  const isLandscape: boolean = frame.width > frame.height;
  const isIOS: boolean = globalMetrics.isIos;
  const isPadOrTV: boolean = isIOS && (globalMetrics.isPad || globalMetrics.isTV);
  const isAndroid: boolean = globalMetrics.isAndroid;

  if (isIOS) {
    if (isPadOrTV) {
      headerHeight = modalPresentation ? 56 : 50;
    } else if (isLandscape) {
      headerHeight = 32;
    } else {
      headerHeight = modalPresentation ? 56 : 44;
    }
  } else if (isAndroid) {
    headerHeight = 56;
  } else {
    headerHeight = 64;
  }

  return scale(headerHeight) + statusBarHeight;
}
