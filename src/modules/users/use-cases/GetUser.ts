import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';

export class GetUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }
}