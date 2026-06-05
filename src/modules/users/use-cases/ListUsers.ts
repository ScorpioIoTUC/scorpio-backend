import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';

export class ListUsers {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}