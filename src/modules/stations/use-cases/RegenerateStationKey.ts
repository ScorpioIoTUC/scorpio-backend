import { AuthenticatedUser } from '../../auth/entities/AuthenticateUser';
import { StationCredentials } from '../entities/Station';
import { StationRepository } from '../repositories/StationRepository';
import { UserType } from '../../users/entities/User';


export class RegenerateStationKey {
  constructor(private readonly stationRepository: StationRepository) {}

  async execute(uuid: string, user: AuthenticatedUser): Promise<StationCredentials | null> {
    const owner = await this.stationRepository.findByOwnerId(uuid, user.id);
    if (!owner && user.type !== UserType.ADMIN) {
      return null;
    }
    return this.stationRepository.regenerateKey(uuid);
  }
}