import { useSecureFetch } from './fetch';

export interface CreateCompanyDto {
  companyName: string;
}

export interface CreateBranchDto {
  branchName: string;
  address?: string;
}

export interface Branch {
  branchId: number;
  branchName: string;
  address?: string;
  companyId?: number; 
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

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

export interface Invitation {
  invitationId: number;
  employeeEmail: string;
  status: InvitationStatus;
  branchId: number;
  company?: { companyId: number; companyName: string };
  branch?: { branchId: number; branchName: string; address?: string };
  manager?: { userId: number; email: string };
}

export interface CreateInvitationDto {
  employeeEmail: string;
  branchId: number;
}

export interface InventoryItem {
  inventoryId: number;
  bundleQuantity: number;
  unitQuantity: number;
  item: Item;
}

export interface AdjustInventoryDto {
  itemId: number;
  bundleChange?: number;
  unitChange?: number;
}

export type MovementType = 'inbound' | 'sale' | 'adjustment';

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

  const getSentInvitations = async (): Promise<Invitation[]> => {
    const response = await secureFetch('/invitations/sent');
    if (!response.ok) return [];
    return response.json();
  };

  const getReceivedInvitations = async (): Promise<Invitation[]> => {
    const response = await secureFetch('/invitations/me');
    if (!response.ok) throw new Error('Error al cargar invitaciones');
    return response.json();
  };

  const createInvitation = async (data: CreateInvitationDto) => {
    const response = await secureFetch('/invitations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Error al enviar invitación');
    }
    return response.json();
  };

  const respondToInvitation = async (id: number, action: 'accept' | 'decline') => {
    const response = await secureFetch(`/invitations/${id}/${action}`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error(`Error al procesar la invitación`);
    return response.json();
  };

  const getBranchInventory = async (branchId: number): Promise<InventoryItem[]> => {
    const response = await secureFetch(`/inventory/branch/${branchId}`);
    if (!response.ok) throw new Error('Error al cargar inventario');
    return response.json();
  };

  const adjustInventory = async (branchId: number, type: MovementType, data: AdjustInventoryDto) => {
    const response = await secureFetch(`/inventory/branch/${branchId}/${type}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Error al ajustar stock');
    }
    return response.json();
  };

  const getItemBySku = async (sku: string) => {
  const response = await secureFetch(`/items/sku/${sku}`);
  if (!response.ok) {

    throw new Error('Producto no encontrado');
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
    updateItem,
    getSentInvitations,
    getReceivedInvitations,
    createInvitation,
    respondToInvitation,
    getBranchInventory,
    adjustInventory,
    getItemBySku,
  };
};
