import { NativeModules } from 'react-native';
import Reactotron, { openInEditor } from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
// @ts-ignore

let packagerHostname = 'localhost';

if (__DEV__) {
  const scriptURL = NativeModules.SourceCode.scriptURL;
  packagerHostname = scriptURL?.split?.('://')?.[1]?.split?.(':')?.[0] || 'localhost';
}
// https://github.com/infinitered/reactotron for more options!
//
const reactotron = Reactotron.configure({
  name: "test",
  host: packagerHostname
})
  .useReactNative()
  // @ts-ignore
  .use(reactotronRedux())
  .use(openInEditor())
  .connect();

 // Clear Reactotron on every time we load the app 
reactotron.clear();

// This approach ensures that Reactotron is available globally without needing to import it in every file.
// @ts-ignore
console.tron = Reactotron;

export default reactotron;
