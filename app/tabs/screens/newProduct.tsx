import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native';
import React, { useContext } from 'react';
import { ThemeContext } from '@shared/context/ThemeContext';
import { Button } from '@components/Button';

export default function NewProduct() {
  const { colors } = useContext(ThemeContext);
  const window = Dimensions.get('window');
  const padCont = window.width > 600 ? 48 : 16;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: padCont,
      backgroundColor: colors.bg,
    },
    input: {
      marginBottom: 16,
      borderWidth: 2,
      borderColor: colors.text,
      borderRadius: 8,
      padding: 16,
      height: 56,
      color: colors.text,
    },
    label: {
      marginBottom: 8,
      color: colors.text,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre del Producto</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.text_muted}
        placeholder="Ej: Coca-Cola"
      />
      <Text style={styles.label}>Cantidad de Bultos</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.text_muted}
        placeholder="Ej: 10"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Unidades por Bulto</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.text_muted}
        placeholder="Ej: 12"
        keyboardType="numeric"
      />
      <Button text="Agregar Producto" onPress={() => {}} />
    </View>
  );
}
