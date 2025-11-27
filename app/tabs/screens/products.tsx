import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

import { ThemeContext } from '@shared/context/ThemeContext';
import { useManagementApi, InventoryItem, MovementType, Branch, Item } from '@api/management';

import { Button } from '@components/Button';
import { StockAdjustmentModal } from '@components/StockAdjustmentModal';
import { STACK_ROUTES } from '@utils/constants';

import { RefreshControl } from 'react-native';

export default function Products(): React.JSX.Element {
  const { style, padCont, colors } = useStyle();
  const api = useManagementApi();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [catalogSearchText, setCatalogSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [catalogModalVisible, setCatalogModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [branchSelectorVisible, setBranchSelectorVisible] = useState(false);
  
  const navigation = useNavigation(); 
  const route = useRoute<any>();

  const { data: userProfile, isLoading: loadingProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: api.getUserProfile,
  });

  const isManager = userProfile?.role?.role_name === 'Manager';

  const { data: branches } = useQuery({
    queryKey: ['branches'],
    queryFn: api.getBranches,
    enabled: isManager,
  });

  useEffect(() => {
    if (userProfile) {
      if (isManager) {
        if (branches && branches.length > 0 && !selectedBranchId) {
          setSelectedBranchId(branches[0].branchId);
        }
      } else {
        if (userProfile.branch?.branchId) {
          setSelectedBranchId(userProfile.branch.branchId);
        }
      }
    }
  }, [userProfile, isManager, branches, selectedBranchId]);

  const { 
      data: inventory, 
      isLoading: loadingInventory, 
      refetch: refetchInventory,
      isRefetching: isRefetchingInventory
  } = useQuery({
      queryKey: ['inventory', selectedBranchId],
      queryFn: () => api.getBranchInventory(selectedBranchId!),
      enabled: !!selectedBranchId,
  });

  const { data: catalogItems } = useQuery({
    queryKey: ['items'],
    queryFn: api.getItems,
    enabled: catalogModalVisible,
  });

  useEffect(() => {
    if (route.params?.scannedProduct) {
      const product: Item = route.params.scannedProduct;
      
      const existingEntry = inventory?.find(inv => inv.item.itemId === product.itemId);

      const itemForModal: InventoryItem = existingEntry || {
        inventoryId: 0, 
        item: product,
        bundleQuantity: 0,
        unitQuantity: 0
      };


      setSelectedItem(itemForModal);
      setModalVisible(true);

      navigation.setParams(undefined as any);
    }
  }, [route.params?.scannedProduct, inventory]);


  const adjustmentMutation = useMutation({
    mutationFn: (vars: { type: MovementType; data: any }) =>
      api.adjustInventory(selectedBranchId!, vars.type, vars.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', selectedBranchId] });
      setModalVisible(false);
    },
    onError: (err: any) => Alert.alert('Error', err.message),
  });

  const handleConfirmAdjustment = async (type: MovementType, bundleChange: number, unitChange: number) => {
    if (!selectedItem) return;
    if (bundleChange === 0 && unitChange === 0) {
      return;
    }
    await adjustmentMutation.mutateAsync({
      type,
      data: { itemId: selectedItem.item.itemId, bundleChange, unitChange },
    });
  };

  const openAdjustmentModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const selectCatalogItem = (item: Item) => {
    setCatalogModalVisible(false);
    setCatalogSearchText('');

    const newItem: InventoryItem = {
      inventoryId: 0,
      item: item,
      bundleQuantity: 0,
      unitQuantity: 0,
    };
    setSelectedItem(newItem);
    setTimeout(() => setModalVisible(true), 300);
  };

  const filteredInventory = inventory?.filter((inv) =>
    inv.item.itemName.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCatalogItems = catalogItems?.filter(
    (item) =>
      item.itemName.toLowerCase().includes(catalogSearchText.toLowerCase()) ||
      (item.sku && item.sku.includes(catalogSearchText))
  );

  const currentBranchName = isManager
    ? branches?.find((b: Branch) => b.branchId === selectedBranchId)?.branchName || 'Cargando...'
    : null;

  const renderItem = ({ item }: { item: InventoryItem }) => (
    <TouchableOpacity style={style.row} onPress={() => openAdjustmentModal(item)}>
      <Text style={[style.cell, style.cellNombre]} numberOfLines={1}>
        {item.item.itemName}
      </Text>
      <Text style={[style.cell, style.cellBultos, style.cellNumber]}>{item.bundleQuantity}</Text>
      <Text style={[style.cell, style.cellUnidades, style.cellNumber]}>{item.unitQuantity}</Text>
    </TouchableOpacity>
  );

  if (loadingProfile)
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" color={colors.primary} />;

  return (
    <View style={style.container}>
      {isManager && (
        <TouchableOpacity style={style.branchSelector} onPress={() => setBranchSelectorVisible(true)}>
          <Text style={style.branchSelectorText}>Sucursal: {currentBranchName}</Text>
          <MaterialIcons name="arrow-drop-down" size={24} color={colors.text} />
        </TouchableOpacity>
      )}

      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
        <TextInput
          style={[style.input, { flex: 1 }]}
          placeholderTextColor={style.placeholder.color}
          placeholder="Buscar producto..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={style.scanButton} onPress={() => setCatalogModalVisible(true)}>
          <MaterialIcons name="playlist-add" size={28} color={colors.bg} />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <View style={style.headerRow}>
          <Text style={[style.headerCell, style.cellNombre]}>Nombre</Text>
          <Text style={[style.headerCell, style.cellBultos]}>Bultos</Text>
          <Text style={[style.headerCell, style.cellUnidades]}>Unidades</Text>
        </View>

        {loadingInventory ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={filteredInventory}
            renderItem={renderItem}
            keyExtractor={(item) => item.inventoryId.toString()}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            ListFooterComponent={() => <View style={{ height: padCont }} />}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            refreshControl={
                  <RefreshControl
                      refreshing={isRefetchingInventory}
                      onRefresh={refetchInventory}
                      tintColor={colors.primary}
                      colors={[colors.primary]}
                  />
              }
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', marginTop: 20, color: colors.text_muted }}>
                No se encontraron productos.
              </Text>
            }
          />
        )}
      </View>

      <Modal
        visible={catalogModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCatalogModalVisible(false)}
      >
        <View style={style.modalOverlay}>
          <View style={[style.modalContent, { maxHeight: '80%', minHeight: '80%', padding: 20 }]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 15,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>
                Ingreso de Mercadería
              </Text>
              <Pressable onPress={() => setCatalogModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            <TextInput
              style={[style.input, { borderWidth: 1, borderColor: colors.text, marginBottom: 10 }]}
              placeholderTextColor={colors.text_muted}
              placeholder="Buscar en catálogo global..."
              value={catalogSearchText}
              onChangeText={setCatalogSearchText}
            />

            <View style={{ marginBottom: 15 }}>
              <Button
                text="Escanear Código"
                onPress={() => {
                   setCatalogModalVisible(false); 
                   navigation.navigate(STACK_ROUTES.SCANNER as never); 
                }}
              />
            </View>

            <FlatList
              data={filteredCatalogItems}
              keyExtractor={(item) => item.itemId.toString()}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              renderItem={({ item }) => (
                <TouchableOpacity style={style.row} onPress={() => selectCatalogItem(item)}>
                  <Text style={[style.cell, { flex: 1, paddingLeft: 10 }]}>{item.itemName}</Text>
                  <Text style={[style.cell, { fontSize: 12, color: colors.text_muted, paddingRight: 10 }]}>
                    {item.sku || 'Sin SKU'}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <StockAdjustmentModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        item={selectedItem}
        onConfirm={handleConfirmAdjustment}
      />

      <Modal
        visible={branchSelectorVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setBranchSelectorVisible(false)}
      >
        <Pressable style={style.modalOverlay} onPress={() => setBranchSelectorVisible(false)}>
          <View style={style.modalContent}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: colors.text }}>
              Seleccionar Sucursal
            </Text>
            <FlatList
              data={branches}
              keyExtractor={(item) => item.branchId.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ padding: 15, borderBottomWidth: 1, borderColor: colors.text }}
                  onPress={() => {
                    setSelectedBranchId(item.branchId);
                    setBranchSelectorVisible(false);
                  }}
                >
                  <Text
                    style={{
                      color: colors.text,
                      fontWeight: item.branchId === selectedBranchId ? 'bold' : 'normal',
                    }}
                  >
                    {item.branchName}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const useStyle = () => {
  const { colors } = useContext(ThemeContext);
  const window = Dimensions.get('window');
  const padCont = window.width > 600 ? 48 : 16;

  const style = StyleSheet.create({
    container: {
      flex: 1,
      padding: padCont,
      paddingBottom: 0,
      backgroundColor: colors.bg,
    },
    branchSelector: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
      borderWidth: 2,
      borderColor: colors.text,
      borderRadius: 8,
      marginBottom: 12,
      backgroundColor: colors.bg,
    },
    branchSelectorText: {
      color: colors.text,
      fontWeight: 'bold',
      fontSize: 16,
    },
    scanButton: {
      width: 56,
      height: 56,
      backgroundColor: colors.text,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: colors.bg,
      borderRadius: 12,
      padding: 20,
      maxHeight: '60%',
      borderWidth: 1,
      borderColor: colors.text,
    },
    input: {
      marginBottom: 1,
      borderWidth: 2,
      borderColor: colors.text,
      borderRadius: 8,
      padding: 16,
      height: 56,
      color: colors.text,
    },
    placeholder: {
      color: colors.text_muted,
    },
    headerRow: {
      flexDirection: 'row',
      backgroundColor: colors.bg,
      paddingVertical: 16,
      paddingHorizontal: 8,
    },
    row: {
      flexDirection: 'row',
      paddingVertical: 12,
      paddingHorizontal: 8,
      alignItems: 'center',
      minHeight: 44,
      borderWidth: 1,
      borderColor: colors.text,
      borderRadius: 8,
    },
    headerCell: {
      fontWeight: 'bold',
      color: colors.text,
      fontSize: 14,
    },
    cell: {
      fontSize: 14,
      color: colors.text,
    },
    cellNombre: {
      flex: 3,
      paddingLeft: 12,
    },
    cellBultos: {
      flex: 1,
      textAlign: 'center',
    },
    cellUnidades: {
      flex: 1,
      textAlign: 'center',
    },
    cellNumber: {
      fontWeight: 'bold',
    },
  });

  return { style, padCont, colors };
};