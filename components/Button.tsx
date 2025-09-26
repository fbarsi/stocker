import { Pressable, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '@shared/ThemeContext';
import { useContext } from 'react';

interface IButton {
  text?: string;
  disabled?: boolean;
  onPress?: () => void;
}

export function Button({ text, disabled, onPress }: IButton) {
    const style = useStyles();
    return (
        <Pressable
        style={[style.button, disabled && style.disabled]}
        disabled={disabled}
        onPress={onPress}
        >
      <Text style={style.buttonText}>{text}</Text>
    </Pressable>
  );
}

const useStyles = () => {
  const { colors } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    button: {
      marginBottom: 10,
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    disabled: {
      backgroundColor: '#808080ff',
    },
    buttonText: {
      color: colors.on_primary,
      fontSize: 16,
      fontWeight: '900',
    },
  });

  return styles
};