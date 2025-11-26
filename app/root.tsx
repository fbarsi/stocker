import { useFonts, Montserrat_400Regular, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROOT_ROUTES } from '@utils/constants';
import AuthScreen from './auth';
import TabsScreen from './tabs';
import { useContext, useEffect } from 'react';
import { AuthActionTypes } from '@shared/context/AuthContext';
import { ThemeContext } from '@shared/context/ThemeContext';
import { SystemBars } from 'react-native-edge-to-edge';
import { View } from 'react-native';
import { useAuth } from '@shared/context/AuthContext/AuthContext';
import { getUser } from '@shared/context/AuthContext/secure-store';
import { usePushNotifications } from '@shared/hooks/usePushNotifications';
import { useManagementApi } from '@api/management';

const Stack = createNativeStackNavigator();

export default function Root() {
  const { state, dispatch } = useAuth();
  const { isDarkMode, colors } = useContext(ThemeContext);
  const { expoPushToken, notification } = usePushNotifications();
  const api = useManagementApi();
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
  });

  useEffect(() => {
    if (expoPushToken) {
      console.log('Token listo para usar:', expoPushToken);
    }
  }, [expoPushToken]);

  useEffect(() => {
    if (state.isAuthenticated && expoPushToken) {
      console.log("Enviando Push Token al backend...");
      api.updateUserProfile({ pushToken: expoPushToken })
         .catch(err => console.log("Error guardando token:", err));
    }
  }, [state.isAuthenticated, expoPushToken]);

  useEffect(() => {
    dispatch({ type: AuthActionTypes.LOGIN_START });

    getUser().then((data) => {
      if (data) {
        dispatch({
          type: AuthActionTypes.RESTORE_TOKEN,
          payload: data,
        });
      } else {
        dispatch({ type: AuthActionTypes.LOGIN_FAILURE, payload: { error: null } });
      }
    });
  }, []);

  if (!fontsLoaded || state.isLoading) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <SystemBars style={isDarkMode ? 'light' : 'dark'} />
      <Stack.Navigator
        initialRouteName={state.isAuthenticated ? ROOT_ROUTES.TABS : ROOT_ROUTES.AUTH}
        screenOptions={{ headerShown: false }}
      >
        {state.isAuthenticated ? (
          <Stack.Screen name={ROOT_ROUTES.TABS} component={TabsScreen} />
        ) : (
          <Stack.Screen name={ROOT_ROUTES.AUTH} component={AuthScreen} />
        )}
      </Stack.Navigator>
    </View>
  );
}
