export default {
  expo: {
    name: "drepadata",
    slug: "drepadata",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/android-icon-foreground.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png"
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      // SECURITY FIX: Use environment variable for API URL
      // Set EXPO_PUBLIC_API_URL in .env file
      // For local development: http://YOUR_LOCAL_IP:4000/api
      // For production: https://your-api-domain.com/api
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api',
    },
  }
};

