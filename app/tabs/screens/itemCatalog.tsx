import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useContext } from 'react';
import { useStyles } from '@utils/styles';
import { useManagementApi, Item } from '@api/management';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { STACK_ROUTES } from '@utils/constants';
import { ThemeContext } from '@shared/context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@shared/context/AuthContext/AuthContext';
import { Button, ItemDetailModal } from '@components';

export default function ItemsCatalog() {
    const style = useStyles();
    const { colors } = useContext(ThemeContext);
    const navigation = useNavigation();
    const api = useManagementApi();
    const queryClient = useQueryClient();
    const { state } = useAuth();
    
    const [search, setSearch] = useState('');
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const isManager = state.user?.role === 'Manager';

    const { data: items, isLoading } = useQuery({
        queryKey: ['items'],
        queryFn: api.getItems,
    });

    const updateItemMutation = useMutation({
        mutationFn: api.updateItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
        },
    });

    const filteredItems = items?.filter(item => 
        item.itemName.toLowerCase().includes(search.toLowerCase()) ||
        (item.sku && item.sku.includes(search))
    );

    const openItem = (item: Item) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const handleUpdate = async (id: number, data: any) => {
        await updateItemMutation.mutateAsync({ id, data });
    };

    const renderItem = ({ item }: { item: Item }) => (
        <TouchableOpacity 
            onPress={() => openItem(item)}
            style={{
                backgroundColor: colors.bg_light,
                padding: 16,
                borderRadius: 8,
                marginBottom: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.border,
                width: '100%',
            }}
        >
            <View style={{flex: 1}}>
                <Text style={[style.text, { fontWeight: 'bold', fontSize: 16 }]}>{item.itemName}</Text>
                {item.sku ? (
                    <Text style={[style.text, { fontSize: 12, opacity: 0.7 }]}>SKU: {item.sku}</Text>
                ) : null}
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.text_muted} />
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View style={[style.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={colors.text} />
            </View>
        );
    }

    return (
        <View style={[style.container, { paddingHorizontal: 20 }]}>
            <Text style={[style.title, { marginTop: 20, marginBottom: 10 }]}>Catálogo de Productos</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg_light, borderRadius: 8, paddingHorizontal: 10, marginBottom: 15, borderWidth: 1, borderColor: colors.border }}>
                <MaterialIcons name="search" size={24} color={colors.text_muted} />
                <TextInput
                    style={{ flex: 1, padding: 12, color: colors.text }}
                    placeholder="Buscar por nombre o SKU..."
                    placeholderTextColor={colors.text_muted}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {isManager && (
                <View style={{ marginBottom: 15, width: '100%', alignItems: 'center'}}>
                    <Button 
                        text="Agregar Nuevo Artículo" 
                        onPress={() => navigation.navigate(STACK_ROUTES.NEW_ITEM as never)}
                    />
                </View>
            )}

            <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.itemId.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Text style={[style.text, { textAlign: 'center', marginTop: 20, opacity: 0.6 }]}>
                        No se encontraron artículos.
                    </Text>
                }
                contentContainerStyle={{ paddingBottom: 50 }}
            />

            <ItemDetailModal 
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                item={selectedItem}
                isManager={isManager}
                onSave={handleUpdate}
            />
        </View>
    );
}