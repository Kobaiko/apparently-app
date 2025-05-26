// Minimal polyfills for Supabase in React Native
import 'react-native-url-polyfill/auto';

// Only add TextEncoder/TextDecoder if needed
if (typeof global.TextEncoder === 'undefined') {
  const textEncoding = require('text-encoding');
  global.TextEncoder = textEncoding.TextEncoder;
  global.TextDecoder = textEncoding.TextDecoder;
}

// Export to ensure module is processed
export default {}; 