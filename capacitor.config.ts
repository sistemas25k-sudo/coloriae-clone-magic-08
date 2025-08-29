import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.e61e44b987b140fdbb39f79b7bc333df',
  appName: 'coloriae-clone-magic-45',
  webDir: 'dist',
  server: {
    url: 'https://e61e44b9-87b1-40fd-bb39-f79b7bc333df.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;