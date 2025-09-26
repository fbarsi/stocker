import { ThemeProvider } from '@shared/ThemeContext';
import Root from '@app/root';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@shared/AuthContext';

export default function App() {
    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <AuthProvider>
                    <NavigationContainer>
                        <Root />
                    </NavigationContainer>
                </AuthProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}
