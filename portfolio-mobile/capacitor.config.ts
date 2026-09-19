import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'portoapp',
  webDir: 'dist',
  server: {
    cleartext: true
  }
};

export default config;
