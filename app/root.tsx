import {
    useFonts,
    Montserrat_400Regular,
    Montserrat_500Medium,
} from '@expo-google-fonts/montserrat';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROOT_ROUTES } from '@utils/constants';
import AuthScreen from './auth';
import TabsScreen from './tabs';
import { useContext } from 'react';
import { AuthContext } from '@shared/AuthContext';

const Stack = createNativeStackNavigator();

export default function Root() {
    const [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_500Medium,
    });

    const { state } = useContext(AuthContext);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <Stack.Navigator 
            initialRouteName={ROOT_ROUTES.AUTH}
            screenOptions={{ headerShown: false }}
        >
            {state.isAuthenticated ? (
                <Stack.Screen name={ROOT_ROUTES.TABS} component={TabsScreen} />
            ) : (
                <Stack.Screen name={ROOT_ROUTES.AUTH} component={AuthScreen} />
            )}
        </Stack.Navigator>
    );
}
