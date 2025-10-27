import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CreateClientRequest, QueryClientRequest, QueryClientResponse } from '@/types/client';
import { queryClients, searchClientsByName } from '@/services/client-service';

type StepKey = 'userRegistrationRequest' | 'createPersonaInfoRequest' | 'createLifeStyleInfoRequest' | 'createHealthInfoRequest';

interface ClientStore {
  formData: CreateClientRequest;
  currentStep: number;
  clients: QueryClientResponse[];
  setFormData: (data: Partial<CreateClientRequest>) => void;
  setCurrentStep: (step: number) => void;
  updateStepData: (step: StepKey, data: Record<string, unknown>) => void;
  resetForm: () => void;
  getClients: (request: QueryClientRequest) => Promise<QueryClientResponse[]>;
  searchClients: (query: string) => Promise<QueryClientResponse[]>;
}

// ✅ Basit Interface (Rehberinizden: Karmaşık nested yapma)
const initialFormData: CreateClientRequest = {
  // User Registration
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  roles: ["Client"],
  
  // Persona Info
  gender: "Other",
  dateOfBirth: "",
  
  // Lifestyle Info
  physicalActivity: "None",
  sleepHours: 7,
  stressLevel: "Low",
  smoking: "None",
  alcohol: "None",
  
  // Health Info
  bloodPressure: "Normal",
  bloodType: "O_Positive",
  bloodSugarLevel: undefined,
  weight: 70,
  height: 170,
  chronicConditions: "",
  allergies: "",
  activelyUsedDrugs: "",
};

export const useClientStore = create<ClientStore>()(
  persist(
    (set) => ({
      formData: initialFormData,
      currentStep: 0,
      clients: [],
      
      setFormData: (data) => 
        set((state) => ({ formData: { ...state.formData, ...data } })),
      
      setCurrentStep: (step) => 
        set({ currentStep: step }),
      
      updateStepData: (step, data) =>
        set((state) => ({
          formData: {
            ...state.formData,
            ...data,
          },
        })),
      
      resetForm: () =>
        set({ formData: initialFormData, currentStep: 0 }),
      
      getClients: async (request) => {
        try {
          const clients = await queryClients(request);
          set({ clients });
          return clients;
        } catch (error) {
          return [];
        }
      },
      
      searchClients: async (query) => {
        if (!query || query.length < 2) return [];
        
        try {
          const results = await searchClientsByName(query);
          return results;
        } catch (error) {
          return [];
        }
      },
    }),
    {
      name: 'client-storage',
      partialize: (state) => ({
        formData: state.formData,
        currentStep: state.currentStep,
      }),
    }
  )
);