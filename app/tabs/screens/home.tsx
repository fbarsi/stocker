import { View, Text } from 'react-native';
import React, { useContext } from 'react';
import { AuthActionTypes, AuthContext } from '@shared/AuthContext';
import { Button, ButtonTheme } from '@components';

export default function Home() {
    const { dispatch } = useContext(AuthContext);

    const handleLogout = () => {
        dispatch({ type: AuthActionTypes.LOGOUT });
    };

    return (
        <View>
            <Text>Home</Text>
            <Button text="Desloguear" onPress={handleLogout} />
            <ButtonTheme />
        </View>
    );
}
