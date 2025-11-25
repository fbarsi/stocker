import { useSecureFetch } from './fetch';

export interface CreateCompanyDto {
  companyName: string;
}

export interface CreateBranchDto {
  branchName: string;
  address?: string;
}

export interface CompanyResponse {
  company: {
    companyId: number;
    companyName: string;
  };
  accessToken: string;
}

export interface Item {
  itemId: number;
  itemName: string;
  sku?: string;
  description?: string;
  unitsPerBundle: number;
}

export interface CreateItemDto {
  itemName: string;
  sku?: string;
  description?: string;
  unitsPerBundle: number;
}

export interface UpdateItemDto extends Partial<CreateItemDto> {}

export const useManagementApi = () => {
  const secureFetch = useSecureFetch();

  const getUserProfile = async () => {
    const response = await secureFetch('/users/me');
    if (!response.ok) throw new Error('Error cargando perfil');
    return response.json();
  };

  const createCompany = async (data: CreateCompanyDto): Promise<CompanyResponse> => {
    const response = await secureFetch('/companies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear la empresa');
    }
    return response.json();
  };

  const getBranches = async () => {
    const response = await secureFetch('/branches');
    if (!response.ok) throw new Error('Error cargando sucursales');
    return response.json();
  };

  const createBranch = async (data: CreateBranchDto) => {
    const response = await secureFetch('/branches', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Error al crear sucursal');
    }
    
    return response.json();
  };

  const getItems = async (): Promise<Item[]> => {
    const response = await secureFetch('/items');
    if (!response.ok) throw new Error('Error cargando catálogo');
    return response.json();
  };

  const createItem = async (data: CreateItemDto) => {
    const response = await secureFetch('/items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Error al crear artículo');
    }
    return response.json();
  };

  const updateItem = async ({ id, data }: { id: number; data: UpdateItemDto }) => {
    const response = await secureFetch(`/items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Error al actualizar artículo');
    }
    return response.json();
  };

  return { 
      getUserProfile, 
      createCompany, 
      getBranches, 
      createBranch, 
      getItems,
      createItem,
      updateItem
  };
};