import { AuthenticatedUser } from '../../auth/entities/AuthenticateUser';
import { UserType } from '../../users/entities/User';
import { StationRepository } from '../repositories/StationRepository';

export class DeleteStation {
  constructor(private readonly stationRepository: StationRepository) {}

  async execute(uuid: string, user: AuthenticatedUser): Promise<boolean> {
    const existingStation = await this.stationRepository.findByUuid(uuid);
    
    if (!existingStation) {
      return false;
    }
    const owner = await this.stationRepository.findByOwnerId(user.id);
    if (!owner && user.type !== UserType.ADMIN) {
      return false;
    }
    
    return this.stationRepository.delete(uuid);
  }
}