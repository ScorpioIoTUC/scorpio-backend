import { User } from '../entities/User';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { UpdateUserDTO } from '../dto/UpdateUserDTO';
import { UserType } from '../entities/User';

export interface UserRepository {
  create(data: CreateUserDTO): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: number, data: UpdateUserDTO): Promise<User | null>;
  delete(id: number): Promise<boolean>;
}

export class UserRepositoryImpl implements UserRepository {
  private users: User[] = [];
  private nextId = 1;

  async create(data: CreateUserDTO): Promise<User> {
    const user: User = {
      id: this.nextId,
      name: data.name,
      email: data.email,
      password: data.password,
      type: data.type ?? UserType.NORMAL,
    };

    this.users.push(user);
    this.nextId += 1;

    return user;
  }

  async findById(id: number): Promise<User | null> {
    return this.users.find((user) => user.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) ?? null;
  }

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  async update(id: number, data: UpdateUserDTO): Promise<User | null> {
    const user = await this.findById(id);

    if (!user) {
      return null;
    }

    const updatedUser: User = {
      ...user,
      name: data.name ?? user.name,
      email: data.email ?? user.email,
      password: data.password ?? user.password,
      type: data.type ?? user.type,
    };

    this.users = this.users.map((currentUser) =>
      currentUser.id === id ? updatedUser : currentUser,
    );

    return updatedUser;
  }

  async delete(id: number): Promise<boolean> {
    const initialLength = this.users.length;
    this.users = this.users.filter((user) => user.id !== id);
    return this.users.length !== initialLength;
  }
}

export const userRepository = new UserRepositoryImpl();