import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CreateClientRequest } from '@/types/client';

type StepKey = 'userRegistrationRequest' | 'createPersonaInfoRequest' | 'createLifeStyleInfoRequest' | 'createHealthInfoRequest';

interface ClientStore {
  formData: CreateClientRequest;
  currentStep: number;
  
  setFormData: (data: Partial<CreateClientRequest>) => void;
  setCurrentStep: (step: number) => void;
  updateStepData: (step: StepKey, data: any) => void;
  resetForm: () => void;
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

      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      setCurrentStep: (step) =>
        set(() => ({
          currentStep: step,
        })),

      updateStepData: (step, data) =>
        set((state) => ({
          formData: {
            ...state.formData,
            [step]: data,
          },
        })),

      resetForm: () =>
        set(() => ({
          formData: initialFormData,
          currentStep: 0,
        })),
    }),
    {
      name: 'client-wizard-storage',
      partialize: (state) => ({
        formData: state.formData,
        currentStep: state.currentStep,
      }),
    }
  )
);