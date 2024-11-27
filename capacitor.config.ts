import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.julio.panoramapp',
  appName: 'PanoramApp',
  webDir: 'www',
  bundledWebRuntime: false,
  android: {
    path: 'android',
  },
};

export default config;