export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface UserRegistrationRequest {
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    email: string;
    phoneNumber?: string;
    roles?: string[];
  }
  
  export interface UserResponse {
    id: string;
    userName: string;
    email: string;
    roles: string[];
  }
  
  export interface AuthError {
    title: string;
    detail: string;
    status: number;
  }