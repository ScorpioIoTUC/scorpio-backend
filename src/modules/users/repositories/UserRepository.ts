import { User } from '../entities/User';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { UpdateUserDTO } from '../dto/UpdateUserDTO';
import { PrismaUserRepository } from './PrismaUserRepository';

export interface UserRepository {
  create(data: CreateUserDTO): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: number, data: UpdateUserDTO): Promise<User | null>;
  delete(id: number): Promise<boolean>;
}

export const userRepository: UserRepository = new PrismaUserRepository();
