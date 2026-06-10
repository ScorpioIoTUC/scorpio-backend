import { UserType } from "../../users/entities/User";

export interface AuthenticatedUser {
  id: number;
  email: string;
  type: UserType
}