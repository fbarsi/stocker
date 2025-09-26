import { Dispatch } from 'react';

export interface Action {
  type: AuthActionTypes;
  payload?: any;
}

export interface State {
  user: string | null;
  token: string | null;
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
  token: null,
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
}
