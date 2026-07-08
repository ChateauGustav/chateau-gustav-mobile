/** @type {import('@capacitor/cli').CapacitorConfig} */
const config = {
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

module.exports = config;
