import { useContext } from 'react';
import { ThemeContext } from '@shared/ThemeContext';
import { StyleSheet } from 'react-native';
import { fonts } from './fonts';

export const useStyles = () => {
  const { colors } = useContext(ThemeContext);

  const style = StyleSheet.create({
    container: {
      padding: 65,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    containerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      marginBottom: 4,
      padding: 4,
      gap: 8,
    },
    divider: {
      height: 12,
    },
    title: {
      fontFamily: fonts.montserratMedium,
      fontSize: 24,
      marginBottom: 15,
      color: colors.text,
    },
    text: {
      color: colors.text,
    },
    error: {
      color: colors.error,
      fontSize: 12,
      marginBottom: 4,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 0,
      borderWidth: 2,
      borderColor: colors.text,
      borderRadius: 8,
    },
    input2: {
      flex: 1,
      padding: 16,
      height: 56,
      color: colors.text,
    },
    input: {
      marginBottom: 1,
      borderWidth: 2,
      borderColor: colors.text,
      borderRadius: 8,
      padding: 16,
      height: 56,
      color: colors.text,
    },
    errorInput: {
      borderColor: colors.error,
    },
    placeholder: {
      color: colors.low_emphasis,
    },
  });

  return style;
};
