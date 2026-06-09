import { Station } from '../entities/Station';
import { UpdateStationDTO } from '../dto/UpdateStationDTO';
import { StationRepository } from '../repositories/StationRepository';
import { AuthenticatedUser } from '../../auth/entities/AuthenticateUser';
import { UserType } from '../../users/entities/User';


export class UpdateStation {
  constructor(private readonly stationRepository: StationRepository) {}

  async execute(uuid: string, data: UpdateStationDTO, user: AuthenticatedUser): Promise<Station | null> {
    const owner = await this.stationRepository.findByOwnerId(user.id);
    if (!owner && user.type !== UserType.ADMIN) {
      return null;
    }
    return this.stationRepository.update(uuid, data);
  }
}