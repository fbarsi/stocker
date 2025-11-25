import { useSecureFetch } from './fetch';

export const useProductsApi = () => {
  const secureFetch = useSecureFetch();

  const getProducts = async () => {
    const response = await secureFetch('/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  };

  return { getProducts };
};
