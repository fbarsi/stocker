interface colors {
    text: string;
    low_emphasis: string;
    background: string;
    primary: string;
    primary_variant: string;
    secondary: string;
    secondary_variant: string;
    error: string;
    on_primary: string;
}

const lightColors: colors = {
    text: '#000000de',
    low_emphasis: '#00000099',
    background: '#ffffffff',
    primary: '#263178ff',
    // primary: '#6200eeff',
    primary_variant: '#3700b3ff',
    secondary: '#03dac6ff',
    secondary_variant: '#018786ff',
    error: '#ff002fff',
    on_primary: '#ffffffff',
};

const darkColors: colors = {
    text: '#ffffffff',
    low_emphasis: '#ffffff61',
    // background: '#000000ff',
    background: '#202020ff',
    primary: '#c8c4ffff',
    // primary: '#5e53b1ff',
    // primary: '#7587ffff',
    // primary: '#bb86fcff',
    primary_variant: '#3700b3ff',
    secondary: '#03dac6ff',
    secondary_variant: '#03dac6ff',
    error: '#ff4f4fff',
    // error: '#cf6679ff',
    // error: '#b00020ff',
    on_primary: '#000000ff',
    // on_primary: '#ffffffff',
};

export { lightColors, darkColors, colors };
