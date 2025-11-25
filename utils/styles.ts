import { useContext } from 'react';
import { ThemeContext } from '@shared/context/ThemeContext';
import { Dimensions, StyleSheet } from 'react-native';
import { fonts } from './fonts';

export const useStyles = () => {
  const { colors, isDarkMode } = useContext(ThemeContext);
  const window = Dimensions.get('window');

  const style = StyleSheet.create({
    authContainer: {
      paddingHorizontal: window.width > 600 ? 160 : 30,
      paddingVertical: 60,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.bg,
    },
    container: {
      paddingHorizontal: window.width > 600 ? 160 : 20,
      paddingVertical: window.width > 600 ? 160 : 20,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.bg,
    },
    containerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      padding: 6,
      paddingLeft: 4,
      gap: 8,
    },
    card: {
      width: '100%',
      padding: 30,
      marginBottom: 20,
      borderRadius: 10,
      boxShadow: !isDarkMode ? '0px 4px 4px #00000030, 0px 12px 12px #00000015' : '',
      borderColor: colors.border,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? 'hsl(210, 30%, 45%)' : 'hsl(210, 30%, 100%)',
      borderWidth: 1,
      backgroundColor: colors.bg_light,
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
      marginBottom: 4,
    },
    error: {
      color: colors.error,
      fontSize: 12,
      marginBottom: 4,
    },
    input: {
      borderWidth: 2,
      borderColor: colors.text,
      borderRadius: 8,
      padding: 16,
      // height: 56,
      color: colors.text,
      width: '100%',
      marginBottom: 10,
    },
    errorInput: {
      borderColor: colors.error,
    },
    placeholder: {
      color: colors.text_muted,
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
