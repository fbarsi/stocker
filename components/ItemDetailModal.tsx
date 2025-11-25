import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { ThemeContext } from '@shared/context/ThemeContext';
import { Button } from './Button';
import { Item, UpdateItemDto } from '@api/management';
import { MaterialIcons } from '@expo/vector-icons';

interface ItemDetailModalProps {
    visible: boolean;
    onClose: () => void;
    item: Item | null;
    isManager: boolean;
    onSave: (id: number, data: UpdateItemDto) => Promise<void>;
}

export function ItemDetailModal({ visible, onClose, item, isManager, onSave }: ItemDetailModalProps) {
    const { colors } = React.useContext(ThemeContext);
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [sku, setSku] = useState('');
    const [description, setDescription] = useState('');
    const [units, setUnits] = useState('');

    useEffect(() => {
        if (item) {
            setName(item.itemName);
            setSku(item.sku || '');
            setDescription(item.description || '');
            setUnits(item.unitsPerBundle.toString());
        }
    }, [item]);

    const handleSave = async () => {
        if (!item) return;
        setLoading(true);
        try {
            await onSave(item.itemId, {
                itemName: name,
                sku: sku,
                description: description,
                unitsPerBundle: parseInt(units) || 1,
            });
            onClose();
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar el artículo');
        } finally {
            setLoading(false);
        }
    };

    if (!item) return null;

    const styles = StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            padding: 20,
        },
        container: {
            backgroundColor: colors.bg,
            borderRadius: 16,
            padding: 20,
            maxHeight: '80%',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text,
            flex: 1,
        },
        label: {
            fontSize: 12,
            color: colors.text_muted,
            marginBottom: 4,
            marginTop: 10,
            fontWeight: 'bold',
        },
        input: {
            borderWidth: 1,
            borderColor: isManager ? colors.text : 'transparent',
            borderRadius: 8,
            padding: 10,
            color: colors.text,
            backgroundColor: isManager ? 'transparent' : colors.bg_light,
            fontSize: 16,
        },
        buttonRow: {
            flexDirection: 'row',
            marginTop: 25,
            gap: 10,
        }
    });

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{isManager ? 'Editar Artículo' : 'Detalles del Artículo'}</Text>
                        <Pressable onPress={onClose}>
                            <MaterialIcons name="close" size={24} color={colors.text} />
                        </Pressable>
                    </View>

                    <Text style={styles.label}>Nombre</Text>
                    <TextInput 
                        style={styles.input} 
                        value={name} 
                        onChangeText={setName} 
                        editable={isManager} 
                    />

                    <Text style={styles.label}>SKU</Text>
                    <TextInput 
                        style={styles.input} 
                        value={sku} 
                        onChangeText={setSku} 
                        editable={isManager} 
                        placeholder={isManager ? "Sin SKU" : ""}
                    />

                    <Text style={styles.label}>Unidades por Bulto</Text>
                    <TextInput 
                        style={styles.input} 
                        value={units} 
                        onChangeText={setUnits} 
                        editable={isManager} 
                        keyboardType="numeric" 
                    />

                    <Text style={styles.label}>Descripción</Text>
                    <TextInput 
                        style={[styles.input, { height: 80, textAlignVertical: 'top' }]} 
                        value={description} 
                        onChangeText={setDescription} 
                        editable={isManager} 
                        multiline 
                        placeholder={isManager ? "Sin descripción" : ""}
                    />

                    <View style={styles.buttonRow}>
                        <View style={{flex: 1}}>
                            <Button text="Cerrar" onPress={onClose} disabled={loading} />
                        </View>
                        {isManager && (
                            <View style={{flex: 1}}>
                                {loading ? (
                                    <ActivityIndicator color={colors.primary} />
                                ) : (
                                    <Button text="Guardar" onPress={handleSave} />
                                )}
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}