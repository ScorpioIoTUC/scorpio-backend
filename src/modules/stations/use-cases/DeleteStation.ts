import { AuthenticatedUser } from '../../auth/entities/AuthenticateUser';
import { UserType } from '../../users/entities/User';
import { StationRepository } from '../repositories/StationRepository';
import { PacketRepository } from '../../packets/repositories/PacketRepository';

export class DeleteStation {
  constructor(
    private readonly stationRepository: StationRepository,
    private readonly packetRepository: PacketRepository
  ) { }

  async execute(uuid: string, user: AuthenticatedUser): Promise<boolean> {
    const existingStation = await this.stationRepository.findByUuid(uuid);
    if (!existingStation) {
      return false;
    }
    const stationId = existingStation.id;
    const stationPackets = await this.packetRepository.findAll({
      stationUuid: uuid
    })

    if (stationPackets.data.length > 0) {
      // Remove all packets related to the current station
      await this.packetRepository.deleteAll({ stationId: stationId });

    }
    const owner = await this.stationRepository.findByOwnerId(uuid, user.id);
    if (!owner && user.type !== UserType.ADMIN) {
      return false;
    }

    return this.stationRepository.delete(uuid);
  }
}