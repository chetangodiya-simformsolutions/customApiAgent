import { StyleSheet } from 'react-native';
import Colors, { type ThemeMode } from './Colors';
import { globalMetrics, scale, width } from './Metrics';

/**
 * A StyleSheet object that contains all of the application's styles.
 * @param {ThemeMode} theme - The theme of the application.
 * @returns {StyleSheet} - A StyleSheet object containing all of the application's styles.
 */
const applicationStyles = (theme: ThemeMode) =>
  StyleSheet.create({
    bottomLine: {
      borderBottomColor: Colors[theme]?.primary,
      borderBottomWidth: scale(0.8)
    },
    buttonBorderStyle: {
      borderRadius: scale(5),
      borderStyle: 'solid',
      borderWidth: scale(2)
    },
    buttonBottomMargin: {
      marginBottom: globalMetrics.isAndroid ? scale(35) : scale(40)
    },
    buttonContainer: {
      flex: 0,
      zIndex: 0
    },
    buttonTopMargin: {
      marginTop: scale(15)
    },
    centerAlign: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    flexColumn: {
      flexDirection: 'column'
    },
    flexRow: {
      flexDirection: 'row'
    },
    normalLine: {
      backgroundColor: Colors[theme]?.primary,
      height: scale(0.8),
      width: '100%'
    },
    screen: {
      flex: 1
    },
    spinnerButton: {
      borderRadius: globalMetrics.isAndroid ? scale(25) : scale(20),
      height: globalMetrics.isAndroid ? scale(50) : scale(40),
      width: width - scale(40)
    },
    textLabel: {
      fontSize: scale(14)
    }
  });

export default applicationStyles;
