import { View, Text, TextInput, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useContext, useState } from 'react';
import { Button } from '@components';
import { useStyles } from '@utils/styles';
import { useManagementApi } from '@api/management';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '@shared/context/ThemeContext';

export default function NewItem() {
  const style = useStyles();
  const navigation = useNavigation();
  const api = useManagementApi();
  const queryClient = useQueryClient();
  const { colors } = useContext(ThemeContext);

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [units, setUnits] = useState('');

  const createItemMutation = useMutation({
    mutationFn: api.createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      navigation.goBack();
    },
    onError: (err) => Alert.alert('Error', err.message),
  });

  const handleCreate = () => {
    createItemMutation.mutate({
      itemName: name,
      sku: sku,
      description: description,
      unitsPerBundle: parseInt(units) || 1,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['bottom']}>
      <KeyboardAwareScrollView
        bottomOffset={160}
        contentContainerStyle={[style.container, { flexGrow: 1, flex: 0, justifyContent: 'flex-start' }]}
        keyboardShouldPersistTaps="handled"
        extraKeyboardSpace={-60}
      >
        <Text style={[style.title, { marginBottom: 20 }]}>Nuevo Artículo</Text>

        <Text style={style.text}>Nombre del Producto *</Text>
        <TextInput
          style={style.input}
          placeholder="Ej: Coca Cola 2.5L"
          placeholderTextColor={style.placeholder.color}
          value={name}
          onChangeText={setName}
        />

        <Text style={style.text}>SKU / Código (Opcional)</Text>
        <TextInput
          style={style.input}
          placeholder="Ej: 779123456"
          placeholderTextColor={style.placeholder.color}
          value={sku}
          onChangeText={setSku}
        />

        <Text style={style.text}>Unidades por Bulto *</Text>
        <TextInput
          style={style.input}
          placeholder="Ej: 6"
          placeholderTextColor={style.placeholder.color}
          value={units}
          onChangeText={setUnits}
          keyboardType="numeric"
        />

        <Text style={style.text}>Descripción (Opcional)</Text>
        <TextInput
          style={[style.input, { height: 100, textAlignVertical: 'top' }]}
          placeholder="Detalles del producto..."
          placeholderTextColor={style.placeholder.color}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <View style={{ flex: 1, justifyContent: 'flex-end', width: '100%' }}>
          {createItemMutation.isPending ? (
            <ActivityIndicator size="large" color={style.text.color} />
          ) : (
            <Button text="Guardar Artículo" onPress={handleCreate} disabled={!name.trim() || !units.trim()} />
          )}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
