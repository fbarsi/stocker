import React, { useState, useContext } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, Pressable, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ThemeContext } from '@shared/context/ThemeContext';
import { Button } from './Button';
import { InventoryItem, MovementType } from '@api/management';
import { MaterialIcons } from '@expo/vector-icons';

interface StockAdjustmentModalProps {
    visible: boolean;
    onClose: () => void;
    item: InventoryItem | null;
    onConfirm: (type: MovementType, bundleChange: number, unitChange: number) => Promise<void>;
}

export function StockAdjustmentModal({ visible, onClose, item, onConfirm }: StockAdjustmentModalProps) {
    const { colors } = useContext(ThemeContext);
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState<MovementType>('sale');
    
    const [bundles, setBundles] = useState('');
    const [units, setUnits] = useState('');

    const handleConfirm = async () => {
        setLoading(true);
        try {
            const bundleVal = parseInt(bundles) || 0;
            const unitVal = parseInt(units) || 0;
            await onConfirm(tab, bundleVal, unitVal);
            
            setBundles('');
            setUnits('');
            onClose();
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    if (!item) return null;

    const styles = StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            padding: 20,
        },
        container: {
            backgroundColor: colors.bg,
            borderRadius: 16,
            padding: 20,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 15,
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            flex: 1,
        },
        tabsRow: {
            flexDirection: 'row',
            marginBottom: 20,
            backgroundColor: colors.bg_light,
            borderRadius: 8,
            padding: 4,
        },
        tab: {
            flex: 1,
            paddingVertical: 10,
            alignItems: 'center',
            borderRadius: 6,
        },
        activeTab: {
            backgroundColor: colors.primary,
        },
        tabText: {
            fontWeight: 'bold',
            fontSize: 14,
        },
        inputRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 15,
            marginBottom: 25,
        },
        inputContainer: {
            flex: 1,
        },
        label: {
            color: colors.text_muted,
            fontSize: 12,
            marginBottom: 5,
            fontWeight: 'bold',
        },
        input: {
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            padding: 12,
            fontSize: 18,
            color: colors.text,
            textAlign: 'center',
            backgroundColor: colors.bg_light,
        },
        infoText: {
            textAlign: 'center',
            color: colors.text_muted,
            marginBottom: 15,
            fontSize: 14,
        }
    });

    const getTabColor = (type: MovementType) => {
        if (tab === type) {
            switch(type) {
                case 'inbound': return '#4CAF50';
                case 'sale': return colors.primary;
                case 'adjustment': return '#FFC107';
            }
        }
        return 'transparent';
    };

    const getTextColor = (type: MovementType) => tab === type ? '#FFF' : colors.text_muted;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>{item.item.itemName}</Text>
                        <Pressable onPress={onClose}>
                            <MaterialIcons name="close" size={24} color={colors.text} />
                        </Pressable>
                    </View>

                    <View style={styles.tabsRow}>
                        <TouchableOpacity 
                            style={[styles.tab, { backgroundColor: getTabColor('sale') }]} 
                            onPress={() => setTab('sale')}
                        >
                            <Text style={[styles.tabText, { color: getTextColor('sale') }]}>Venta</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.tab, { backgroundColor: getTabColor('inbound') }]} 
                            onPress={() => setTab('inbound')}
                        >
                            <Text style={[styles.tabText, { color: getTextColor('inbound') }]}>Entrada</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.tab, { backgroundColor: getTabColor('adjustment') }]} 
                            onPress={() => setTab('adjustment')}
                        >
                            <Text style={[styles.tabText, { color: getTextColor('adjustment') }]}>Ajuste</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.infoText}>
                        {tab === 'sale' ? 'Salida de mercadería por venta.' : 
                         tab === 'inbound' ? 'Ingreso de nueva mercadería.' : 
                         'Corrección manual de stock (+/-).'}
                    </Text>

                    <View style={styles.inputRow}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Bultos ({item.item.unitsPerBundle}u)</Text>
                            <TextInput 
                                style={styles.input}
                                placeholder="0"
                                placeholderTextColor={colors.text_muted}
                                keyboardType="numeric"
                                value={bundles}
                                onChangeText={setBundles}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Unidades Sueltas</Text>
                            <TextInput 
                                style={styles.input}
                                placeholder="0"
                                placeholderTextColor={colors.text_muted}
                                keyboardType="numeric"
                                value={units}
                                onChangeText={setUnits}
                            />
                        </View>
                    </View>

                    {loading ? (
                        <ActivityIndicator color={colors.primary} size="large" />
                    ) : (
                        <Button text="Confirmar Movimiento" onPress={handleConfirm} />
                    )}
                </View>
            </View>
        </Modal>
    );
}