import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeContext } from '@shared/context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useStyles } from '@utils/styles';
import { Button } from '@components/Button';

interface BranchCardProps {
  name: string;
  address?: string;
  onPressInventory?: () => void;
}

function CardButton({ text }: { text: string }) {
  const { colors, isDarkMode } = useContext(ThemeContext);
  const style = useStyles();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingVertical: 10,
        borderRadius: 10,
      }}
    >
      <Text style={{ color: colors.on_primary, fontSize: 14 }}>{text}</Text>
    </TouchableOpacity>
  );
}

export function BranchCard({ name, address }: BranchCardProps) {
  const { colors, isDarkMode } = useContext(ThemeContext);
  const style = useStyles();

  const styles = StyleSheet.create({
    iconContainer: {
      padding: 10,
      borderRadius: 10,
    },
    name: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    address: {
      fontSize: 14,
      color: colors.text_muted,
    },
  });

  return (
    <View style={style.card}>
      <View style={{ flexDirection: 'row', marginBottom: 30 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.address}>{address || 'Sin dirección'}</Text>
        </View>
        <View style={styles.iconContainer}>
          <MaterialIcons name="store" size={30} color={colors.primary} />
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <CardButton text="Inventario" />
        <CardButton text="Reportes" />
        <CardButton text="Empleados" />
      </View>
    </View>
  );
}
