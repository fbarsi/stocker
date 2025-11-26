import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TAB_ROUTES, STACK_ROUTES } from '@utils/constants';
import {
  Home,
  Products,
  NewProduct,
  CreateCompany,
  NewBranch,
  ItemsCatalog,
  NewItem,
  InvitationsManager,
  InvitationsUser,
  InventoryScreen,
  HistoryScreen,
} from './screens';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useContext } from 'react';
import { AuthActionTypes, AuthContext } from '@shared/context/AuthContext';
import { ThemeContext } from '@shared/context/ThemeContext';
import { useAuth } from '@shared/context/AuthContext/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  const { colors } = useContext(ThemeContext);
  const { dispatch } = useAuth();
  const handleLogout = () => {
    dispatch({ type: AuthActionTypes.LOGOUT });
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerTintColor: colors.text,
        headerStyle: { backgroundColor: colors.bg },
        tabBarStyle: { backgroundColor: colors.bg },
      }}
    >
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
      <Tab.Screen
        name={TAB_ROUTES.HISTORY}
        component={HistoryScreen}
        options={{
          title: 'Historial',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function TabsScreen() {
  const { colors } = useContext(ThemeContext);
  return (
    <Stack.Navigator
      screenOptions={{ headerTintColor: colors.text, headerStyle: { backgroundColor: colors.bg } }}
    >
      <Stack.Screen
        name={STACK_ROUTES.NAV_STACK_TABS}
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={STACK_ROUTES.NEW_PRODUCT}
        component={NewProduct}
        options={{ title: 'Nuevo Producto' }}
      />
      <Stack.Screen 
        name={STACK_ROUTES.NEW_BRANCH} 
        component={NewBranch} 
        options={{ title: 'Sucursal' }} 
      />
      <Stack.Screen
        name={STACK_ROUTES.CREATE_COMPANY}
        component={CreateCompany}
        options={{ title: 'Crear Empresa' }}
      />
      <Stack.Screen
        name={STACK_ROUTES.ITEMS_CATALOG}
        component={ItemsCatalog}
        options={{ title: 'Catálogo' }}
      />
      <Stack.Screen 
        name={STACK_ROUTES.NEW_ITEM} 
        component={NewItem} 
        options={{ title: 'Nuevo Artículo' }} 
      />
      <Stack.Screen
        name={STACK_ROUTES.INVITATIONS_MANAGER}
        component={InvitationsManager}
        options={{ title: 'Gestionar Invitaciones' }}
      />
      <Stack.Screen
        name={STACK_ROUTES.INVITATIONS_USER}
        component={InvitationsUser}
        options={{ title: 'Mis Invitaciones' }}
      />

      <Stack.Screen
        name={STACK_ROUTES.INVENTORY}
        component={InventoryScreen}
        options={{ title: 'Control de Stock' }}
      />
    </Stack.Navigator>
  );
}
