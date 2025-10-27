import { Gender, PhysicalActivity, StressLevel, Smoking, Alcohol, BloodPressure, BloodType } from './common';
import { PagedRequest } from "./request-parameters";

// ✅ Basit Interface (Rehberinizden: Karmaşık nested yapma)
export interface CreateClientRequest {
  // User Registration
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roles: string[];
  
  // Persona Info
  gender: Gender;
  dateOfBirth: string;
  
  // Lifestyle Info
  physicalActivity: PhysicalActivity;
  sleepHours: number;
  stressLevel: StressLevel;
  smoking: Smoking;
  alcohol: Alcohol;
  
  // Health Info
  bloodPressure: BloodPressure;
  bloodType: BloodType;
  bloodSugarLevel?: number;
  weight: number;
  height: number;
  chronicConditions: string;
  allergies: string;
  activelyUsedDrugs: string;
}

// ✅ Basit Query Interface
export interface QueryClientRequest extends PagedRequest {
  tenantId?: number;
  status?: string;
  search?: string;
}

export interface QueryClientResponse {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: Gender;
  dateOfBirth: Date;
}