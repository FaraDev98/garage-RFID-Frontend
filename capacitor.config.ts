import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.garagerfid',
  appName: 'garage RFID',
  webDir: 'build',
  server: {
    androidScheme: 'http'

  },
  plugins: {
    "BluetoothLe": {
      "displayStrings": {
        "scanning": "Scanning...",
        "cancel": "Cancel",
        "availableDevices": "Available devices",
        "noDeviceFound": "No device found"
      }
    }
  }
}

export default config;
