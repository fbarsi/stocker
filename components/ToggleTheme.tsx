import React, { useContext, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Animated, {
    useSharedValue,
    withTiming,
    Easing,
    useAnimatedProps,
} from 'react-native-reanimated';
import Svg, { Circle, Rect } from 'react-native-svg';
import { ThemeContext } from '@shared/ThemeContext';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

const ButtonTheme = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const progress = useSharedValue(isDarkMode ? 1 : 0);
    const [newValue, setNewValue] = useState(isDarkMode)

    // agregar un drawer con boton provisional para cambiar de tema

    const toggle = () => {
        setNewValue(!newValue)
        progress.value = withTiming(newValue ? 0 : 1, {
            duration: 400,
            easing: Easing.inOut(Easing.cubic),
        });
        setTimeout(() => {
            toggleTheme();
        }, 150);
    };

    const mainCircleAnimatedProps = useAnimatedProps(() => {
        const radius = 24 + progress.value * 51;
        return {
            r: radius,
        };
    });

    const sunMoonAnimatedProps = useAnimatedProps(() => {
        const radius = 16 - progress.value * 6;
        const cx = 64 - progress.value * 14;
        const cy = 36 + progress.value * 14;
        return {
            r: radius,
            cx: cx,
            cy: cy,
        };
    });

    const rayAnimatedProps = useAnimatedProps(() => {
        const opacity = progress.value ** 3;
        return {
            opacity: opacity,
        };
    });

    return (
        <View>
            <TouchableOpacity onPress={toggle} activeOpacity={1}>
                <Svg width={100} height={100} viewBox="0 0 100 100">
                    <AnimatedCircle
                        cx={50}
                        cy={50}
                        fill={'#202020ff'}
                        animatedProps={mainCircleAnimatedProps}
                    />

                    <AnimatedRect
                        x={26}
                        y={48.5}
                        width={9}
                        height={3}
                        fill={'white'}
                        animatedProps={rayAnimatedProps}
                    />
                    <AnimatedRect
                        x={65}
                        y={48.5}
                        width={9}
                        height={3}
                        fill={'white'}
                        animatedProps={rayAnimatedProps}
                    />
                    <AnimatedRect
                        x={48.5}
                        y={26}
                        width={3}
                        height={9}
                        fill={'white'}
                        animatedProps={rayAnimatedProps}
                    />
                    <AnimatedRect
                        x={48.5}
                        y={65}
                        width={3}
                        height={9}
                        fill={'white'}
                        animatedProps={rayAnimatedProps}
                    />
                    <AnimatedRect
                        x="34.0901"
                        y="31.9688"
                        width="9"
                        height="3"
                        transform="rotate(45 34.0901 31.9688)"
                        fill={'white'}
                        animatedProps={rayAnimatedProps}
                    />
                    <AnimatedRect
                        x="61.6673"
                        y="59.5459"
                        width="9"
                        height="3"
                        transform="rotate(45 61.6673 59.5459)"
                        fill={'white'}
                        animatedProps={rayAnimatedProps}
                    />
                    <AnimatedRect
                        x="59.5459"
                        y="38.3327"
                        width="9"
                        height="3"
                        transform="rotate(-45 59.5459 38.3327)"
                        fill={'white'}
                        animatedProps={rayAnimatedProps}
                    />
                    <AnimatedRect
                        x="31.9688"
                        y="65.9099"
                        width="9"
                        height="3"
                        transform="rotate(-45 31.9688 65.9099)"
                        fill={'white'}
                        animatedProps={rayAnimatedProps}
                    />

                    <AnimatedCircle fill={'white'} animatedProps={sunMoonAnimatedProps} />
                </Svg>
            </TouchableOpacity>
        </View>
    );
};

export {ButtonTheme};
