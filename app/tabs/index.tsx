import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TAB_ROUTES } from '@utils/constants';
import { Home, Products } from './screens';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useContext } from 'react';
import { AuthActionTypes, AuthContext } from '@shared/AuthContext';

const Tab = createBottomTabNavigator();

export default function TabsScreen() {
  const { dispatch } = useContext(AuthContext);
  const handleLogout = () => {
    dispatch({ type: AuthActionTypes.LOGOUT });
  };

  return (
    <Tab.Navigator>
      <Tab.Screen
        name={TAB_ROUTES.HOME}
        component={Home}
        options={{
          headerRight: ({ tintColor }) => (
            <Pressable style={{ marginRight: 16 }} onPress={handleLogout}>
              <MaterialIcons name="logout" size={24} color={tintColor} />
            </Pressable>
          ),
          title: 'Inicio',
          tabBarIcon: ({ size, color }) => <FontAwesome5 name={'home'} size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.PRODUCTS}
        component={Products}
        options={{
          title: 'Inventario',
          tabBarIcon: ({ size, color }) => <FontAwesome5 name={'list-alt'} size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
