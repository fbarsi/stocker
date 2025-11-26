import { View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState, useContext } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useManagementApi, InventoryItem, MovementType } from '@api/management';
import { useStyles } from '@utils/styles';
import { ThemeContext } from '@shared/context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { StockAdjustmentModal } from '@components/StockAdjustmentModal';

type RouteParams = {
    branchId: number;
    branchName?: string;
};

export default function InventoryScreen() {
    const style = useStyles();
    const { colors } = useContext(ThemeContext);
    const api = useManagementApi();
    const route = useRoute();
    const queryClient = useQueryClient();
    
    const { branchId, branchName } = route.params as RouteParams;

    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const { data: inventory, isLoading, error } = useQuery({
        queryKey: ['inventory', branchId],
        queryFn: () => api.getBranchInventory(branchId),
        enabled: !!branchId,
    });

    const adjustmentMutation = useMutation({
        mutationFn: (vars: { type: MovementType, data: any }) => 
            api.adjustInventory(branchId, vars.type, vars.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory', branchId] });
        },
        onError: (err) => Alert.alert('Error', err.message),
    });

    const handleOpenModal = (item: InventoryItem) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const handleConfirmAdjustment = async (type: MovementType, bundleChange: number, unitChange: number) => {
        if (!selectedItem) return;
        
        if (bundleChange === 0 && unitChange === 0) {
            return;
        }

        await adjustmentMutation.mutateAsync({
            type,
            data: {
                itemId: selectedItem.item.itemId,
                bundleChange,
                unitChange
            }
        });
    };

    const renderItem = ({ item }: { item: InventoryItem }) => (
        <TouchableOpacity 
            style={[localStyles.card, { backgroundColor: colors.bg_light, borderColor: colors.border }]}
            onPress={() => handleOpenModal(item)}
        >
            <View style={[localStyles.iconBox, { backgroundColor: 'rgba(0,0,0,0.05)' }]}>
                <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.text_muted }}>SKU</Text>
                <Text style={{ fontSize: 12, color: colors.text }}>{item.item.sku || '---'}</Text>
            </View>

            <View style={{ flex: 1, paddingHorizontal: 10 }}>
                <Text style={[style.text, { fontWeight: 'bold', fontSize: 16, marginBottom: 4 }]}>
                    {item.item.itemName}
                </Text>
                <Text style={{ fontSize: 12, color: colors.text_muted }}>
                    {item.item.unitsPerBundle}u por bulto
                </Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
                <Text style={[style.text, { fontSize: 18, fontWeight: 'bold', color: colors.primary }]}>
                    {item.bundleQuantity} <Text style={{fontSize: 12}}>Bultos</Text>
                </Text>
                <Text style={{ fontSize: 14, color: colors.text }}>
                    + {item.unitQuantity} <Text style={{fontSize: 10}}>Unid.</Text>
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (isLoading) return <ActivityIndicator style={{ marginTop: 50 }} size="large" color={colors.primary} />;
    if (error) return <Text style={{ textAlign: 'center', marginTop: 50, color: 'red' }}>Error cargando inventario.</Text>;

    return (
        <View style={[style.container, { padding: 20 }]}>
            <View style={{ marginBottom: 15 }}>
                <Text style={[style.title, { fontSize: 22 }]}>Inventario</Text>
                {branchName && <Text style={{ color: colors.text_muted, fontSize: 14 }}>{branchName}</Text>}
            </View>

            <FlatList
                data={inventory}
                keyExtractor={(item) => item.inventoryId.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50 }}
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', marginTop: 50, opacity: 0.5, color: colors.text }}>
                        El inventario está vacío.
                    </Text>
                }
            />

            <StockAdjustmentModal 
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                item={selectedItem}
                onConfirm={handleConfirmAdjustment}
            />
        </View>
    );
}

const localStyles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    }
});