import { useCallback } from 'react';
import { useAuth } from '../shared/context/AuthContext/AuthContext';
import { refreshTokenApiCall } from './auth';
import { AuthActionTypes } from '@shared/context/AuthContext';
import { BASE_URL } from './auth';


export const useSecureFetch = () => {
  const { state, dispatch } = useAuth();

  const secureFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    let response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.accessToken}`,
      },
    });

    if (response.status === 401) {
      try {
        const refreshData = await refreshTokenApiCall(state.refreshToken!);
        dispatch({
          type: AuthActionTypes.REFRESH_TOKEN_SUCCESS,
          payload: {
            accessToken: refreshData.accessToken,
            refreshToken: refreshData.refreshToken,
          },
        });
        
        response = await fetch(`${BASE_URL}${url}`, {
          ...options,
          headers: {
            ...options.headers,
            'Content-Type': 'application/json',
            Authorization: `Bearer ${refreshData.accessToken}`,
          },
        });
      } catch (error) {
        dispatch({ type: AuthActionTypes.LOGOUT });
        throw new Error('Session expired. Please login again.');
      }
    }

    return response;
  }, [state.accessToken, state.refreshToken, dispatch]);

  return secureFetch;
};
