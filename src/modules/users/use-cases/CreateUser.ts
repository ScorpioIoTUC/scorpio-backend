import { CreateUserDTO } from '../dto/CreateUserDTO';
import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';

export class CreateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: CreateUserDTO): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error('User already exists');
    }

    return this.userRepository.create(data);
  }
}