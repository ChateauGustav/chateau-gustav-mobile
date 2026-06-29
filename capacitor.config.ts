import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.chateaugustav.pairing',
  appName: 'Château Gustav',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: '#f8f4ee',
      androidSplashResourceName: 'splash',
      showSpinner: false
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#f8f4ee'
    }
  }
};

export default config;
