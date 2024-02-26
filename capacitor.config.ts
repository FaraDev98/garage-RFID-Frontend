import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.garagerfid',
  appName: 'garage RFID',
  webDir: 'build',
  server: {
    androidScheme: 'http'

  }
};

export default config;
