import { useContext } from 'react';
import { ThemeContext } from '@shared/ThemeContext';
import { Dimensions, StyleSheet } from 'react-native';
import { fonts } from './fonts';

export const useStyles = () => {
  const { colors } = useContext(ThemeContext);
  const window = Dimensions.get('window');

  const style = StyleSheet.create({
    container: {
      padding: window.width > 600 ? 160 : 65,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    containerRow: {
      flexDirection: 'row',
      alignItems: 'center',
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
    input: {
      flex: 1,
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
    onPrimary: {
      color: colors.on_primary,
    },
    homeButtonText: {
      color: colors.on_primary,
      fontSize: window.width > 600 ? 30 : 20,
      fontWeight: '700',
      flex: 1,
    },
  });

  return style;
};
