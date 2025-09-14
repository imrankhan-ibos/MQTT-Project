/**
 * @format
 */
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Polyfills for mqtt.js
import 'react-native-get-random-values';
import { Buffer } from 'buffer';
import process from 'process';

global.Buffer = Buffer;
global.process = process;

function Root() {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
}

AppRegistry.registerComponent(appName, () => Root);
