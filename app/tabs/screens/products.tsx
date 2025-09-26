import { ThemeContext } from '@shared/ThemeContext';
import { Product, products } from '@utils/productList';
import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ListRenderItem, TextInput } from 'react-native';

export default function Products(): React.JSX.Element {
  const style = useStyle();
  
  const renderItem: ListRenderItem<Product> = ({ item }) => (
    <View style={style.row}>
      <Text style={[style.cell, style.cellNombre]}>
        {item.name}
      </Text>
      <Text style={[style.cell, style.cellBultos, style.cellNumber]}>{item.cases}</Text>
      <Text style={[style.cell, style.cellUnidades, style.cellNumber]}>{item.units}</Text>
    </View>
  );

  return (
    <View style={style.container}>
      <TextInput style={style.input} placeholder="Escriba el nombre de un producto..." />

      <View style={{flex:1}}>
        <View style={style.headerRow}>
          <Text style={[style.headerCell, style.cellNombre]}>Nombre</Text>
          <Text style={[style.headerCell, style.cellBultos]}>Bultos</Text>
          <Text style={[style.headerCell, style.cellUnidades]}>Unidades</Text>
        </View>
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const useStyle = () => {
  const { colors } = useContext(ThemeContext);

  const style = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
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
    headerRow: {
      flexDirection: 'row',
      backgroundColor: colors.background,
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
      // color: colors.text,
    },
  });

  return style;
};
