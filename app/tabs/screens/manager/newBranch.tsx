import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, ButtonTheme } from '@components';
import { useStyles } from '@utils/styles';
import { useManagementApi } from '@api/management';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

export default function NewBranch() {
  const style = useStyles();
  const navigation = useNavigation();
  const api = useManagementApi();
  const queryClient = useQueryClient();

  const [branchName, setBranchName] = useState('');
  const [branchAddress, setBranchAddress] = useState('');

  const [region, setRegion] = useState({
    latitude: -34.6037,
    longitude: -58.3816,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [markerPosition, setMarkerPosition] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'Necesitamos tu ubicación para mostrar el mapa.');
          setIsLoadingLocation(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
        setMarkerPosition({ latitude: location.coords.latitude, longitude: location.coords.longitude });
      } catch (error) {
        console.log('Error obteniendo ubicación', error);
      } finally {
        setIsLoadingLocation(false);
      }
    })();
  }, []);

  const handleMapPress = async (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerPosition({ latitude, longitude });

    try {
      const addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (addressResponse.length > 0) {
        const addr = addressResponse[0];
        const street = addr.street || '';
        const number = addr.streetNumber || '';
        const city = addr.city || addr.subregion || '';

        const fullAddress = [street, number, city].filter(Boolean).join(', ');
        setBranchAddress(fullAddress);
      }
    } catch (error) {
      console.log('Error reverse geocoding:', error);
    }
  };

  const handleSearchAddress = async () => {
    if (!branchAddress.trim()) return;

    try {
      const geocodedLocation = await Location.geocodeAsync(branchAddress);

      if (geocodedLocation.length > 0) {
        const { latitude, longitude } = geocodedLocation[0];
        setRegion({ ...region, latitude, longitude });
        setMarkerPosition({ latitude, longitude });
      } else {
        Alert.alert('No encontrada', 'No pudimos ubicar esa dirección.');
      }
    } catch (error) {
      Alert.alert('Error', 'Problema al buscar la dirección.');
    }
  };

  const createBranchMutation = useMutation({
    mutationFn: api.createBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      Alert.alert('¡Éxito!', 'Sucursal creada correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    },
    onError: (err) => Alert.alert('Error', err.message),
  });

  return (
    <KeyboardAwareScrollView
      bottomOffset={400}
      contentContainerStyle={[style.container, { flexGrow: 1, flex: 0, justifyContent: 'flex-start' }]}
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
      extraKeyboardSpace={-20}
    >
        <View style={{ width: '100%' }}>
          <Text style={style.title}>Nueva Sucursal</Text>
          <Text style={[style.text, { marginBottom: 20 }]}>
            Indica el nombre y la ubicación de la sucursal.
          </Text>

          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={[style.input, styles.inputMargin]}
            placeholder="Ej: Casa Central"
            placeholderTextColor={style.placeholder.color}
            value={branchName}
            onChangeText={setBranchName}
          />

          <Text style={styles.label}>Dirección</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 15 }}>
            <TextInput
              style={[style.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Escribe o toca el mapa"
              placeholderTextColor={style.placeholder.color}
              value={branchAddress}
              onChangeText={setBranchAddress}
            />
            <TouchableOpacity
              onPress={handleSearchAddress}
              style={{
                backgroundColor: style.text.color,
                justifyContent: 'center',
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderRadius: 8,
              }}
            >
              <MaterialCommunityIcons name="magnify" size={24} color={style.card.backgroundColor} />
            </TouchableOpacity>
          </View>

          <View style={styles.mapContainer}>
            {isLoadingLocation ? (
              <ActivityIndicator size="large" color={style.text.color} style={{ marginTop: 120 }} />
            ) : (
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={region}
                onRegionChangeComplete={setRegion}
                onPress={handleMapPress}
                showsUserLocation={true}
                showsMyLocationButton={true}
              >
                {markerPosition && <Marker coordinate={markerPosition} />}
              </MapView>
            )}
          </View>

          <Button
            text={createBranchMutation.isPending ? 'Guardando...' : 'Crear Sucursal'}
            onPress={() => createBranchMutation.mutate({ branchName: branchName, address: branchAddress })}
            disabled={!branchName.trim() || createBranchMutation.isPending}
          />
        </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    height: 290,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  inputMargin: {
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    opacity: 0.7,
  },
});
