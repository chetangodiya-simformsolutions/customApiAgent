import { StyleSheet } from 'react-native';
import {
  ApplicationStyles,
  Colors,
  scale,
  type ThemeMode
} from '../../../../theme';

/**
 * A StyleSheet object that contains all of the sign in form styles.
 * @param {ThemeMode} theme - The theme to use for the styles.
 * @returns {StyleSheet} A StyleSheet object containing all of the sign in form styles.
 */
const styles = (theme: ThemeMode) =>
  StyleSheet.create({
    ...ApplicationStyles(theme),
    buttonText: {
      color: Colors[theme]?.white
    },
    errorMsg: {
      color: Colors[theme]?.red,
      fontSize: scale(14),
      marginBottom: scale(20)
    },
    formContainer: {
      flex: 1,
      paddingHorizontal: scale(20),
      paddingTop: scale(50)
    },
    textInput: {
      backgroundColor: Colors[theme]?.black,
      borderRadius: scale(5),
      color: Colors[theme]?.white,
      fontSize: scale(16),
      paddingHorizontal: scale(10),
      paddingVertical: scale(10)
    }
  });

export default styles;
