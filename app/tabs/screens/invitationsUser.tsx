import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import React, { useContext } from 'react';
import { Button } from '@components';
import { useStyles } from '@utils/styles';
import { useManagementApi, Invitation } from '@api/management';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ThemeContext } from '@shared/context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { STACK_ROUTES, TAB_ROUTES } from '@utils/constants';
import { useAuth } from '@shared/context/AuthContext/AuthContext';
import { refreshTokenApiCall } from '@api/auth';
import { setTokens } from '@shared/context/AuthContext/secure-store';
import { AuthActionTypes } from '@shared/context/AuthContext';

export default function InvitationsUser() {
  const style = useStyles();
  const { colors } = useContext(ThemeContext);
  const api = useManagementApi();
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const { state, dispatch } = useAuth();

  const { data: invitations, isLoading } = useQuery({
    queryKey: ['receivedInvitations'],
    queryFn: api.getReceivedInvitations,
  });

  const respondMutation = useMutation({
    mutationFn: ({ id, action }: { id: number; action: 'accept' | 'decline' }) =>
      api.respondToInvitation(id, action),
    onSuccess: async (_, variables) => {
      if (variables.action === 'accept') {
        try {
          const newTokens = await refreshTokenApiCall(state.refreshToken!);
          await setTokens(newTokens.accessToken, newTokens.refreshToken);
          dispatch({
            type: AuthActionTypes.REFRESH_TOKEN_SUCCESS,
            payload: {
              accessToken: newTokens.accessToken,
              refreshToken: newTokens.refreshToken,
            },
          });

          await queryClient.invalidateQueries({ queryKey: ['userProfile'] });
          navigation.navigate(STACK_ROUTES.NAV_STACK_TABS as never);
        } catch (error) {
          console.error('Error refrescando token:', error);
          Alert.alert('Sesión expirada', 'Por favor inicia sesión nuevamente para ver los cambios.');
          dispatch({ type: AuthActionTypes.LOGOUT });
        }
      } else {
        Alert.alert('Invitación rechazada');
        queryClient.invalidateQueries({ queryKey: ['receivedInvitations'] });
      }
    },
    onError: (err) => Alert.alert('Error', err.message),
  });

  const renderItem = ({ item }: { item: Invitation }) => (
    <View style={[localStyles.card, { backgroundColor: colors.bg_light, borderColor: colors.border }]}>
      <Text style={[style.text, { fontSize: 18, fontWeight: 'bold', marginBottom: 10 }]}>
        {item.company?.companyName || 'Empresa'}
      </Text>

      <View style={{ marginBottom: 15 }}>
        <Text style={[style.text, { opacity: 0.8 }]}>
          Sucursal: <Text style={{ fontWeight: 'bold' }}>{item.branch?.branchName}</Text>
        </Text>
        <Text style={[style.text, { opacity: 0.8 }]}>
          Manager: <Text style={{ fontWeight: 'bold' }}>{item.manager?.email}</Text>
        </Text>
      </View>

      <View style={localStyles.buttonRow}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Button
            text="Rechazar"
            onPress={() => respondMutation.mutate({ id: item.invitationId, action: 'decline' })}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            text="Aceptar"
            onPress={() => respondMutation.mutate({ id: item.invitationId, action: 'accept' })}
          />
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[style.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  return (
    <View style={[style.container, { padding: 20 }]}>
      <Text style={[style.title, { marginBottom: 20 }]}>Invitaciones Pendientes</Text>
      <FlatList
        data={invitations}
        keyExtractor={(item) => item.invitationId.toString()}
        renderItem={renderItem}
        style={{ width: '100%' }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={[style.text, { textAlign: 'center', marginTop: 50 }]}>No tienes invitaciones.</Text>
        }
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
