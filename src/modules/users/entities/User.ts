export enum UserType {
  NORMAL = 'normal',
  ADMIN = 'admin',
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  type: UserType;
}