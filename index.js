import { AppRegistry, LogBox, Text, TextInput } from 'react-native';
import 'react-native-gesture-handler';
import App from './app/App';

import { name as appName } from './app.json';

// Disable font scaling globally
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

LogBox.ignoreAllLogs(true);
LogBox.ignoreLogs([
  'EventEmitter.removeListener',
  'Require cycle:',
  'Non-serializable values were found in the navigation state. Check',
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components"
]);

AppRegistry.registerComponent(appName, () => App);
