import { StationRepository } from '../repositories/StationRepository';

export class DeleteStation {
  constructor(private readonly stationRepository: StationRepository) {}

  async execute(uuid: string): Promise<boolean> {
    const existingStation = await this.stationRepository.findByUuid(uuid);

    if (!existingStation) {
      return false;
    }

    return this.stationRepository.delete(uuid);
  }
}