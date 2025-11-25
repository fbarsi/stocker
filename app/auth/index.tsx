import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AUTH_ROUTES } from '@utils/constants';
import { Login, Register } from './screens';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext } from 'react';
import { ThemeContext } from '@shared/context/ThemeContext';


const Stack = createNativeStackNavigator();

export default function AuthScreen() {
    const {  colors } = useContext(ThemeContext);
    return (
        <SafeAreaView style={{flex:1, backgroundColor: colors.bg}}>
            <Stack.Navigator
                initialRouteName={AUTH_ROUTES.LOGIN}
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name={AUTH_ROUTES.LOGIN} component={Login} />
                <Stack.Screen name={AUTH_ROUTES.REGISTER} component={Register} />
            </Stack.Navigator>
        </SafeAreaView>
    );
}
