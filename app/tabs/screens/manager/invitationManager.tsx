import { View, Text, TextInput, FlatList, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { Button } from '@components';
import { useStyles } from '@utils/styles';
import { useManagementApi, Invitation, InvitationStatus } from '@api/management';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ThemeContext } from '@shared/context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';

export default function InvitationsManager() {
  const style = useStyles();
  const { colors } = useContext(ThemeContext);
  const api = useManagementApi();
  const queryClient = useQueryClient();

  const [emailToInvite, setEmailToInvite] = useState('');
  const [search, setSearch] = useState('');

  const { data: branches } = useQuery({ queryKey: ['branches'], queryFn: api.getBranches });

  const { data: invitations, isLoading } = useQuery({
    queryKey: ['sentInvitations'],
    queryFn: api.getSentInvitations,
  });

  const sendInviteMutation = useMutation({
    mutationFn: api.createInvitation,
    onSuccess: () => {
      Alert.alert('¡Enviada!', `Invitación enviada a ${emailToInvite}`);
      setEmailToInvite('');
      queryClient.invalidateQueries({ queryKey: ['sentInvitations'] });
    },
    onError: (err) => Alert.alert('Error', err.message),
  });

  const handleSend = () => {
    if (!branches || branches.length === 0) {
      Alert.alert('Error', 'No tienes sucursales creadas para invitar.');
      return;
    }
    const defaultBranchId = branches[0].branchId;

    sendInviteMutation.mutate({
      employeeEmail: emailToInvite,
      branchId: defaultBranchId,
    });
  };

  const filteredInvitations = invitations?.filter((inv) =>
    inv.employeeEmail.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: InvitationStatus) => {
    switch (status) {
      case InvitationStatus.ACCEPTED:
        return '#4CAF50';
      case InvitationStatus.DECLINED:
        return '#F44336';
      default:
        return '#FFC107';
    }
  };

  const renderItem = ({ item }: { item: Invitation }) => (
    <View style={[localStyles.card, { borderColor: colors.border, backgroundColor: colors.bg_light }]}>
      <Text style={[style.text, { fontWeight: 'bold', fontSize: 14, flex: 1 }]} numberOfLines={1}>
        {item.employeeEmail}
      </Text>
      <View style={[localStyles.badge, { backgroundColor: getStatusColor(item.status) }]}>
        <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={[style.container, { paddingHorizontal: 20 }]}>
      <View style={{ marginBottom: 25, marginTop: 20, width: '100%', alignItems: 'center' }}>
        <Text style={[style.title, { fontSize: 20, marginBottom: 10 }]}>Invitar Empleado</Text>

        <TextInput
          style={[
            style.input,
            { borderWidth: 1, borderColor: colors.border, borderRadius: 8, marginBottom: 10 },
          ]}
          placeholder="Email del empleado"
          placeholderTextColor={style.placeholder.color}
          value={emailToInvite}
          onChangeText={setEmailToInvite}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Button
          text={sendInviteMutation.isPending ? 'Enviando...' : 'Enviar Invitación'}
          onPress={handleSend}
          disabled={!emailToInvite.trim() || sendInviteMutation.isPending || !branches}
        />
        {!branches && <Text style={{ color: 'red', fontSize: 12 }}>Cargando sucursales...</Text>}
      </View>

      <View style={{ height: 1, backgroundColor: colors.border, marginBottom: 20 }} />

      <Text style={[style.title, { fontSize: 20, marginBottom: 10 }]}>Historial</Text>

      <View
        style={[
          localStyles.searchContainer,
          { backgroundColor: colors.bg_light, borderColor: colors.border },
        ]}
      >
        <MaterialIcons name="search" size={24} color={colors.text_muted} />
        <TextInput
          style={{ flex: 1, padding: 10, color: colors.text }}
          placeholder="Buscar por email..."
          placeholderTextColor={colors.text_muted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.text} />
      ) : (
        <FlatList
          data={filteredInvitations}
          keyExtractor={(item) => item.invitationId.toString()}
          renderItem={renderItem}
          style={{ width: '100%' }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={[style.text, { textAlign: 'center', marginTop: 20, opacity: 0.5 }]}>
              Sin invitaciones.
            </Text>
          }
        />
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 25,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderWidth: 1,
  },
});
