import { createContext, ReactNode, useReducer } from 'react';
import { authReducer } from './AuthReducer';
import { AuthContextType, initialState } from './constants';

export const AuthContext = createContext<AuthContextType>({
  state: initialState,
  dispatch: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
};
