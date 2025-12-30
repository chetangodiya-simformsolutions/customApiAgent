import { StyleSheet } from 'react-native';
import { ApplicationStyles, Colors, scale, type ThemeMode } from '../../theme';
import { type TextVariant } from '../text';
import { type CustomButtonVariant } from './CustomButtonTypes';

/**
 * Maps the button variant to the corresponding text variant.
 *
 * @param {CustomButtonVariant} buttonVariant - The variant of the button.
 * @returns {TextVariant} The corresponding text variant.
 */
export const getTextVariant = (buttonVariant: CustomButtonVariant): TextVariant => {
  switch (buttonVariant) {
    case 'outline':
    case 'solid':
      return 'title';
    case 'hyperlink':
      return 'caption';
    default:
      return 'body';
  }
};

/**
 * Determines the color of the activity indicator based on the button variant.
 *
 * @param {CustomButtonVariant} buttonVariant - The variant of the button.
 * @param {ThemeMode} theme - The theme mode of the application. (Unused)
 * @returns {keyof ThemeColors} The color of the activity indicator.
 */
export const activityIndicatorColor = (buttonVariant: CustomButtonVariant, theme: ThemeMode): string => {
  switch (buttonVariant) {
    case 'outline':
      return Colors[theme]?.lightBlue;
    case 'solid':
      return Colors[theme]?.white;
    case 'hyperlink':
      return Colors[theme]?.lightBlue;
    default:
      return Colors[theme]?.white;
  }
};

/**
 * Determines the color of the activity indicator based on the button variant.
 *
 * @param {CustomButtonVariant} buttonVariant - The variant of the button.
 * @param {ThemeMode} theme - The theme mode of the application. (Unused)
 * @returns {keyof ThemeColors} The color of the activity indicator.
 */
export const textColor = (buttonVariant: CustomButtonVariant, theme: ThemeMode): string => {
  switch (buttonVariant) {
    case 'outline':
      return Colors[theme]?.lightBlue;
    case 'solid':
      return Colors[theme]?.white;
    case 'hyperlink':
      return Colors[theme]?.lightBlue;
    default:
      return Colors[theme]?.white;
  }
};

/**
 * Creates a style sheet for button variants based on the given theme.
 * @param {ThemeMode} theme - The theme to use for styling.
 * @returns {StyleSheet} A style sheet containing styles for button variants.
 */
export const buttonVariantStyles = (theme: ThemeMode) =>
  StyleSheet.create({
    hyperlink: {
      backgroundColor: Colors[theme]?.transparent,
      height: scale(24)
    },
    outline: {
      backgroundColor: Colors[theme]?.transparent,
      borderColor: Colors[theme]?.lightBlue,
      borderRadius: scale(4),
      borderWidth: 1
    },
    solid: {
      backgroundColor: Colors[theme]?.lightBlue,
      borderColor: Colors[theme]?.lightBlue,
      borderRadius: scale(4),
      borderWidth: 1
    }
  });

/**
 * Create a custom style sheet for the given theme.
 * @param {StyleSheetOption} theme - The theme to create the style sheet for.
 * @returns A custom style sheet that can be injected into the component.
 */
export const buttonDefaultStyles = (theme: ThemeMode) =>
  StyleSheet.create({
    ...ApplicationStyles(theme),
    container: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    defaultButtonStyle: {
      alignItems: 'center',
      backgroundColor: Colors[theme]?.lightBlue,
      height: scale(34),
      justifyContent: 'center',
      width: '100%'
    },
    disabledButtonStyle: {
      opacity: 0.5
    },
    pressedStyle: {
      opacity: 0.6
    }
  });
