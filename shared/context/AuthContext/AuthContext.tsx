import { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import { Action, AuthActionTypes, AuthContextType, initialState, State } from './constants';
import { clearTokens, clearUser, setTokens, setUser } from './secure-store';


export const AuthContext = createContext<AuthContextType>({
  state: initialState,
  dispatch: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer((state: State, action: Action): State => {
    switch (action.type) {
      case AuthActionTypes.LOGIN_START:
        return {
          ...state,
          isLoading: true,
          error: null,
        };
      case AuthActionTypes.LOGIN_SUCCESS:
        setUser(action.payload.user)
        setTokens(action.payload.accessToken, action.payload.refreshToken);
        return {
          ...state,
          user: action.payload.user,
          accessToken: action.payload.accessToken,
          refreshToken: action.payload.refreshToken,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        };
      case AuthActionTypes.LOGIN_FAILURE:
        return {
          ...state,
          user: null,
          accessToken: null,
          refreshToken: null,
          isLoading: false,
          isAuthenticated: false,
          error: action.payload.error,
        };
      case AuthActionTypes.LOGOUT:
        clearUser();
        clearTokens();
        return {
          ...initialState,
          isLoading: false,
        };
      case AuthActionTypes.RESTORE_TOKEN:
        return {
          ...state,
          user: action.payload.user,
          accessToken: action.payload.accesstoken,
          refreshToken: action.payload.refreshToken,
          isLoading: false,
          isAuthenticated: true,
        };
      case AuthActionTypes.CLEAR_ERROR:
        return {
          ...state,
          error: null,
        };
      case AuthActionTypes.REFRESH_TOKEN_SUCCESS:
        setTokens(action.payload.accessToken, action.payload.refreshToken);
        return {
          ...state,
          accessToken: action.payload.accessToken,
          refreshToken: action.payload.refreshToken,
        };
      default:
        return state;
    }
  }, initialState);

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
