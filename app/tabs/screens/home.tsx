import { View, Text, Dimensions } from 'react-native';
import React, { useContext } from 'react';
import { AuthContext } from '@shared/AuthContext';
import { ButtonTheme } from '@components';
import { HomeButton } from './../../../components/HomeButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useStyles } from '@utils/styles';

export default function Home() {
  const window = Dimensions.get('window');
  const style = useStyles();
  const iconSize = window.width > 600 ? 60 : 40;

  const { state } = useContext(AuthContext);

  return (
    <View style={style.container}>
      <Text style={style.title}>Hola {state.user}!</Text>
      <HomeButton>
        <MaterialCommunityIcons name={'pencil-plus'} size={iconSize} color={style.onPrimary.color} />
        <Text style={style.homeButtonText}>Agregar artículo</Text>
      </HomeButton>
      <HomeButton>
        <MaterialCommunityIcons name={'chart-bar'} size={iconSize} color={style.onPrimary.color} />
        <Text style={style.homeButtonText}>Consultar gráficos</Text>
      </HomeButton>
      <HomeButton>
        <MaterialCommunityIcons name={'shopping'} size={iconSize} color={style.onPrimary.color} />
        <Text style={style.homeButtonText}>Lista de compras</Text>
      </HomeButton>
      <HomeButton>
        <MaterialCommunityIcons name={'google-maps'} size={iconSize} color={style.onPrimary.color} />
        <Text style={style.homeButtonText}>Ubicar locales</Text>
      </HomeButton>
      <ButtonTheme />
    </View>
  );
}
