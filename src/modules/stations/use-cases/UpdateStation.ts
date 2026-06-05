import { Station } from '../entities/Station';
import { UpdateStationDTO } from '../dto/UpdateStationDTO';
import { StationRepository } from '../repositories/StationRepository';

export class UpdateStation {
  constructor(private readonly stationRepository: StationRepository) {}

  async execute(uuid: string, data: UpdateStationDTO): Promise<Station | null> {
    return this.stationRepository.update(uuid, data);
  }
}