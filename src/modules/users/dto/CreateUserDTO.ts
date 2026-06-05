import { UserType } from '../entities/User';

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  type?: UserType;
}