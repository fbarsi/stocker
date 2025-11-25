import { Dispatch } from 'react';

export interface Action {
  type: AuthActionTypes;
  payload?: any;
}

export interface User {
  name: string;
  lastname: string;
  email: string;
  companyId?: number; 
  role?: string;
  branchId?: number;
}

export interface State {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface AuthContextType {
  state: State;
  dispatch: Dispatch<Action>;
}

export const initialState: State = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

export enum AuthActionTypes {
  LOGIN_START = 'LOGIN_START',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  RESTORE_TOKEN = 'RESTORE_TOKEN',
  CLEAR_ERROR = 'CLEAR_ERROR',
  REFRESH_TOKEN_SUCCESS = 'REFRESH_TOKEN_SUCCESS',
}
