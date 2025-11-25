import { createContext, ReactNode, useState, useEffect } from 'react';
import { lightColors, darkColors, colors } from '@utils/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;
    colors: colors;
}

export const ThemeContext = createContext<ThemeContextType>({
    isDarkMode: true,
    toggleTheme: () => {},
    colors: darkColors,
});

const THEME_KEY = '@theme_mode';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
    const [isReady, setIsReady] = useState<boolean>(false);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const storedTheme = await AsyncStorage.getItem(THEME_KEY);
                if (storedTheme !== null) {
                    setIsDarkMode(storedTheme === 'dark');
                }
            } catch (e) {
                console.error('Failed to load theme:', e);
            } finally {
                setIsReady(true);
            }
        };
        loadTheme();
    }, []);

    const toggleTheme = async () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        try {
            await AsyncStorage.setItem(THEME_KEY, newMode ? 'dark' : 'light');
        } catch (e) {
            console.error('Failed to save theme:', e);
        }
    };

    if (!isReady) {
        return null;
    }

    const value = {
        isDarkMode,
        toggleTheme,
        colors: isDarkMode ? darkColors : lightColors,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};