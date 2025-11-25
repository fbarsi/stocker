import { View, Text, TextInput, Pressable, StyleSheet, KeyboardTypeOptions } from 'react-native';
import React, { ChangeEvent, useContext, useState } from 'react';
import { useStyles } from '@utils/styles';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemeContext } from '@shared/context/ThemeContext';

interface FIProps {
  handleChange: (e: string | ChangeEvent<any>) => void;
  handleBlur: (e: any) => void;
  placeholder: string;
  error?: string | false | undefined;
  value: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
}

export function FormInput(props: FIProps) {
  const {
    handleChange,
    handleBlur,
    placeholder,
    error,
    value,
    secureTextEntry = false,
    keyboardType,
  } = props;
  const [showPass, setShowPass] = useState<boolean>(!secureTextEntry);
  const { colors } = useContext(ThemeContext);

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={[styles.inputContainer, {borderColor: error ? colors.error : colors.text}]}>
        <TextInput
          secureTextEntry={!showPass}
          style={[styles.input, {color: colors.text}]}
          placeholder={placeholder}
          placeholderTextColor={colors.text_muted}
          onChangeText={handleChange}
          onBlur={handleBlur}
          value={value}
          keyboardType={keyboardType}
        />
        {secureTextEntry && (
          <Pressable onPress={() => setShowPass(!showPass)} style={{ padding: 16 }}>
            <MaterialIcons
              name={showPass ? 'visibility-off' : 'visibility'}
              size={20}
              color={colors.text}
            />
          </Pressable>
        )}
      </View>
      <Text style={[styles.error, {color: colors.error}]}>{error}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 0,
      borderWidth: 2,
      borderRadius: 8,
    },
    input: {
      flex: 1,
      padding: 16,
      height: 56,
    },
    error: {
      fontSize: 12,
      marginBottom: 4,
    },
})