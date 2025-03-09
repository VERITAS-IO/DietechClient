import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CreateClientRequest, QueryClientRequest, QueryClientResponse } from '@/types/client';
import { fakeClientResponses } from '@/mocks/fake-client-responses';

type StepKey = 'userRegistrationRequest' | 'createPersonaInfoRequest' | 'createLifeStyleInfoRequest' | 'createHealthInfoRequest';

interface ClientStore {
  formData: CreateClientRequest;
  currentStep: number;
  clients: QueryClientResponse[];
  setFormData: (data: Partial<CreateClientRequest>) => void;
  setCurrentStep: (step: number) => void;
  updateStepData: (step: StepKey, data: any) => void;
  resetForm: () => void;
  getClients: (request: QueryClientRequest) => Promise<QueryClientResponse[]>;
  searchClients: (query: string) => QueryClientResponse[];
}

const initialFormData: CreateClientRequest = {
  userRegistrationRequest: {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    roles: ["Client"],
  },
  createPersonaInfoRequest: {
    gender: "Unknown",
    dateOfBirth: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  },
  createLifeStyleInfoRequest: {
    physicalActivity: "Unknown",
    sleepHours: 7,
    stressLevel: "Unknown",
    smoking: "Unknown",
    alcohol: "Unknown",
  },
  createHealthInfoRequest: {
    bloodPressure: "Unknown",
    bloodType: "Unknown",
    bloodSugarLevel: undefined,
    weight: 70,
    height: 170,
    chronicConditions: "",
    allergies: "",
    activelyUsedDrugs: "",
  },
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
            [step]: { ...state.formData[step], ...data },
          },
        })),
      
      resetForm: () =>
        set({ formData: initialFormData, currentStep: 0 }),
      
      getClients: async (request) => {
        const filtered = fakeClientResponses.filter(client => {
          return true; // Add filtering logic based on request
        });
        set({ clients: filtered });
        return filtered;
      },
      
      searchClients: (query) => {
        if (!query) return [];
        const lowercaseQuery = query.toLowerCase();
        return fakeClientResponses.filter(
          client =>
            client.fullName.toLowerCase().includes(lowercaseQuery)
        );
      },
    }),
    {
      name: 'client-storage',
      partialize: (state) => ({
        clients: state.clients,
        formData: state.formData,
        currentStep: state.currentStep,
      }),
    }
  )
);