import { createClient, queryClients, getClient, searchClientsByName } from "@/services/client-service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CreateClientRequest, QueryClientRequest, QueryClientResponse } from "@/types/client";

// Client query keys
const CLIENT_KEYS = {
  all: ['clients'] as const,
  lists: () => [...CLIENT_KEYS.all, 'list'] as const,
  list: (filters: QueryClientRequest) => [...CLIENT_KEYS.lists(), filters] as const,
  details: () => [...CLIENT_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...CLIENT_KEYS.details(), id] as const,
  search: (query: string) => [...CLIENT_KEYS.all, 'search', query] as const,
};

export const useCreateClient = () => {
    return useMutation({
      mutationFn: createClient,
      onError: (error: Error) => {
        console.error('Failed to create client:', error);
      },
    });
  };

export const useGetClient = (id: number) => {
  return useQuery({
    queryKey: CLIENT_KEYS.detail(id),
    queryFn: () => getClient(id),
    enabled: !!id, // Only run if ID is provided
  });
};

export const useQueryClients = (request: QueryClientRequest) => {
  return useQuery({
    queryKey: CLIENT_KEYS.list(request),
    queryFn: () => queryClients(request),
    staleTime: 30000, // 30 seconds
  });
};

export const useSearchClients = (query: string) => {
  return useQuery({
    queryKey: CLIENT_KEYS.search(query),
    queryFn: () => searchClientsByName(query),
    enabled: query.length >= 2, // Only search if at least 2 characters
    staleTime: 30000, // 30 seconds
  });
};