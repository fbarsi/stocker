import { Text, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { Button } from '@components';
import { useStyles } from '@utils/styles';
import { useManagementApi } from '@api/management';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { AuthActionTypes } from '@shared/context/AuthContext';
import { useAuth } from '@shared/context/AuthContext/AuthContext';
import { STACK_ROUTES } from '@utils/constants';

export default function CreateCompany() {
  const style = useStyles();
  const navigation = useNavigation();
  const api = useManagementApi();
  const { state, dispatch } = useAuth();
  const queryClient = useQueryClient();

  const [companyName, setCompanyName] = useState('');

  const createCompanyMutation = useMutation({
    mutationFn: api.createCompany,
    onSuccess: (data) => {
      dispatch({
        type: AuthActionTypes.REFRESH_TOKEN_SUCCESS,
        payload: { accessToken: data.accessToken, refreshToken: state.refreshToken },
      });

      queryClient.invalidateQueries({ queryKey: ['userProfile'] });

      navigation.reset({
        index: 0,
        routes: [{ name: STACK_ROUTES.NEW_BRANCH as never, params: { fromOnboarding: true } }],
      });
    },
    onError: (err) => Alert.alert('Error', err.message),
  });

  return (
    <KeyboardAwareScrollView
      bottomOffset={20}
      contentContainerStyle={[style.container, { flexGrow: 1, justifyContent: 'center' }]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={style.title}>Nombre de tu Empresa</Text>
      <Text style={[style.text, { marginBottom: 20, textAlign: 'center' }]}>
        Este será el nombre visible para tus empleados.
      </Text>

      <TextInput
        style={[
          style.input,
          { width: '100%', marginBottom: 15, borderWidth: 1, borderColor: style.text.color, borderRadius: 8 },
        ]}
        placeholder="Ej: Mi Negocio S.A."
        placeholderTextColor={style.placeholder.color}
        value={companyName}
        onChangeText={setCompanyName}
      />

      <Button
        text={createCompanyMutation.isPending ? 'Creando...' : 'Continuar'}
        onPress={() => createCompanyMutation.mutate({ companyName })}
        disabled={!companyName.trim() || createCompanyMutation.isPending}
      />
    </KeyboardAwareScrollView>
  );
}
