import { ThemeProvider } from '@shared/context/ThemeContext';
import Root from '@app/root';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@shared/context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import * as SplashScreen from 'expo-splash-screen';

const queryClient = new QueryClient();

// SplashScreen.preventAutoHideAsync();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <ThemeProvider>
            <AuthProvider>
              <NavigationContainer>
                <Root />
              </NavigationContainer>
            </AuthProvider>
          </ThemeProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
