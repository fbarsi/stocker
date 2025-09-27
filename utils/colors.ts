interface colors {
    text: string;
    low_emphasis: string;
    background: string;
    primary: string;
    secondary: string;
    error: string;
    on_primary: string;
}

const lightColors: colors = {
    text: '#1e1e1e',
    low_emphasis: '#8a9295',
    background: '#ffffff',
    primary: '#f18a2f',
    secondary: '#24ade5',
    error: '#f10000',
    on_primary: '#ffffff',
};

const darkColors: colors = {
    text: '#ffffff',
    low_emphasis: '#8a9295',
    background: '#0b1014',
    primary: '#f18c79',
    secondary: '#a1d9f5',
    error: '#f10000',
    on_primary: '#ffffff',
};

export { lightColors, darkColors, colors };
