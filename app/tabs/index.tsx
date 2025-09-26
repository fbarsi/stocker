import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TAB_ROUTES } from '@utils/constants';
import { Home, Products } from './screens';

const Tab = createBottomTabNavigator();

export default function TabsScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name={TAB_ROUTES.HOME} component={Home} />
      <Tab.Screen name={TAB_ROUTES.PRODUCTS} component={Products} />
    </Tab.Navigator>
  );
}

// poner iconos de material para las tabs, home y list-alt
