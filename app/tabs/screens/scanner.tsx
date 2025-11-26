import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { useManagementApi } from '@api/management';
import { STACK_ROUTES, TAB_ROUTES } from '@utils/constants';

export default function ScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();
  const api = useManagementApi();

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    try {
      const product = await api.getItemBySku(data);
      
      navigation.navigate(STACK_ROUTES.NAV_STACK_TABS as any, {
        screen: TAB_ROUTES.PRODUCTS,
        params: { scannedProduct: product }
      } as any);
      setScanned(false);

    } catch (error) {
      Alert.alert("No encontrado", `No existe producto con código ${data}`, [
        { text: "OK", onPress: () => setScanned(false) }
      ]);
    }
  };

  if (hasPermission === null) return <View />;
  if (hasPermission === false) return <Text>Sin acceso a cámara</Text>;

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "ean8", "upc_a", "upc_e"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.overlay}>
        <View style={styles.scanFrame} />
        <Text style={styles.text}>Escanea un código de barras</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: 'black' },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  scanFrame: { width: 250, height: 250, borderWidth: 2, borderColor: '#FFF', borderRadius: 20, marginBottom: 20 },
  text: { color: 'white', fontSize: 16, fontWeight: 'bold', backgroundColor: '#00000080', padding: 8, borderRadius: 4 }
});