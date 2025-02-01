import { QueryClientResponse } from '@/types/client';
import { Gender } from '@/enums/gender';

export const fakeClientResponses: QueryClientResponse[] = [
  {
    id: 1,
    fullName: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "+1234567890",
    gender: Gender.Male,
    dateOfBirth: new Date("1990-01-15"),
  },
  {
    id: 2,
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    phoneNumber: "+1987654321",
    gender: Gender.Female,
    dateOfBirth: new Date("1995-03-20"),
  },
  {
    id: 3,
    fullName: "Michael Johnson",
    email: "michael.johnson@example.com",
    phoneNumber: "+1122334455",
    gender: Gender.Male,
    dateOfBirth: new Date("1988-07-10"),
  },
];
