import { View, Text } from 'react-native';
import React from 'react';
import { Button, ButtonTheme } from '@components';
import { useStyles } from '@utils/styles';
import { useNavigation } from '@react-navigation/native';
import { STACK_ROUTES } from '@utils/constants';
import { useAuth } from '@shared/context/AuthContext/AuthContext';

export default function Onboarding() {
    const style = useStyles();
    const navigation = useNavigation();
    const { state } = useAuth();

    return (
        <View style={style.container}>
            <View style={style.card}>
                <Text style={style.title}>Bienvenido, {state.user?.name}! 👋</Text>
                <Text style={[style.text, { marginBottom: 30, fontSize: 16 }]}>
                    Para comenzar a utilizar Stocker, necesitas unirte a un equipo o crear el tuyo propio.
                </Text>
                
                <Button 
                    text="Crear una Empresa" 
                    onPress={() => navigation.navigate(STACK_ROUTES.CREATE_COMPANY as never)}
                />
                
                {/* Aquí irá el botón de aceptar invitación en el futuro */}
            </View>
            <ButtonTheme />
        </View>
    );
}