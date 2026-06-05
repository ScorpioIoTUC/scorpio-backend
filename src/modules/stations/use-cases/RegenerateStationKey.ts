import { StationCredentials } from '../entities/Station';
import { StationRepository } from '../repositories/StationRepository';

export class RegenerateStationKey {
  constructor(private readonly stationRepository: StationRepository) {}

  async execute(uuid: string): Promise<StationCredentials | null> {
    return this.stationRepository.regenerateKey(uuid);
  }
}