import { View, Text, Dimensions, ActivityIndicator, FlatList } from 'react-native';
import React, { useState } from 'react';
import { Button, ButtonTheme, BranchCard } from '@components';
import { useStyles } from '@utils/styles';
import { useNavigation } from '@react-navigation/native';
import { STACK_ROUTES } from '@utils/constants';
import { AuthActionTypes } from '@shared/context/AuthContext';
import { useAuth } from '@shared/context/AuthContext/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useManagementApi } from '@api/management';
import { TextInput } from 'react-native';
import Onboarding from './onboarding';

export default function Home() {
  const style = useStyles();
  const navigation = useNavigation();
  const { state, dispatch } = useAuth();
  const api = useManagementApi();
  const queryClient = useQueryClient();
  const [companyName, setCompanyName] = useState('');

  const { data: userProfile, isLoading: loadingProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: api.getUserProfile,
  });

  const { data: branches, isLoading: loadingBranches } = useQuery({
    queryKey: ['branches'],
    queryFn: api.getBranches,
    enabled: !!userProfile?.company,
  });

  if (loadingProfile || loadingBranches) {
    return (
      <View style={[style.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={style.text.color} />
      </View>
    );
  }

  if (!userProfile?.company) {
    return <Onboarding />;
  }

  const isManager = userProfile?.role.role_name === 'Manager';

  if (branches && branches.length === 0) {
    return (
      <View style={style.container}>
        <View style={style.card}>
          <Text style={style.title}>{userProfile.company.companyName}</Text>
          <Text style={[style.text, { fontSize: 16.5, marginBottom: 30 }]}>
            ¡Empresa creada! Ahora registra tu primera sucursal.
          </Text>
          {isManager && (
            <Button
              text="Crear Primera Sucursal"
              onPress={() => navigation.navigate(STACK_ROUTES.NEW_BRANCH as never)}
            />
          )}
        </View>
        <ButtonTheme />
      </View>
    );
  }

  return (
    <View style={style.container}>
      <View style={{ width: '100%' }}>
        <FlatList
          data={branches}
          keyExtractor={(item) => item.branchId.toString()}
          renderItem={({ item }) => <BranchCard name={item.branchName} address={item.address} />}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <Text style={style.title}>{userProfile.company.companyName}</Text>
              <Button
                text="Ver catálogo"
                onPress={() => navigation.navigate(STACK_ROUTES.ITEMS_CATALOG as never)}
              />

              <Text style={[style.text, { fontSize: 18, fontWeight: 'bold', marginBottom: 15 }]}>
                Mis Sucursales
              </Text>
            </>
          }
          ListFooterComponent={() => (
            <>
              {isManager && (
                <View style={{ marginTop: 10 }}>
                  <Button
                    text="Crear otra sucursal"
                    onPress={() => navigation.navigate(STACK_ROUTES.NEW_BRANCH as never)}
                  />
                </View>
              )}
            </>
          )}
        />
      </View>
    </View>
  );
}
