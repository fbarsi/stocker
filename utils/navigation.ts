export type RootStackParamList = {
  Login: undefined;
  register: undefined;
  Home: undefined;
  Prueba: undefined;
  Lista: undefined;
};


declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}