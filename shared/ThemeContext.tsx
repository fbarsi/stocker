import { createContext, ReactNode, useState } from 'react';
import { lightColors, darkColors, colors } from '@utils/colors';

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

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    const value = {
        isDarkMode,
        toggleTheme,
        colors: isDarkMode ? darkColors : lightColors,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
