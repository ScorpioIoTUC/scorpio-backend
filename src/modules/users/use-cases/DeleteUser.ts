import { UserRepository } from '../repositories/UserRepository';

export class DeleteUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number): Promise<boolean> {
    const existingUser = await this.userRepository.findById(id);

    if (!existingUser) {
      return false;
    }

    return this.userRepository.delete(id);
  }
}