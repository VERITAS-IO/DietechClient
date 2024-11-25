import { api } from '@/lib/axios';
import { CreateClientRequest } from '@/types/client';

export const createClient = async (data: CreateClientRequest) => {
    const response = await api.post('/clients', data);
    
    return response.data;
  };