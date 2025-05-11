import { Gender } from "@/enums/gender";
import { PagedRequest } from "./request-parameters";

export interface CreateClientRequest {
  userRegistrationRequest: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    roles: string[];
  };
  createPersonaInfoRequest: {
    gender: 'Male' | 'Female' | 'Other';
    dateOfBirth: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  createLifeStyleInfoRequest: {
    physicalActivity: 'None' | 'Light' | 'Moderate' | 'Active' | 'VeryActive';
    sleepHours: number;
    stressLevel: 'Low' | 'Moderate' | 'High' | 'VeryHigh';
    smoking: 'None' | 'Occasional' | 'Regular' | 'Heavy';
    alcohol: 'None' | 'Occasional' | 'Regular' | 'Heavy';
  };
  createHealthInfoRequest: {
    bloodPressure: 'Normal' | 'HighStageOne' | 'HighStageTwo' | 'HypertensiveCrisis';
    bloodType: 'A_Postive' | 'A_Negative' | 'B_Positive' | 'B_Negative' | 'AB_Positive' | 'AB_Negative' | 'O_Positive' | 'O_Negative';
    bloodSugarLevel?: number;
    weight: number;
    height: number;
    chronicConditions: string;
    allergies: string;
    activelyUsedDrugs: string;
  };
}

export interface QueryClientRequest extends PagedRequest {
  tenantId?: number;
}

export interface QueryClientResponse {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: Gender;
  dateOfBirth: Date;
}