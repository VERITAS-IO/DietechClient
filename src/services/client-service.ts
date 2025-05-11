import { api } from '@/lib/axios';
import { CreateClientRequest, QueryClientRequest, QueryClientResponse } from '@/types/client';

export const createClient = async (data: CreateClientRequest) => {
    const response = await api.post('/clients', data);
    
    return response.data;
  };

export const getClient = async (id: number) => {
  const response = await api.get(`/clients/${id}`);
  return response.data;
};

export const queryClients = async (request: QueryClientRequest): Promise<QueryClientResponse[]> => {
  const response = await api.get('/clients', { params: request });
  return response.data;
};

export const searchClientsByName = async (query: string): Promise<QueryClientResponse[]> => {
  const response = await api.get('/clients/search', { params: { query } });
  return response.data;
};