import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '@shared/context/ThemeContext';
import { Movement } from '@api/management';
import { MaterialIcons } from '@expo/vector-icons';

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export function MovementCard({ movement }: { movement: Movement }) {
    const { colors } = useContext(ThemeContext);

    const totalUnits = (movement.bundleChange * 1) + movement.unitChange;
    const sign = totalUnits > 0 ? '+' : '';

    const styles = StyleSheet.create({
        card: {
            flexDirection: 'row',
            padding: 16,
            backgroundColor: colors.bg_light,
            borderBottomWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
        },
        info: {
            flex: 1,
        },
        itemName: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.text,
        },
        meta: {
            fontSize: 12,
            color: colors.text_muted,
            marginTop: 2,
        },
        quantity: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.text,
        }
    });

    return (
        <View style={styles.card}>
            <View style={styles.info}>
                <Text style={styles.itemName}>{movement.item.itemName}</Text>
                <Text style={styles.meta}>
                    {formatDate(movement.timestamp)} • {movement.user.name} {movement.user.lastname}
                </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.quantity}>
                    {movement.bundleChange !== 0 ? `${sign}${movement.bundleChange} Bultos` : ''}
                </Text>
                {movement.unitChange !== 0 && (
                    <Text style={[styles.quantity, { fontSize: 12 }]}>
                        {movement.unitChange > 0 ? '+' : ''}{movement.unitChange} Unid.
                    </Text>
                )}
            </View>
        </View>
    );
}