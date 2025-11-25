import * as SecureStore from 'expo-secure-store';
import { User } from './constants';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_NAME = 'userName';
const USER_LASTNAME = 'userLastname';
const USER_EMAIL = 'userEmail';
const COMPANY_ID = 'companyId';
const ROLE = 'role';
const BRANCH_ID = 'branchId';


export const getUser = async () => {
  try {
    const userName = await SecureStore.getItemAsync(USER_NAME);
    const userLastname = await SecureStore.getItemAsync(USER_LASTNAME);
    const userEmail = await SecureStore.getItemAsync(USER_EMAIL);
    const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    const companyId = await SecureStore.getItemAsync(COMPANY_ID);
    const role = await SecureStore.getItemAsync(ROLE);
    const branchId = await SecureStore.getItemAsync(BRANCH_ID);
    return userName
      ? {
          user: {
            name: userName,
            lastname: userLastname,
            email: userEmail,
            companyId: companyId ? parseInt(companyId) : undefined,
            role: role ? role : undefined,
            branchId: branchId ? parseInt(branchId) : undefined,
          },
          accessToken: accessToken,
          refreshToken: refreshToken,
        }
      : null;
  } catch (error) {
    console.error('Error getting user from SecureStore', error);
    return null;
  }
};

export const setUser = async (user: User) => {
  try {
    await SecureStore.setItemAsync(USER_NAME, user.name);
    await SecureStore.setItemAsync(USER_LASTNAME, user.lastname);
    await SecureStore.setItemAsync(USER_EMAIL, user.email);
    if (user.companyId) await SecureStore.setItemAsync(COMPANY_ID, user.companyId.toString());
    if (user.role) await SecureStore.setItemAsync(ROLE, user.role);
    if (user.branchId) await SecureStore.setItemAsync(BRANCH_ID, user.branchId.toString());
  } catch (error) {
    console.error('Error setting user in SecureStore', error);
  }
};

export const clearUser = async () => {
  try {
    await SecureStore.deleteItemAsync(USER_NAME);
    await SecureStore.deleteItemAsync(USER_LASTNAME);
    await SecureStore.deleteItemAsync(USER_EMAIL);
    await SecureStore.deleteItemAsync(COMPANY_ID);
    await SecureStore.deleteItemAsync(ROLE);
    await SecureStore.deleteItemAsync(BRANCH_ID);
  } catch (error) {
    console.error('Error clearing user from SecureStore', error);
  }
};

export const getRefreshToken = async () => {
  try {
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    return { refreshToken };
  } catch (error) {
    console.error('Error getting tokens from SecureStore', error);
    return { accessToken: null, refreshToken: null };
  }
};

export const setTokens = async (accessToken: string, refreshToken: string) => {
  try {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  } catch (error) {
    console.error('Error setting tokens in SecureStore', error);
  }
};

export const clearTokens = async () => {
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error clearing tokens from SecureStore', error);
  }
};
