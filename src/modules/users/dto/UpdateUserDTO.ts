import { UserType } from '../entities/User';

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
  type?: UserType;
}