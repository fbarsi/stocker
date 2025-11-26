import { LoginCredentials, RegisterData } from "@shared/interfaces";

// const BASE_URL = 'https://stocker-api-1h4x.onrender.com';
// export const BASE_URL = 'http://192.168.100.85:3000'
export const BASE_URL = 'https://stocker-api-production.up.railway.app'

export const loginApiCall = async (credentials: LoginCredentials) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al iniciar sesión. Verifique sus credenciales.');
  }
  return data;
};

export const registerApiCall = async (userInfo: RegisterData) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userInfo),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error durante el registro. Intente de nuevo.');
  }

  return data;
};

export const refreshTokenApiCall = async (refreshToken: string) => {
  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${refreshToken}`,
    },
    body: JSON.stringify({}),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al refrescar el token.');
  }

  return data;
};

export const getMeApiCall = async (token: string) => {
  const response = await fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener la información del usuario.');
  }

  return data;
};