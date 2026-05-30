import { UserType } from '../entities/User';

export interface UserResponseDTO {
  id: number;
  name: string;
  email: string;
  type: UserType;
}