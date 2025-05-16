import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AuthProvider } from './_context/AuthContext';

import 'react-native-reanimated';
import { AppProvider } from './_context/AppContext';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Sora: require('../assets/fonts/Sora-Regular.ttf'),
    SoraBold: require('../assets/fonts/Sora-Bold.ttf')
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <AuthProvider>
        <AppProvider>
          <Stack initialRouteName='index'>
            <Stack.Screen name="index" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="signup/index" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="login/index" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="welcome/index" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="prefrence/index" options={{ headerShown: false, gestureEnabled: false }} />

            <Stack.Screen name="terms/index" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="kyc/index" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="vehiclekyc/index" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="licensekyc/index" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="setup/index" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="notifications/index" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="find/index" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="postride/index" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="ridelist/index" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="driverdetails/index" options={{ headerShown: false, gestureEnabled: false }} />

            <Stack.Screen name="messages/index" options={{
              headerShown: false,
              gestureEnabled: false,
            }} />
            <Stack.Screen name="ride/[id]" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="myridedetails/[id]" options={{ headerShown: false, gestureEnabled: false }} />

            <Stack.Screen name="wallet/index" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="depositfromcrypto/index" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="depositfromfiat/index" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="ridehistory/index" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="unclaimed/index" options={{ headerShown: false, gestureEnabled: false }} />
            
            <Stack.Screen name="(tabs)" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
