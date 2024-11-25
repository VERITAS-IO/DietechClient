import { createClient } from "@/services/client-service";
import { useMutation } from "@tanstack/react-query";

export const useCreateClient = () => {
    return useMutation({
      mutationFn: createClient,
      onError: (error: Error) => {
        console.error('Failed to create client:', error);
      },
    });
  };