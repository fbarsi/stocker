import { Action, AuthActionTypes, initialState, State } from './constants';

export const authReducer = (state: State, action: Action) => {
  switch (action.type) {
    case AuthActionTypes.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case AuthActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      };
    case AuthActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
        error: action.payload.error,
      };
    case AuthActionTypes.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
      };
    case AuthActionTypes.RESTORE_TOKEN:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: !!action.payload.token,
      };
    case AuthActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
