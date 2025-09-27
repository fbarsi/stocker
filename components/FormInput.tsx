import { View, Text, TextInput, Pressable, StyleSheet, KeyboardTypeOptions } from 'react-native';
import React, { ChangeEvent, useState } from 'react';
import { useStyles } from '@utils/styles';
import { MaterialIcons } from '@expo/vector-icons';

interface FIProps {
  handleChange: (e: string | ChangeEvent<any>) => void;
  handleBlur: (e: any) => void;
  placeholder: string;
  error?: string | false | undefined;
  value: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  hideErrorBelow?: boolean;
}

export function FormInput(props: FIProps) {
  const {
    handleChange,
    handleBlur,
    placeholder,
    error,
    value,
    secureTextEntry = false,
    hideErrorBelow,
    keyboardType,
  } = props;
  const [showPass, setShowPass] = useState<boolean>(!secureTextEntry);
  const style = useStyles();

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={[style.inputContainer, error && style.errorInput]}>
        <TextInput
          secureTextEntry={!showPass}
          style={style.input}
          placeholder={placeholder}
          placeholderTextColor={style.placeholder.color}
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
              color={style.text.color}
            />
          </Pressable>
        )}
      </View>
      {!hideErrorBelow && <Text style={[style.error]}>{error}</Text>}
    </View>
  );
}
