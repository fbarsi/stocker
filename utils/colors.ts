interface colors {
    text: string;
    text_muted: string;
    bg_dark: string;
    bg: string;
    bg_light: string;
    primary: string;
    secondary: string;
    error: string;
    on_primary: string;
    border: string;
}

const lightColors: colors = {
    text:       'hsl(0, 0%, 5%)',
    text_muted: 'hsl(0, 0%, 30%)',
    bg_dark:    'hsl(210, 30%, 90%)',
    bg:         'hsl(210, 30%, 95%)',
    bg_light:   'hsl(210, 30%, 100%)',
    primary:    'hsl(210 100% 36%)',
    secondary:  'hsl(198, 79%, 52%)',
    error:      'hsl(0, 100%, 47%)',
    on_primary: 'hsl(0, 0%, 100%)',
    border:     'hsl(210, 30%, 100%)',
};

const darkColors: colors = {
    text:       'hsl(0, 0%, 95%)',
    text_muted: 'hsl(0, 0%, 70%)',
    bg_dark:    'hsl(210, 30%, 0%)',
    bg:         'hsl(210, 30%, 5%)',
    bg_light:   'hsl(210, 30%, 10%)',
    primary:    'hsl(210 100% 36%)',
    secondary:  'hsl(200, 79%, 79%)',
    error:      'hsl(0, 100%, 47%)',
    on_primary: 'hsl(0, 0%, 100%)',
    border:     'hsl(210, 30%, 30%)'
};

export { lightColors, darkColors, colors };
