import React, { useContext, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedProps,
  ReduceMotion,
} from 'react-native-reanimated';
import Svg, { Circle, Rect } from 'react-native-svg';
import { ThemeContext } from '@shared/context/ThemeContext';
import { disp, dispRotated, raysConfig } from './rayConfig';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

const ButtonTheme = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const progress = useSharedValue(isDarkMode ? 1 : 0);
  const [newValue, setNewValue] = useState(isDarkMode);

  const toggle = () => {
    setNewValue(!newValue);
    progress.value = withTiming(newValue ? 0 : 1, {
      duration: 300,
      easing: Easing.inOut(Easing.cubic),
      reduceMotion: ReduceMotion.Never,

    });
    setTimeout(() => {
      toggleTheme();
    }, 120);
  };

  const mainCircleAnimatedProps = useAnimatedProps(() => {
    return {
      r: 24 + progress.value * 40,
    };
  });

  const sunMoonAnimatedProps = useAnimatedProps(() => {
    return {
      r: 16 - progress.value * 8,
      cx: 64 - progress.value * 14,
      cy: 36 + progress.value * 14,
    };
  });

  const rayAnimatedPropsList = raysConfig.map((ray) =>
    useAnimatedProps(() => {
      return {
        x: ray.initialX + (!ray.rotated ? progress.value * -disp : 0),
        y: ray.initialY + (!ray.rotated ? progress.value * disp : progress.value * dispRotated),
        opacity: progress.value ** 2,
      };
    })
  );

  return (
    <View>
      <TouchableOpacity onPress={toggle} activeOpacity={1}>
        <Svg width={100} height={100} viewBox="0 0 100 100">
          <AnimatedCircle cx={50} cy={50} fill={'hsl(210, 30%, 5%)'} animatedProps={mainCircleAnimatedProps} />

          {raysConfig.map((ray, index) => (
            <AnimatedRect
              key={index}
              width={ray.width}
              height={ray.height}
              fill='hsl(210, 30%, 95%)'
              transform={ray.rotated ? `rotate(45)` : undefined}
              animatedProps={rayAnimatedPropsList[index]}
            />
          ))}

          <AnimatedCircle fill={'hsl(210, 30%, 95%)'} animatedProps={sunMoonAnimatedProps} />
        </Svg>
      </TouchableOpacity>
    </View>
  );
};

export { ButtonTheme };
