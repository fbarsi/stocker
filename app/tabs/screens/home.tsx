import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import React, { useContext } from 'react';
import { Button, ButtonTheme, BranchCard } from '@components';
import { useStyles } from '@utils/styles';
import { useNavigation } from '@react-navigation/native';
import { STACK_ROUTES } from '@utils/constants';
import { useAuth } from '@shared/context/AuthContext/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { useManagementApi } from '@api/management';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemeContext } from '@shared/context/ThemeContext';
import Onboarding from './onboarding';

export default function Home() {
  const style = useStyles();
  const navigation = useNavigation();
  const { state } = useAuth();
  const api = useManagementApi();
  const { colors } = useContext(ThemeContext);

  const { data: userProfile, isLoading: loadingProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: api.getUserProfile,
  });

  const { data: branches, isLoading: loadingBranches } = useQuery({
    queryKey: ['branches'],
    queryFn: api.getBranches,
    enabled: !!userProfile?.company && userProfile?.role?.role_name === 'Manager',
  });

  if (loadingProfile || (userProfile?.role?.role_name === 'Manager' && loadingBranches)) {
    return (
      <View style={[style.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={style.text.color} />
      </View>
    );
  }

  if (!userProfile?.company) {
    return <Onboarding />;
  }

  const isManager = userProfile?.role?.role_name === 'Manager';

  if (isManager && branches && branches.length === 0) {
    return (
      <View style={style.container}>
        <View style={style.card}>
          <Text style={style.title}>{userProfile.company.companyName}</Text>
          <Text style={[style.text, { fontSize: 16.5, marginBottom: 30 }]}>
            ¡Empresa creada! Ahora registra tu primera sucursal.
          </Text>
          <Button
            text="Crear Primera Sucursal"
            onPress={() => navigation.navigate(STACK_ROUTES.NEW_BRANCH as never)}
          />
        </View>
        <ButtonTheme />
      </View>
    );
  }

  const renderHeader = () => (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <View>
          <Text style={style.title}>{userProfile.company.companyName}</Text>
        </View>
        <ButtonTheme />
      </View>

      <View style={{ marginBottom: 20, width: '100%', alignItems: 'center' }}>
        {isManager && (
          <Button
            text="Gestionar Invitaciones"
            onPress={() => navigation.navigate(STACK_ROUTES.INVITATIONS_MANAGER as never)}
          />
        )}
        <Button
          text="Ver catálogo"
          onPress={() => navigation.navigate(STACK_ROUTES.ITEMS_CATALOG as never)}
        />
      </View>
    </View>
  );

  if (!isManager) {
    const assignedBranch = userProfile.branch;

    return (
      <View
        style={[
          style.container,
          { paddingHorizontal: 20, paddingTop: 20, justifyContent: 'flex-start', width: '100%' },
        ]}
      >
        {renderHeader()}

        {assignedBranch ? (
          <View
            style={[
              localStyles.employeeCard,
              { backgroundColor: colors.bg_light, borderColor: colors.border },
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, width: '100%' }}>
              <View style={{ marginLeft: 15, flex: 1 }}>
                <Text style={[style.text, { fontSize: 18, fontWeight: 'bold' }]}>
                  {assignedBranch.branchName}
                </Text>
                <Text style={[style.text, { fontSize: 14, opacity: 0.7, marginTop: 4 }]}>
                  {assignedBranch.address || 'Sin dirección registrada'}
                </Text>
              </View>
              <View style={[localStyles.iconContainer, { backgroundColor: 'rgba(0,0,0,0.05)' }]}>
                <MaterialIcons name="store" size={32} color={colors.primary} />
              </View>
            </View>

            <View>
              <Button
                text="Ver inventario"
                onPress={() => {
                  (navigation as any).navigate(STACK_ROUTES.INVENTORY, {
                    branchId: assignedBranch.branchId,
                    branchName: assignedBranch.branchName,
                  });
                }}
              />
            </View>
          </View>
        ) : (
          <View style={style.card}>
            <Text style={style.text}>No tienes una sucursal asignada.</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={[style.container, { paddingHorizontal: 20, paddingTop: 20 }]}>
      <FlatList
        data={branches}
        keyExtractor={(item) => item.branchId.toString()}
        ListHeaderComponent={() => (
          <>
            {renderHeader()}

            <Text style={[style.text, { fontSize: 18, fontWeight: 'bold', marginBottom: 15 }]}>
              Mis Sucursales
            </Text>
          </>
        )}
        renderItem={({ item }) => <BranchCard name={item.branchName} address={item.address} />}
        showsVerticalScrollIndicator={false}
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListFooterComponent={() => (
          <View style={{ gap: 10, marginTop: 10 }}>
            <Button
              text="Crear otra sucursal"
              onPress={() => navigation.navigate(STACK_ROUTES.NEW_BRANCH as never)}
            />
          </View>
        )}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  employeeCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 12,
  },
});
